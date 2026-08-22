from django.db import models
from apps.scanners.models import ScanJob
import uuid


class Report(models.Model):

    report_id = models.CharField(
        max_length=30,
        unique=True,
        editable=False
    )

    scan = models.OneToOneField(
        ScanJob,
        on_delete=models.CASCADE,
        related_name="report"
    )

    website_name = models.CharField(max_length=255)

    website_url = models.URLField()

    seo_score = models.IntegerField(default=0)

    perf_score = models.IntegerField(default=0)

    a11y_score = models.IntegerField(default=0)

    overall_score = models.IntegerField(default=0)

    total_issues = models.IntegerField(default=0)

    fixes_applied = models.IntegerField(default=0)

    summary_text = models.TextField(blank=True, default="")

    pdf_url = models.URLField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):

        if not self.report_id:
            self.report_id = f"REP-{uuid.uuid4().hex[:8].upper()}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.report_id} ({self.website_name})"
