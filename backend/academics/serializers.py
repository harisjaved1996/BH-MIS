from rest_framework import serializers

from .models import Grade, Result, Session
from .services.grading import compute_grade, compute_percentage


class AuditFieldsMixin(serializers.ModelSerializer):
    created_by_email = serializers.EmailField(source="created_by.email", read_only=True)
    updated_by_email = serializers.EmailField(source="updated_by.email", read_only=True)


def validate_session_name(value):
    if not Session.objects.filter(name=value).exists():
        valid = ", ".join(Session.objects.values_list("name", flat=True))
        raise serializers.ValidationError(
            f"Invalid session. Valid sessions: {valid or '(none defined yet)'}"
        )
    return value


class SessionSerializer(AuditFieldsMixin):
    name = serializers.CharField(read_only=True)

    class Meta:
        model = Session
        fields = [
            "id",
            "name",
            "start_year",
            "created_by_email",
            "created_date",
            "updated_by_email",
            "updated_date",
        ]
        read_only_fields = ["created_date", "updated_date"]

    def validate_start_year(self, value):
        if not (2000 <= value <= 2100):
            raise serializers.ValidationError("Start year must be between 2000 and 2100.")
        return value

    def validate(self, attrs):
        start_year = attrs["start_year"]
        attrs["name"] = f"{start_year} - {start_year + 2}"
        dupe = Session.objects.exclude(
            pk=self.instance.pk if self.instance else None
        ).filter(start_year=start_year)
        if dupe.exists():
            raise serializers.ValidationError(f"Session {attrs['name']} already exists.")
        return attrs


class GradeSerializer(AuditFieldsMixin):
    class Meta:
        model = Grade
        fields = [
            "id",
            "name",
            "min_percentage",
            "max_percentage",
            "created_by_email",
            "created_date",
            "updated_by_email",
            "updated_date",
        ]
        read_only_fields = ["created_date", "updated_date"]

    def validate(self, attrs):
        min_pct = attrs.get(
            "min_percentage", getattr(self.instance, "min_percentage", None)
        )
        max_pct = attrs.get(
            "max_percentage", getattr(self.instance, "max_percentage", None)
        )
        if not (0 <= min_pct <= max_pct <= 100):
            raise serializers.ValidationError(
                "Percentages must satisfy 0 <= min <= max <= 100."
            )
        overlap = (
            Grade.objects.exclude(pk=self.instance.pk if self.instance else None)
            .filter(min_percentage__lte=max_pct, max_percentage__gte=min_pct)
            .first()
        )
        if overlap:
            raise serializers.ValidationError(
                f"Range overlaps with grade '{overlap.name}' "
                f"({overlap.min_percentage}% - {overlap.max_percentage}%)."
            )
        return attrs


class ResultSerializer(AuditFieldsMixin):
    percentage = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    grade = serializers.CharField(read_only=True)

    class Meta:
        model = Result
        fields = [
            "id",
            "roll_no",
            "student_name",
            "campus",
            "city",
            "board",
            "session",
            "total_marks",
            "obtained_marks",
            "percentage",
            "grade",
            "remarks",
            "created_by_email",
            "created_date",
            "updated_by_email",
            "updated_date",
        ]
        read_only_fields = ["created_date", "updated_date"]

    def validate_session(self, value):
        return validate_session_name(value)

    def validate_board(self, value):
        return value.strip().upper()

    def validate(self, attrs):
        total = attrs.get("total_marks", getattr(self.instance, "total_marks", None))
        obtained = attrs.get(
            "obtained_marks", getattr(self.instance, "obtained_marks", None)
        )
        if total is not None and total <= 0:
            raise serializers.ValidationError("Total marks must be greater than zero.")
        if obtained is not None and total is not None and obtained > total:
            raise serializers.ValidationError(
                "Obtained marks cannot exceed total marks."
            )

        roll_no = attrs.get("roll_no", getattr(self.instance, "roll_no", None))
        session = attrs.get("session", getattr(self.instance, "session", None))
        board = attrs.get("board", getattr(self.instance, "board", None))
        dupe = Result.objects.exclude(
            pk=self.instance.pk if self.instance else None
        ).filter(roll_no=roll_no, session=session, board=board)
        if dupe.exists():
            raise serializers.ValidationError(
                f"A result for roll no {roll_no} already exists in session "
                f"{session} for board {board}."
            )
        return attrs

    def save(self, **kwargs):
        # Percentage and grade are always server-computed from marks.
        total = self.validated_data.get(
            "total_marks", getattr(self.instance, "total_marks", None)
        )
        obtained = self.validated_data.get(
            "obtained_marks", getattr(self.instance, "obtained_marks", None)
        )
        percentage = compute_percentage(obtained, total)
        kwargs["percentage"] = percentage
        kwargs["grade"] = compute_grade(percentage)
        return super().save(**kwargs)


class UploadSerializer(serializers.Serializer):
    session = serializers.CharField()
    file = serializers.FileField()

    def validate_session(self, value):
        return validate_session_name(value)

    def validate_file(self, value):
        if not value.name.lower().endswith(".xlsx"):
            raise serializers.ValidationError("Only .xlsx files are supported.")
        return value
