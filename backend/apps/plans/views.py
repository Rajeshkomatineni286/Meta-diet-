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
        serializer = BodyScanSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning('Body scan validation failed', extra={'errors': serializer.errors})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        payload = serializer.validated_data
        intelligence = build_body_intelligence(**payload)
        user = request.user if request.user and request.user.is_authenticated else None
        plan_id, locked = None, True
        if user:
            user.height_cm = payload['height_cm']; user.weight_kg = payload['weight_kg']; user.goal_mode = payload['goal_mode']; user.bmi = intelligence['body_core']['bmi']
            user.save(update_fields=['height_cm', 'weight_kg', 'goal_mode', 'bmi'])
            plan = Plan.objects.create(
                user=user,
                diet_plan={'timeline': intelligence['timeline'], 'recommendations': intelligence['recommendations']},
                workout_plan=intelligence['workout_strategy'],
                calories=intelligence['nutrition_matrix']['calories'],
                protein_g=intelligence['nutrition_matrix']['protein_g'],
                fat_g=intelligence['nutrition_matrix']['fat_g'],
                is_locked=not user.premium_unlocked,
            )
            plan_id, locked = plan.id, plan.is_locked

        return Response({**intelligence, 'plan_id': plan_id, 'locked': locked, 'message': 'Adaptive body intelligence generated.'})

class PlanDetailView(APIView):
    def get(self, request, pk):
        plan = get_object_or_404(Plan, pk=pk, user=request.user)
        data = PlanSerializer(plan).data
        if plan.is_locked:
            data['diet_plan'] = {'timeline': ['🔒 Unlock full nutritional system']}
            data['workout_plan'] = {'energy_blocks': ['🔒 Unlock full training protocol']}
        return Response(data)
