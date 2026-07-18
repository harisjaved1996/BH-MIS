from django.contrib.auth.hashers import make_password
from django.db import migrations


def seed_admin(apps, schema_editor):
    AdminUser = apps.get_model("accounts", "AdminUser")
    AdminUser.objects.get_or_create(
        email="haris@gmail.com",
        defaults={
            "full_name": "Haris",
            "password": make_password("beaconhouse"),
            "is_active": True,
            "is_staff": True,
            "is_superuser": True,
        },
    )


def unseed_admin(apps, schema_editor):
    AdminUser = apps.get_model("accounts", "AdminUser")
    AdminUser.objects.filter(email="haris@gmail.com").delete()


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_admin, unseed_admin),
    ]
