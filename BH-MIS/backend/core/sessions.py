from datetime import date

SESSION_START_YEAR = 2022


def session_choices():
    """Two-year academic sessions from 2022 onwards: "2022 - 2024", "2024 - 2026", ..."""
    this_year = date.today().year
    return [f"{y} - {y + 2}" for y in range(SESSION_START_YEAR, this_year + 1, 2)]
