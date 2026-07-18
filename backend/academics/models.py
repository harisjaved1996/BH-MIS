from django.core.exceptions import ValidationError
from django.db import models

from core.models import AuditModel


class Session(AuditModel):
    name = models.CharField(max_length=11, unique=True)
    start_year = models.PositiveIntegerField(unique=True)

    class Meta:
        ordering = ["start_year"]

    def __str__(self):
        return self.name


class Grade(AuditModel):
    name = models.CharField(max_length=10, unique=True)
    min_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    max_percentage = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        ordering = ["-min_percentage"]

    def __str__(self):
        return f"{self.name} ({self.min_percentage}% - {self.max_percentage}%)"

    def clean(self):
        if self.min_percentage is None or self.max_percentage is None:
            return
        if not (0 <= self.min_percentage <= self.max_percentage <= 100):
            raise ValidationError("Percentages must satisfy 0 <= min <= max <= 100.")
        overlap = (
            Grade.objects.exclude(pk=self.pk)
            .filter(
                min_percentage__lte=self.max_percentage,
                max_percentage__gte=self.min_percentage,
            )
            .first()
        )
        if overlap:
            raise ValidationError(
                f"Range overlaps with grade '{overlap.name}' "
                f"({overlap.min_percentage}% - {overlap.max_percentage}%)."
            )


class Result(AuditModel):
    roll_no = models.CharField(max_length=30)
    student_name = models.CharField(max_length=150)
    campus = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    board = models.CharField(max_length=100)
    session = models.CharField(max_length=11)
    total_marks = models.PositiveIntegerField()
    obtained_marks = models.PositiveIntegerField()
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    grade = models.CharField(max_length=10, blank=True)
    remarks = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["-percentage"]
        constraints = [
            models.UniqueConstraint(
                fields=["roll_no", "session", "board"],
                name="uniq_result_roll_session_board",
            )
        ]

    def __str__(self):
        return f"{self.roll_no} - {self.student_name} ({self.session})"
