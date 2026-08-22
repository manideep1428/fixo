from django.db import models
from apps.websites.models import Website
from apps.authentication.models import User
import uuid


class ScanJob(models.Model):

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("running", "Running"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    )

    scan_id = models.CharField(
        max_length=30,
        unique=True,
        editable=False
    )

    website = models.ForeignKey(
        Website,
        on_delete=models.CASCADE,
        related_name="scans"
    )

    triggered_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="triggered_scans"
    )

    url = models.URLField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    progress = models.IntegerField(default=0)

    current_step = models.CharField(max_length=255, blank=True, default="")

    error = models.TextField(blank=True, default="")

    started_at = models.DateTimeField(blank=True, null=True)

    finished_at = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["website", "status"]),
        ]

    def save(self, *args, **kwargs):

        if not self.scan_id:
            self.scan_id = f"SCAN-{uuid.uuid4().hex[:8].upper()}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.scan_id} ({self.status})"
