from django.db import models
from apps.scanners.models import ScanJob


class AnalysisResult(models.Model):

    RESULT_TYPES = (
        ("seo", "SEO"),
        ("performance", "Performance"),
        ("accessibility", "Accessibility"),
    )

    scan = models.ForeignKey(
        ScanJob,
        on_delete=models.CASCADE,
        related_name="analysis_results"
    )

    result_type = models.CharField(max_length=20, choices=RESULT_TYPES)

    score = models.IntegerField(default=0)

    # Full payload matching the frontend types exactly
    # (SeoResult | PerformanceResult | AccessibilityResult)
    payload = models.JSONField(default=dict)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = [("scan", "result_type")]

    def __str__(self):
        return f"{self.result_type} for {self.scan.scan_id} ({self.score})"
