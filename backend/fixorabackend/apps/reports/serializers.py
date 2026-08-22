from rest_framework import serializers
from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="report_id", read_only=True)
    website_id = serializers.CharField(source="scan.website.website_id", read_only=True)

    class Meta:
        model = Report
        fields = (
            "id", "website_id", "website_name", "website_url", "created_at",
            "seo_score", "perf_score", "a11y_score", "overall_score",
            "total_issues", "fixes_applied", "pdf_url", "summary_text",
        )
