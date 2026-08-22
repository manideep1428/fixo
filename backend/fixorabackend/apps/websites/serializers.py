from rest_framework import serializers
from .models import Website


class WebsiteSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="website_id", read_only=True)
    owner = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Website
        fields = (
            "id",
            "url",
            "name",
            "status",
            "owner",
            "created_at",
            "last_scanned",
            "seo_score",
            "perf_score",
            "a11y_score",
            "overall_score",
            "total_issues",
            "tech_stack",
        )
        read_only_fields = (
            "id", "status", "owner", "created_at", "last_scanned",
            "seo_score", "perf_score", "a11y_score", "overall_score",
            "total_issues", "tech_stack",
        )
