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

    STATUS_CHOISES = [
        ('pending','pending'),
        ('approved','approved'),
        ('rejected','rejected'),
    ]

    borrower = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='loans')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    purpose = models.CharField(max_length=200)
    duration_months = models.IntegerField()
    status = models.CharField(max_length=20,choices=STATUS_CHOISES, default='pending')
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # KYC Verification
    aadhaar_number = models.CharField(max_length=12, blank=True, null=True)
    pan_number = models.CharField(max_length=10, blank=True, null=True)
    aadhaar_front = models.ImageField(upload_to='kyc/aadhaar_front/', blank=True, null=True)
    aadhaar_back = models.ImageField(upload_to='kyc/aadhaar_back/', blank=True, null=True)
    pan_card = models.ImageField(upload_to='kyc/pan_card/', blank=True, null=True)
    selfie = models.ImageField(upload_to='kyc/selfie/', blank=True, null=True)
    kyc_status = models.CharField(max_length=20,
                                  choices=[('Not Uploaded','Not Uploaded'), ('Under Review','Under Review'),('verified','verified')], default='Not Uploaded')

    def __str__(self):
        return f'{self.borrower.username} - {self.amount}'
    