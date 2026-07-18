from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import GradeViewSet, ResultViewSet

router = DefaultRouter()
router.register("grades", GradeViewSet, basename="grades")
router.register("results", ResultViewSet, basename="results")

urlpatterns = [
    path("", include(router.urls)),
]
