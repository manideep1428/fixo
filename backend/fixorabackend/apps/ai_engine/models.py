from django.db import models
from apps.scanners.models import ScanJob
from apps.authentication.models import User
import uuid


class AiFix(models.Model):

    SEVERITY_CHOICES = (
        ("critical", "Critical"),
        ("high", "High"),
        ("medium", "Medium"),
        ("low", "Low"),
    )

    ISSUE_TYPE_CHOICES = (
        ("seo", "SEO"),
        ("performance", "Performance"),
        ("accessibility", "Accessibility"),
        ("general", "General"),
    )

    fix_id = models.CharField(
        max_length=30,
        unique=True,
        editable=False
    )

    scan = models.ForeignKey(
        ScanJob,
        on_delete=models.CASCADE,
        related_name="ai_fixes"
    )

    issue_type = models.CharField(
        max_length=20,
        choices=ISSUE_TYPE_CHOICES,
        default="general"
    )

    severity = models.CharField(
        max_length=20,
        choices=SEVERITY_CHOICES,
        default="medium"
    )

    title = models.CharField(max_length=255)

    description = models.TextField()

    fix_code = models.TextField(blank=True, default="")

    affected_file = models.CharField(max_length=255, blank=True, default="")

    line_number = models.IntegerField(blank=True, null=True)

    model_used = models.CharField(max_length=50, default="mistral")

    confidence = models.FloatField(default=0.0)

    applied = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):

        if not self.fix_id:
            self.fix_id = f"FIX-{uuid.uuid4().hex[:8].upper()}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.fix_id}: {self.title}"


class AiChatMessage(models.Model):

    ROLE_CHOICES = (
        ("user", "User"),
        ("assistant", "Assistant"),
        ("system", "System"),
    )

    message_id = models.CharField(
        max_length=30,
        unique=True,
        editable=False
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="ai_chat_messages"
    )

    scan = models.ForeignKey(
        ScanJob,
        on_delete=models.SET_NULL,
        related_name="chat_messages",
        blank=True,
        null=True,
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    content = models.TextField()

    model_used = models.CharField(max_length=50, blank=True, default="mistral")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def save(self, *args, **kwargs):

        if not self.message_id:
            self.message_id = f"MSG-{uuid.uuid4().hex[:8].upper()}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.role}: {self.content[:40]}"
