from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
# Create your models here.


class loanRequestForm(models.Model):
    BORROWER = 'borrower'
    ADMIN = 'admin'
    ROLE_CHOICES = [
        (BORROWER, 'borrower'),
        (ADMIN, 'admin'),
    ]
    borrower = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='loans')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    purpose = models.CharField(max_length=200)
    duration_months = models.IntegerField()
    status = models.CharField(max_length=20, default='pending')
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f'{self.borrower.username} - {self.amount}'
    