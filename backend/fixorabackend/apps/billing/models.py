from django.db import models
from apps.authentication.models import User


class Plan(models.Model):

    TIER_CHOICES = (
        ("free", "Free"),
        ("pro", "Pro"),
        ("team", "Team"),
        ("enterprise", "Enterprise"),
    )

    tier = models.CharField(max_length=20, choices=TIER_CHOICES, unique=True)

    name = models.CharField(max_length=100)

    price_monthly = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    websites_limit = models.IntegerField(default=3)

    features = models.JSONField(default=list)

    popular = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Subscription(models.Model):

    STATUS_CHOICES = (
        ("active", "Active"),
        ("cancelled", "Cancelled"),
        ("past_due", "Past Due"),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="subscription"
    )

    plan = models.ForeignKey(
        Plan,
        on_delete=models.PROTECT,
        related_name="subscriptions"
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")

    current_period_end = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} -> {self.plan.name}"


class UsageRecord(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="usage_records"
    )

    scans_conducted = models.IntegerField(default=0)

    ai_tokens_used = models.BigIntegerField(default=0)

    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-recorded_at"]

    def __str__(self):
        return f"Usage {self.user.username} @ {self.recorded_at}"
