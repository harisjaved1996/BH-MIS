from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import GradeViewSet, ResultViewSet, SessionViewSet

router = DefaultRouter()
router.register("grades", GradeViewSet, basename="grades")
router.register("results", ResultViewSet, basename="results")
router.register("sessions", SessionViewSet, basename="sessions")

urlpatterns = [
    path("", include(router.urls)),
]
