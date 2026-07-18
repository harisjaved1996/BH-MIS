from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AdminUserViewSet, ChangePasswordView, LoginView, LogoutView, MeView

router = DefaultRouter()
router.register("admins", AdminUserViewSet, basename="admins")

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/me/", MeView.as_view(), name="me"),
    path("auth/change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("", include(router.urls)),
]
