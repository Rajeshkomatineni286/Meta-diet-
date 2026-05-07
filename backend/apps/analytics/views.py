from rest_framework.views import APIView
from rest_framework.response import Response

class AdminMetricsView(APIView):
    def get(self, request):
        return Response({'mrr': 0, 'active_users': 0, 'conversion_rate': 0})
