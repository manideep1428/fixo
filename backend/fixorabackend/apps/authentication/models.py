from django.db import models

# Create your models here.
# apps/authentication/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class User(AbstractUser):

    ROLE_CHOICES = (
        ("SUPER_ADMIN", "Super Admin"),
        ("ADMIN", "Admin"),
        ("USER", "User"),
    )

    user_id = models.CharField(
        max_length=30,
        unique=True,
        editable=False
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="USER"
    )

    phone_number = models.CharField(
        max_length=15,
        blank=True,
        null=True
    )

    is_verified = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def save(self, *args, **kwargs):

        if not self.user_id:
            self.user_id = f"USR-{uuid.uuid4().hex[:8].upper()}"

        super().save(*args, **kwargs)

    def __str__(self):
        return self.username