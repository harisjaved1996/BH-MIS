from django.urls import include, path

urlpatterns = [
    path("api/", include("core.urls")),
    path("api/", include("accounts.urls")),
    path("api/", include("academics.urls")),
    path("api/", include("reports.urls")),
]
