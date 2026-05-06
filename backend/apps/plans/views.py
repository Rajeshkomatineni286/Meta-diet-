from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from .serializers import BodyScanSerializer, PlanSerializer
from .models import Plan
from .services import compute_bmi, generate_ai_plan

class PlansRootView(APIView):
    def get(self, request):
        plans = Plan.objects.filter(user=request.user).order_by('-created_at')[:20]
        return Response({'count': plans.count(), 'results': PlanSerializer(plans, many=True).data})

class BodyScanView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = BodyScanSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        bmi = compute_bmi(data['height_cm'], data['weight_kg'])
        generated = generate_ai_plan(data['goal_mode'], bmi)
        preview = {
            'diet_timeline': generated['diet_plan']['timeline'][:2],
            'workout_blocks': generated['workout_plan']['energy_blocks'][:2]
        }

        user = request.user if request.user and request.user.is_authenticated else None
        plan_id = None
        locked = True

        if user:
            user.height_cm = data['height_cm']
            user.weight_kg = data['weight_kg']
            user.goal_mode = data['goal_mode']
            user.bmi = bmi
            user.save(update_fields=['height_cm', 'weight_kg', 'goal_mode', 'bmi'])
            plan = Plan.objects.create(user=user, **generated, is_locked=not user.premium_unlocked)
            plan_id = plan.id
            locked = plan.is_locked

        return Response({
            'bmi': bmi,
            'goal_mode': data['goal_mode'],
            'plan_id': plan_id,
            'locked': locked,
            'preview': preview,
            'message': 'Onboarding plan generated successfully.'
        }, status=status.HTTP_200_OK)

class PlanDetailView(APIView):
    def get(self, request, pk):
        plan = get_object_or_404(Plan, pk=pk, user=request.user)
        data = PlanSerializer(plan).data
        if plan.is_locked:
            data['diet_plan'] = {'timeline': ['🔒 Unlock full nutritional system']}
            data['workout_plan'] = {'energy_blocks': ['🔒 Unlock full training protocol']}
        return Response(data)
