from rest_framework.views import APIView
from rest_framework.response import Response

class NotifyPreview(APIView):
    def post(self, request):
        return Response({'email': 'queued', 'whatsapp': 'queued'})
