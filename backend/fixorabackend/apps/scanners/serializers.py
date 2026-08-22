from rest_framework import serializers
from .models import ScanJob
from apps.analysis.models import AnalysisResult
from apps.ai_engine.models import AiFix
from apps.ai_engine.serializers import AiFixSerializer


class ScanJobListSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="scan_id", read_only=True)
    website_id = serializers.CharField(source="website.website_id", read_only=True)
    website_name = serializers.CharField(source="website.name", read_only=True)

    class Meta:
        model = ScanJob
        fields = (
            "id", "website_id", "website_name", "url", "status",
            "progress", "current_step", "started_at", "finished_at", "error",
        )


class ScanJobDetailSerializer(ScanJobListSerializer):
    results = serializers.SerializerMethodField()

    class Meta(ScanJobListSerializer.Meta):
        fields = ScanJobListSerializer.Meta.fields + ("results",)

    def get_results(self, obj):
        results = {}
        for res in obj.analysis_results.all():
            results[res.result_type] = res.payload
        results["ai_fixes"] = AiFixSerializer(obj.ai_fixes.all(), many=True).data
        results["screenshots"] = []
        return results
