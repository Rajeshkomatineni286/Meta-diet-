from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import BodyScanSerializer, PlanSerializer
from .models import Plan
from .services import compute_bmi, generate_ai_plan

class BodyScanView(APIView):
    def post(self, request):
        serializer = BodyScanSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        bmi = compute_bmi(data['height_cm'], data['weight_kg'])
        generated = generate_ai_plan(data['goal_mode'], bmi)

        user = request.user
        user.height_cm = data['height_cm']
        user.weight_kg = data['weight_kg']
        user.goal_mode = data['goal_mode']
        user.bmi = bmi
        user.save(update_fields=['height_cm', 'weight_kg', 'goal_mode', 'bmi'])

        plan = Plan.objects.create(user=user, **generated, is_locked=not user.premium_unlocked)
        preview = {'diet_timeline': generated['diet_plan']['timeline'][:1], 'workout_blocks': generated['workout_plan']['energy_blocks'][:1]}
        return Response({'bmi': bmi, 'plan_id': plan.id, 'locked': plan.is_locked, 'preview': preview}, status=status.HTTP_201_CREATED)

class PlanDetailView(APIView):
    def get(self, request, pk):
        plan = get_object_or_404(Plan, pk=pk, user=request.user)
        data = PlanSerializer(plan).data
        if plan.is_locked:
            data['diet_plan'] = {'timeline': ['🔒 Unlock full nutritional system']}
            data['workout_plan'] = {'energy_blocks': ['🔒 Unlock full training protocol']}
        return Response(data)
