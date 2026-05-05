from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import BodyScanSerializer, PlanSerializer
from .models import Plan
from .services import compute_bmi, generate_ai_plan

class BodyScanView(APIView):
    def post(self, request):
        s = BodyScanSerializer(data=request.data); s.is_valid(raise_exception=True)
        data = s.validated_data
        bmi = compute_bmi(data['height_cm'], data['weight_kg'])
        p = generate_ai_plan(data['goal_mode'], bmi)
        plan = Plan.objects.create(user=request.user, **p)
        return Response({'bmi': bmi, 'preview': {'diet': p['diet_plan'], 'workout': p['workout_plan']}, 'plan_id': plan.id, 'locked': True})

class PlanDetailView(APIView):
    def get(self, request, pk):
        plan = Plan.objects.get(pk=pk, user=request.user)
        return Response(PlanSerializer(plan).data)
