from django.db import models
from apps.users.models import User

class Payment(models.Model):
    STATUS = [('created','created'),('paid','paid'),('failed','failed')]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    razorpay_order_id = models.CharField(max_length=120, unique=True)
    razorpay_payment_id = models.CharField(max_length=120, blank=True)
    amount = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS, default='created')
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
