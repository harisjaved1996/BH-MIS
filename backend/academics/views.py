from rest_framework import status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from core.mixins import AuditModelViewSet

from .models import Grade, Result
from .serializers import GradeSerializer, ResultSerializer, UploadSerializer
from .services.excel_import import import_results


class GradeViewSet(AuditModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    pagination_class = None


class ResultViewSet(AuditModelViewSet):
    serializer_class = ResultSerializer

    def get_queryset(self):
        qs = Result.objects.all()
        params = self.request.query_params
        for field in ("city", "board", "session", "campus", "grade"):
            value = params.get(field)
            if value:
                qs = qs.filter(**{f"{field}__iexact": value})
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
