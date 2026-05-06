from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

@shared_task
def send_plan_delivery_email(to_email: str, subject: str, body: str):
    send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [to_email], fail_silently=False)
    return {'status': 'sent'}
