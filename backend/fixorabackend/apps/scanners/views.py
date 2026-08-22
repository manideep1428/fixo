from django.utils import timezone
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.websites.models import Website
from .models import ScanJob
from .serializers import ScanJobListSerializer, ScanJobDetailSerializer
from .services import launch_scan


class ScanJobViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "scan_id"
    """List / retrieve scans; POST /api/scans/start/ to launch one."""

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ScanJob.objects.filter(triggered_by=self.request.user)

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ScanJobDetailSerializer
        return ScanJobListSerializer

    @action(detail=False, methods=["post"], url_path="start")
    def start(self, request):
        website_id = request.data.get("website_id")
        if not website_id:
            return Response({"detail": "website_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            website = Website.objects.get(website_id=website_id, user=request.user)
        except Website.DoesNotExist:
            return Response({"detail": "Website not found"}, status=status.HTTP_404_NOT_FOUND)

        scan = ScanJob.objects.create(
            website=website,
            triggered_by=request.user,
            url=website.url,
            status="pending",
            progress=0,
            current_step="Queued...",
        )

        website.status = "scanning"
        website.save(update_fields=["status"])

        launch_scan(scan)

        return Response(ScanJobListSerializer(scan).data, status=status.HTTP_201_CREATED)
