from django.db import models

# Create your models here.
# apps/websites/models.py

from django.db import models
from apps.authentication.models import User
import uuid


class Website(models.Model):

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

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):

        if not self.website_id:
            self.website_id = f"WEB-{uuid.uuid4().hex[:8].upper()}"

        super().save(*args, **kwargs)