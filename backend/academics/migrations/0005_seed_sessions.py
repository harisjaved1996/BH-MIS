from django.db import migrations

SEED_YEARS = [2022, 2024, 2026]


def seed_sessions(apps, schema_editor):
    Session = apps.get_model("academics", "Session")
    for year in SEED_YEARS:
        Session.objects.get_or_create(
            start_year=year, defaults={"name": f"{year} - {year + 2}"}
        )


def unseed_sessions(apps, schema_editor):
    Session = apps.get_model("academics", "Session")
    Session.objects.filter(start_year__in=SEED_YEARS).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("academics", "0004_session"),
    ]

    operations = [
        migrations.RunPython(seed_sessions, unseed_sessions),
    ]
