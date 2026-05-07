from io import BytesIO
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.http import FileResponse, HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet
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

        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=30)
        styles = getSampleStyleSheet()
        elements = []

        elements.append(Paragraph('METADIET Transformation Plan', styles['Title']))
        elements.append(Spacer(1, 16))

        profile = plan['profile']
        targets = plan['targets']
        healthy = plan['healthy_weight']

        summary = Paragraph(
            f"""
            Height: {profile.get('height_display')}<br/>
            Weight: {profile.get('weight_kg')} kg<br/>
            Goal: {profile.get('goal_mode')}<br/>
            BMI: {profile.get('bmi')}<br/>
            Healthy Weight Range: {healthy.get('range')}<br/>
            Calories: {targets.get('daily_calories')} kcal<br/>
            Protein: {targets.get('protein_g')} g<br/>
            Carbs: {targets.get('carbs_g')} g<br/>
            Fats: {targets.get('fat_g')} g<br/>
            Water Intake: {targets.get('water_liters')} L/day
            """, styles['BodyText']
        )
        elements.extend([summary, Spacer(1, 18)])

        elements.append(Paragraph('Weekly Workout Plan', styles['Heading2']))
        elements.append(Spacer(1, 8))

        workout_pref = request.data.get('workout_type', 'gym')
        key = 'home_workout' if workout_pref == 'home' else 'gym_workout'

        for day in plan['weekly_workout_plan']:
            day_block = Paragraph(
                f"""
                <b>{day.get('day')} - {day.get('focus', day.get('workout_name', 'Workout'))}</b><br/>
                Duration: {day.get('duration', '50-60 min')}<br/>
                Intensity: {day.get('intensity', 'Moderate')}<br/>
                Burn: {day.get('estimated_burn_home') if workout_pref == 'home' else day.get('estimated_burn_gym')}<br/>
                Rest: {day.get('rest_time')}<br/>
                Warmup: {day.get('warmup')}<br/>
                Main Workout:<br/>
                {'<br/>'.join(day.get(key, []))}<br/>
                Cardio: {day.get('cardio')}<br/>
                Finisher: {day.get('finisher')}<br/>
                Recovery Tip: {day.get('coach_tip')}
                """, styles['BodyText']
            )
            elements.extend([day_block, Spacer(1, 12)])

        elements.append(PageBreak())
        elements.append(Paragraph('Detailed Nutrition Plan', styles['Heading2']))
        elements.append(Spacer(1, 8))

        for meal in plan['daily_diet_plan']:
            meal_block = Paragraph(
                f"""
                <b>{meal.get('meal')} - {meal.get('time')}</b><br/>
                {meal.get('dish')}<br/>
                {'<br/>'.join(meal.get('items', []))}<br/>
                Calories: {meal.get('calories_kcal')} kcal<br/>
                Protein: {meal.get('protein_g')} g<br/>
                Carbs: {meal.get('carbs_g')} g<br/>
                Fats: {meal.get('fat_g')} g
                """, styles['BodyText']
            )
            elements.extend([meal_block, Spacer(1, 10)])

        elements.append(Spacer(1, 8))
        elements.append(Paragraph('Expected Progress Timeline', styles['Heading2']))
        elements.append(Spacer(1, 8))
        timeline = '<br/>'.join(plan.get('progress_expectations', []))
        elements.append(Paragraph(timeline, styles['BodyText']))

        doc.build(elements)
        pdf = buffer.getvalue()
        buffer.close()

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="fitness-plan.pdf"'
        response.write(pdf)
        return response

class PlanDetailView(APIView):
    def get(self, request, pk):
        plan = get_object_or_404(Plan, pk=pk, user=request.user)
        return Response(PlanSerializer(plan).data)
