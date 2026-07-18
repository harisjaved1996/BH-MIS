from decimal import ROUND_HALF_UP, Decimal

from academics.models import Grade

TWO_PLACES = Decimal("0.01")


def compute_percentage(obtained, total):
    return (Decimal(obtained) / Decimal(total) * 100).quantize(TWO_PLACES, rounding=ROUND_HALF_UP)


def compute_grade(percentage):
    """Return the grade name whose band contains `percentage`, or "" if none matches."""
    band = Grade.objects.filter(
        min_percentage__lte=percentage, max_percentage__gte=percentage
    ).first()
    return band.name if band else ""
