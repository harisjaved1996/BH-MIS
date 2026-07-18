from django.db.models import Avg, Count, Max, Min
from rest_framework.decorators import api_view
from rest_framework.response import Response

from academics.models import Grade, Result
from academics.serializers import ResultSerializer
from core.sessions import session_choices

MAX_RANKED_STUDENTS = 100


def apply_filters(qs, params):
    for field in ("city", "board", "session", "campus", "grade"):
        value = params.get(field)
        if value:
            qs = qs.filter(**{f"{field}__iexact": value})
    min_pct = params.get("min_percentage")
    max_pct = params.get("max_percentage")
    if min_pct:
        qs = qs.filter(percentage__gte=min_pct)
    if max_pct:
        qs = qs.filter(percentage__lte=max_pct)
    return qs


def _distribution(qs, field):
    rows = (
        qs.values(field)
        .annotate(avg=Avg("percentage"), count=Count("id"))
        .order_by("-avg")
    )
    return [
        {
            "label": r[field] or "N/A",
            "avg": round(float(r["avg"]), 2) if r["avg"] is not None else 0,
            "count": r["count"],
        }
        for r in rows
    ]


@api_view(["GET"])
def filters_view(request):
    def distinct(field):
        return list(
            Result.objects.exclude(**{field: ""})
            .values_list(field, flat=True)
            .distinct()
            .order_by(field)
        )

    return Response(
        {
            "cities": distinct("city"),
            "boards": distinct("board"),
            "campuses": distinct("campus"),
            "sessions": session_choices(),
            "grades": list(Grade.objects.values_list("name", flat=True)),
        }
    )


@api_view(["GET"])
def summary_view(request):
    qs = apply_filters(Result.objects.all(), request.query_params)
    kpis = qs.aggregate(
        total_students=Count("id"),
        average_percentage=Avg("percentage"),
        highest_percentage=Max("percentage"),
        lowest_percentage=Min("percentage"),
    )
    for key in ("average_percentage", "highest_percentage", "lowest_percentage"):
        kpis[key] = round(float(kpis[key]), 2) if kpis[key] is not None else None

    grade_rows = qs.values("grade").annotate(count=Count("id")).order_by("-count")
    grade_distribution = [
        {"label": r["grade"] or "N/A", "count": r["count"]} for r in grade_rows
    ]

    return Response(
        {
            "kpis": kpis,
            "grade_distribution": grade_distribution,
            "campus_comparison": _distribution(qs, "campus"),
            "city_comparison": _distribution(qs, "city"),
            "board_comparison": _distribution(qs, "board"),
        }
    )


@api_view(["GET"])
def students_view(request):
    qs = apply_filters(Result.objects.all(), request.query_params)

    def parse_count(value):
        try:
            n = int(value)
        except (TypeError, ValueError):
            return None
        return max(1, min(n, MAX_RANKED_STUDENTS))

    top = parse_count(request.query_params.get("top"))
    bottom = parse_count(request.query_params.get("bottom"))
    if top:
        qs = qs.order_by("-percentage", "student_name")[:top]
    elif bottom:
        qs = qs.order_by("percentage", "student_name")[:bottom]
    else:
        qs = qs.order_by("-percentage", "student_name")[:10]

    return Response({"students": ResultSerializer(qs, many=True).data})
