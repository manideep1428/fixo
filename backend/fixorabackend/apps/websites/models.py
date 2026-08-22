from django.db import models
from apps.authentication.models import User
import uuid


class Website(models.Model):

    STATUS_CHOICES = (
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("scanning", "Scanning"),
        ("error", "Error"),
    )

    website_id = models.CharField(
        max_length=30,
        unique=True,
        editable=False
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="websites"
    )

    name = models.CharField(max_length=255)

    url = models.URLField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="active"
    )

    last_scanned = models.DateTimeField(blank=True, null=True)

    seo_score = models.IntegerField(blank=True, null=True)

    perf_score = models.IntegerField(blank=True, null=True)

    a11y_score = models.IntegerField(blank=True, null=True)

    overall_score = models.IntegerField(blank=True, null=True)

    total_issues = models.IntegerField(default=0)

    tech_stack = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "status"]),
        ]

    def save(self, *args, **kwargs):

        if not self.website_id:
            self.website_id = f"WEB-{uuid.uuid4().hex[:8].upper()}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.website_id})"