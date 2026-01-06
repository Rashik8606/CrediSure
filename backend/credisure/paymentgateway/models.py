from django.db import models
from loans.models import loanRequestForm, EmiSchedule
# Create your models here.



class EmiPayment(models.Model):
    loan = models.ForeignKey(loanRequestForm, on_delete=models.CASCADE, default='payments')
    emi = models.ForeignKey(EmiSchedule, on_delete=models.CASCADE, default='payments')

    order_id = models.CharField(max_length=100)
    payment_id = models.CharField(max_length=100, null=True, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)

    status = models.CharField(
        max_length=20,
        choices=[
            ('created','created'),
            ('success','success'),
            ('failed','failed'),
        ],
        default='created'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)


    def __str__(self):
        return f'{self.loan.borrower} - EMI {self.emi.month_number}'