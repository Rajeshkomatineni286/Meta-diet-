import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from .serializers import BodyScanSerializer, PlanSerializer
from .models import Plan
from .services import build_body_intelligence

logger = logging.getLogger(__name__)

class PlansRootView(APIView):
    def get(self, request):
        plans = Plan.objects.filter(user=request.user).order_by('-created_at')[:20]
        return Response({'count': plans.count(), 'results': PlanSerializer(plans, many=True).data})

class BodyScanView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        s = BodyScanSerializer(data=request.data)
        if not s.is_valid():
            return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)
        intel = build_body_intelligence(**s.validated_data)
        return Response({**intel, 'message': 'Your personalized transformation coach is ready.'})

class PlanDetailView(APIView):
    def get(self, request, pk):
        plan = get_object_or_404(Plan, pk=pk, user=request.user)
        return Response(PlanSerializer(plan).data)
