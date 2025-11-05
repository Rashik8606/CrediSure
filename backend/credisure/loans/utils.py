from django.core.mail import send_mail
from django.conf import settings
from django.core.mail import EmailMessage
from decimal import Decimal, getcontext, ROUND_HALF_UP
from dateutil.relativedelta  import relativedelta 
from .models import EmiSchedule
from django.db import transaction


def send_email(subject, message, recipient_list, html = False, attachmet = None):
    email = EmailMessage(subject, message, to=recipient_list)
    if html:
        email.content_subtype = 'html'
    if attachmet:
        for file_path in attachmet:
            email.attach_file(file_path)
    email.send(fail_silently=False)


getcontext().prec = 28

def generate_emi_schedule_for_loan(loan):
    P= Decimal(loan.amount)
    annual_rate = Decimal(loan.interest_rate)
    N = int(loan.duration_months)
    starts_date = loan.starts_date

    monthly_rate = (annual_rate / Decimal('12'))/Decimal('100')

    if monthly_rate == 0:
        emi = (P / N).quantize(Decimal('0.01')), rounding = ROUND_HALF_UP
    else:
        one_plus_r_row_n = (Decimal('1') + monthly_rate) ** N
        emi = (P * monthly_rate * one_plus_r_row_n / (one_plus_r_row_n - Decimal('1')))
        emi = emi.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

    schedule = []
    balance = P

    for m in range(1, N+1):
        interest = (balance * monthly_rate).quantize(Decimal('0.01'), rounding = ROUND_HALF_UP)
        principal_comp = (emi - interest).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

        if principal_comp > balance or m == N:
            principal_comp = balance
            emi_amount = (interest + principal_comp).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
            remaining = Decimal('0.00')
        else:
            emi_amount = emi
            remaining = (balance - principal_comp).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

        due_date = starts_date + relativedelta(month=m)
        schedule = ({
            'month_number':m,
            'due_date':due_date,
            'emi_amount':emi_amount,
            'principal_component':principal_comp,
            'interest_component':interest,
            'remaining_balance':remaining
        })
        balance = remaining

    return schedule



def create_and_save_emi_schedule(loan):
    rows = generate_emi_schedule_for_loan(loan)
    objs = []
    for r in rows:
        objs.append(EmiSchedule(
            loan = loan,
            month_number = r['month_number'],
            due_date = r['due_date'],
            emi_amount = r['emi_amount'],
            principal_component = r['principal_component'],
            interest_component = r['interest_component'],
            remaining_balance = r['remaining_balance']
        ))
    with transaction.atomic():
        EmiSchedule.objects.bulk_create(objs)