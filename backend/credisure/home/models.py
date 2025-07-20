from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin','admin'),
        ('borrower','borrower')
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='borrower')

    def __str__(self):
        return f'{self.username} ({self.role})'