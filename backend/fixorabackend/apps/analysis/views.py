from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import AnalysisResult
from .serializers import AnalysisResultSerializer


class AnalysisResultViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AnalysisResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = AnalysisResult.objects.filter(scan__triggered_by=self.request.user)
        scan_id = self.request.query_params.get("scan")
        result_type = self.request.query_params.get("type")
        if scan_id:
            queryset = queryset.filter(scan__scan_id=scan_id)
        if result_type:
            queryset = queryset.filter(result_type=result_type)
        return queryset

    @action(detail=False, methods=["get"], url_path="latest")
    def latest(self, request):
        """Latest result per type for a website: /api/analysis/latest/?website=WEB-XXXX"""
        website_id = request.query_params.get("website")
        if not website_id:
            return Response({"detail": "website is required"}, status=400)
        results = {}
        for res in (
            AnalysisResult.objects
            .filter(scan__website__website_id=website_id, scan__triggered_by=request.user)
            .order_by("-created_at")
        ):
            results.setdefault(res.result_type, res.payload)
        return Response(results)
