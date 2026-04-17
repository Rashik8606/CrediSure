from django.db import models
# Create your models here.



class EmiPayment(models.Model):
    loan_id = models.IntegerField()
    emi_id = models.IntegerField()
    user_id = models.IntegerField()

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
        return f'Loan {self.loan_id} - EMI {self.emi_id}'