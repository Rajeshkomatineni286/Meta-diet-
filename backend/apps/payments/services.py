import razorpay
from django.conf import settings

def razorpay_client():
    return razorpay.Client(auth=(getattr(settings,'RAZORPAY_KEY_ID',''), getattr(settings,'RAZORPAY_KEY_SECRET','')))
