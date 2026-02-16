from django.db.models.signals import post_save,pre_save
from django.dispatch import receiver
from .models import loanRequestForm, EmiSchedule
from .utils import create_and_save_emi_schedule,send_email


@receiver(post_save, sender=loanRequestForm)
def create_schedule_on_approval(sender, instance, created, **kwargs):
    if instance.status == 'approved':
        if not EmiSchedule.objects.filter(loan=instance).exists():
            create_and_save_emi_schedule(instance)


@receiver(pre_save, sender=loanRequestForm)
def loan_status_change_email(sender, instance, **kwargs):
    if not instance.pk:
        return  # new object, skip

    old = loanRequestForm.objects.get(pk=instance.pk)

    if old.status != instance.status:
        subject = f"Your Loan Request has been {instance.status.capitalize()}"

        message = f"""
        <html>
        <body style="font-family:Arial,sans-serif; background-color:#f9f9f9; padding:20px;">
            <div style="background-color:#ffffff; border-radius:8px; padding:20px;
                        max-width:600px; margin:auto;
                        box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                <h2 style="color:#007bff;">Loan Update - Credisure</h2>

                <p>Hi <b>{instance.borrower.username}</b>,</p>

                <p>
                    Your loan request of <b>₹{instance.amount}</b>
                    has been <b>{instance.status.upper()}</b>.
                </p>

                <p>
                    Thank you for choosing <b>Credisure</b> —
                    we appreciate your trust in us.
                </p>

                <br>

                <p style="font-size:14px; color:#555;">
                    Best regards,<br>
                    <b>Rashik</b><br>
                    CEO, Credisure
                </p>
            </div>
        </body>
        </html>
        """

        send_email(
            subject,
            message,
            [instance.borrower.email],
            html=True
        )