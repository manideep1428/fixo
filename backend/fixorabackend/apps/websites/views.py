from rest_framework import viewsets, permissions

from .models import Website
from .serializers import WebsiteSerializer


class WebsiteViewSet(viewsets.ModelViewSet):
    lookup_field = "website_id"
    """CRUD for the authenticated user's websites."""

    serializer_class = WebsiteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Website.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
