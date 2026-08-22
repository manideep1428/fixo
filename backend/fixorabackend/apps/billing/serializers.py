from rest_framework import serializers
from .models import Plan, Subscription


class PlanSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="tier", read_only=True)
    ai_scans_included = serializers.SerializerMethodField()

    class Meta:
        model = Plan
        fields = ("id", "name", "price_monthly", "ai_scans_included", "websites_limit", "features", "popular")

    def get_ai_scans_included(self, obj):
        return "Unlimited (Ollama Local)"
