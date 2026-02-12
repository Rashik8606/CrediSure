from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from decimal import Decimal
from django.utils import timezone
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
    #EMI FIELDS
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('12.00'))
    starts_date = models.DateField(default=timezone.now)
    # KYC Verification
    aadhaar_number = models.CharField(max_length=12, blank=True, null=True)
    pan_number = models.CharField(max_length=10, blank=True, null=True)
    aadhaar_front = models.ImageField(upload_to='kyc/aadhaar_front/', blank=True, null=True)
    aadhaar_back = models.ImageField(upload_to='kyc/aadhaar_back/', blank=True, null=True)
    pan_card = models.ImageField(upload_to='kyc/pan_card/', blank=True, null=True)
    selfie = models.ImageField(upload_to='kyc/selfie/', blank=True, null=True)
    kyc_status = models.CharField(max_length=20,
                                  choices=[('NOT_UPLOAD','Not Uploaded'), ('UNDER_REVIEW','Under Review'),('VERIFIED','verified')], default='NOT_UPLOAD')

    def __str__(self):
        return f'{self.borrower.username} - {self.amount}'
    

class EmiSchedule(models.Model):
    loan = models.ForeignKey(loanRequestForm, on_delete=models.CASCADE, related_name='emis')
    month_number = models.IntegerField()
    due_date = models.DateField()
    emi_amount = models.DecimalField(max_digits=12, decimal_places=2)
    principal_component  = models.DecimalField(max_digits=12, decimal_places=2)
    interest_component  = models.DecimalField(max_digits=12, decimal_places=2)
    remaining_balance = models.DecimalField(max_digits=12, decimal_places=2)
    paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['month_number']