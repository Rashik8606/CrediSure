from django.core.mail import send_mail
from django.conf import settings
from django.core.mail import EmailMessage


def send_email(subject, message, recipient_list, html = False, attachmet = None):
    email = EmailMessage(subject, message, to=recipient_list)
    if html:
        email.content_subtype = 'html'
    if attachmet:
        for file_path in attachmet:
            email.attach_file(file_path)
    email.send(fail_silently=False)