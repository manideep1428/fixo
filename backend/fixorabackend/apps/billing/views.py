from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.scanners.models import ScanJob
from apps.websites.models import Website
from .models import Plan, Subscription
from .serializers import PlanSerializer


class PlanListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        plans = Plan.objects.all().order_by("price_monthly")
        return Response(PlanSerializer(plans, many=True).data)


class SubscriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sub = getattr(request.user, "subscription", None)
        return Response({"plan": PlanSerializer(sub.plan).data if sub else None})

    def post(self, request):
        tier = request.data.get("tier")
        try:
            plan = Plan.objects.get(tier=tier)
        except Plan.DoesNotExist:
            return Response({"detail": "Unknown plan tier"}, status=400)
        sub, _ = Subscription.objects.update_or_create(
            user=request.user,
            defaults={"plan": plan, "status": "active"},
        )
        return Response({"plan": PlanSerializer(plan).data})


class UsageView(APIView):
    """Returns UsageStats matching the frontend type."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        scans = ScanJob.objects.filter(triggered_by=request.user).count()
        websites_count = Website.objects.filter(user=request.user).count()
        sub = getattr(request.user, "subscription", None)
        limit = sub.plan.websites_limit if sub else 3
        cloud_cost_saved = round(scans * 0.45, 2)  # vs typical OpenAI scan cost
        return Response({
            "scans_conducted": scans,
            "scans_limit": "Unlimited",
            "ai_tokens_used": 0,
            "cloud_cost_saved": cloud_cost_saved,
            "websites_count": websites_count,
            "websites_limit": limit,
        })
