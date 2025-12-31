from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import loanRequestForm, EmiSchedule
from .utils import create_and_save_emi_schedule


@receiver(post_save, sender=loanRequestForm)
def create_schedule_on_approval(sender, instance, created, **kwargs):
    if instance.status == 'approved':
        if not EmiSchedule.objects.filter(loan=instance).exists():
            create_and_save_emi_schedule(instance)