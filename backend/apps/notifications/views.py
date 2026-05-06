from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .tasks import send_plan_delivery_email

class NotifyPreview(APIView):
    def post(self, request):
        email = request.data.get('email') or request.user.email
        if not email:
            return Response({'detail': 'Email required'}, status=status.HTTP_400_BAD_REQUEST)
        task = send_plan_delivery_email.delay(email, 'Metadiet Plan Ready', 'Your Neural Body OS plan has been unlocked.')
        return Response({'email': 'queued', 'task_id': task.id, 'whatsapp': 'configure provider webhook'}, status=status.HTTP_202_ACCEPTED)
