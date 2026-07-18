from django.urls import path

from .views import filters_view, students_view, summary_view

urlpatterns = [
    path("dashboard/filters/", filters_view, name="dashboard-filters"),
    path("dashboard/summary/", summary_view, name="dashboard-summary"),
    path("dashboard/students/", students_view, name="dashboard-students"),
]
