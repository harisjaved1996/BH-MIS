from django.urls import path

from .views import sessions_view

urlpatterns = [
    path("sessions/", sessions_view, name="sessions"),
]
