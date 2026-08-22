from rest_framework import serializers
from .models import AnalysisResult


class AnalysisResultSerializer(serializers.ModelSerializer):
    scan_id = serializers.CharField(source="scan.scan_id", read_only=True)

    class Meta:
        model = AnalysisResult
        fields = ("id", "scan_id", "result_type", "score", "payload", "created_at")
