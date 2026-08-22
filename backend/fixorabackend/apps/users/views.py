from rest_framework import viewsets, permissions

from apps.authentication.serializers import UserSerializer
from .models import UserProfile


class TeamMemberViewSet(viewsets.ReadOnlyModelViewSet):
    """Team members of the current workspace (admin sees all users)."""

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ("SUPER_ADMIN", "ADMIN"):
            from apps.authentication.models import User
            return User.objects.all()
        from apps.authentication.models import User
        return User.objects.filter(pk=user.pk)


class ProfileViewSet(viewsets.ModelViewSet):
    http_method_names = ["get", "patch"]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)
