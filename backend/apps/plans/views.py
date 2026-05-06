from io import BytesIO
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.http import FileResponse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from .serializers import BodyScanSerializer, PlanSerializer
from .models import Plan
from .services import build_body_intelligence
from django.shortcuts import get_object_or_404

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

class ExportPlanPdfView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        s = BodyScanSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        plan = build_body_intelligence(**s.validated_data)
        buff = BytesIO(); c = canvas.Canvas(buff, pagesize=A4); y=800
        c.setFont('Helvetica-Bold',16); c.drawString(40,y,'METADIET Transformation Plan'); y-=28
        c.setFont('Helvetica',11)
        c.drawString(40,y,f"Height: {plan['profile']['height_display']}  Weight: {plan['profile']['weight_kg']} kg"); y-=18
        c.drawString(40,y,f"Healthy Range: {plan['healthy_weight']['range']}  Ideal: {plan['healthy_weight']['ideal']}"); y-=24
        c.drawString(40,y,f"Calories: {plan['targets']['daily_calories']}  Protein: {plan['targets']['protein_g']}g  Water: {plan['targets']['water_liters']}L"); y-=24
        c.setFont('Helvetica-Bold',12); c.drawString(40,y,'Diet Plan'); y-=18; c.setFont('Helvetica',10)
        for m in plan['daily_diet_plan']:
            c.drawString(40,y,f"{m['meal']}: {m['dish']} ({m['calories_kcal']} kcal, P{m['protein_g']} C{m['carbs_g']} F{m['fat_g']})"); y-=14
        y-=10; c.setFont('Helvetica-Bold',12); c.drawString(40,y,'Workout Plan'); y-=18; c.setFont('Helvetica',10)
        for d in plan['weekly_workout_plan']:
            c.drawString(40,y,f"{d['day']} - {d['focus']}"); y-=13
            for ex in d['exercises'][:3]: c.drawString(60,y,f"• {ex}"); y-=12
        c.showPage(); c.save(); buff.seek(0)
        return FileResponse(buff, as_attachment=True, filename='metadiet-plan.pdf', content_type='application/pdf')

class PlanDetailView(APIView):
    def get(self, request, pk):
        plan = get_object_or_404(Plan, pk=pk, user=request.user)
        return Response(PlanSerializer(plan).data)
