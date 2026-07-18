from django.db import migrations

DEFAULT_GRADES = [
    ("A++", "95.00", "100.00"),
    ("A+", "90.00", "94.99"),
    ("A", "80.00", "89.99"),
    ("B", "70.00", "79.99"),
    ("C", "60.00", "69.99"),
    ("D", "50.00", "59.99"),
    ("E", "40.00", "49.99"),
    ("F", "0.00", "39.99"),
]


def seed_grades(apps, schema_editor):
    Grade = apps.get_model("academics", "Grade")
    if Grade.objects.exists():
        return
    for name, min_pct, max_pct in DEFAULT_GRADES:
        Grade.objects.create(name=name, min_percentage=min_pct, max_percentage=max_pct)


def unseed_grades(apps, schema_editor):
    Grade = apps.get_model("academics", "Grade")
    Grade.objects.filter(name__in=[g[0] for g in DEFAULT_GRADES]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("academics", "0002_initial"),
    ]

    operations = [
        migrations.RunPython(seed_grades, unseed_grades),
    ]
