from rest_framework import status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from core.mixins import AuditModelViewSet

from .models import Grade, Result, Session
from .serializers import (
    GradeSerializer,
    ResultSerializer,
    SessionSerializer,
    UploadSerializer,
)
from .services.excel_import import import_results


def multi_value_filter(qs, params, fields):
    """Filter by comma-separated multi-select values, e.g. ?city=Karachi,Lahore."""
    for field in fields:
        raw = params.get(field)
        if raw:
            values = [v.strip() for v in raw.split(",") if v.strip()]
            if values:
                qs = qs.filter(**{f"{field}__in": values})
    return qs


class SessionViewSet(AuditModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    pagination_class = None

    def destroy(self, request, *args, **kwargs):
        session = self.get_object()
        count = Result.objects.filter(session=session.name).count()
        if count:
            return Response(
                {
                    "detail": f"Cannot delete session {session.name}: "
                    f"{count} results are linked to it."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)


class GradeViewSet(AuditModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    pagination_class = None


class ResultViewSet(AuditModelViewSet):
    serializer_class = ResultSerializer

    def get_queryset(self):
        params = self.request.query_params
        qs = multi_value_filter(
            Result.objects.all(), params, ("city", "board", "session", "campus", "grade")
        )
        search = params.get("search")
        if search:
            qs = qs.filter(student_name__icontains=search) | qs.filter(
                roll_no__icontains=search
            )
        ordering = params.get("ordering")
        allowed = {
            "percentage", "-percentage", "student_name", "-student_name",
            "roll_no", "-roll_no", "obtained_marks", "-obtained_marks",
        }
        if ordering in allowed:
            qs = qs.order_by(ordering)
        return qs

    @action(detail=False, methods=["post"], parser_classes=[MultiPartParser])
    def upload(self, request):
        serializer = UploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            summary = import_results(
                serializer.validated_data["file"],
                serializer.validated_data["session"],
                request.user,
            )
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(summary)

    @action(detail=False, methods=["post"], url_path="delete-all")
    def delete_all(self, request):
        count = Result.objects.count()
        Result.objects.all().delete()
        return Response({"deleted": count})
