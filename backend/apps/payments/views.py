import hmac
import hashlib
import razorpay
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Payment
from apps.plans.models import Plan

class CreateOrderView(APIView):
    def post(self, request):
        amount = int(request.data.get('amount', 199900))
        if amount <= 0:
            return Response({'detail': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        order = client.order.create({'amount': amount, 'currency': 'INR', 'payment_capture': 1})
        Payment.objects.create(user=request.user, razorpay_order_id=order['id'], amount=amount, metadata={'notes': request.data.get('notes', {})})
        return Response({'order_id': order['id'], 'amount': amount, 'currency': 'INR', 'key': settings.RAZORPAY_KEY_ID}, status=status.HTTP_201_CREATED)

class VerifyPaymentView(APIView):
    def post(self, request):
        payload = request.data
        required = ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature', 'plan_id']
        if any(k not in payload for k in required):
            return Response({'detail': 'Missing payment fields'}, status=status.HTTP_400_BAD_REQUEST)

        msg = f"{payload['razorpay_order_id']}|{payload['razorpay_payment_id']}".encode()
        expected = hmac.new(settings.RAZORPAY_KEY_SECRET.encode(), msg, hashlib.sha256).hexdigest()
        paid = hmac.compare_digest(expected, payload['razorpay_signature'])

        payment = get_object_or_404(Payment, razorpay_order_id=payload['razorpay_order_id'], user=request.user)
        payment.status = 'paid' if paid else 'failed'
        payment.razorpay_payment_id = payload['razorpay_payment_id']
        payment.save(update_fields=['status', 'razorpay_payment_id'])

        if paid:
            request.user.premium_unlocked = True
            request.user.save(update_fields=['premium_unlocked'])
            Plan.objects.filter(id=payload['plan_id'], user=request.user).update(is_locked=False)

        return Response({'verified': paid}, status=status.HTTP_200_OK if paid else status.HTTP_400_BAD_REQUEST)
