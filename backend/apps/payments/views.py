import hmac, hashlib
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from .models import Payment

class CreateOrderView(APIView):
    def post(self, request):
        amount = request.data.get('amount', 199900)
        order_id = f'order_demo_{request.user.id}'
        p = Payment.objects.create(user=request.user, razorpay_order_id=order_id, amount=amount)
        return Response({'order_id': p.razorpay_order_id, 'amount': amount, 'currency': 'INR'})

class VerifyPaymentView(APIView):
    def post(self, request):
        payload = request.data
        msg = f"{payload['razorpay_order_id']}|{payload['razorpay_payment_id']}".encode()
        expected = hmac.new(settings.RAZORPAY_KEY_SECRET.encode(), msg, hashlib.sha256).hexdigest()
        paid = expected == payload['razorpay_signature']
        Payment.objects.filter(razorpay_order_id=payload['razorpay_order_id']).update(status='paid' if paid else 'failed', razorpay_payment_id=payload['razorpay_payment_id'])
        return Response({'verified': paid})
