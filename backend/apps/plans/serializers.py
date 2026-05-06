from rest_framework import serializers
from .models import Plan

class BodyScanSerializer(serializers.Serializer):
    height_cm = serializers.IntegerField(min_value=90, max_value=240)
    weight_kg = serializers.FloatField(min_value=25, max_value=300)
    goal_mode = serializers.ChoiceField(choices=['cut','bulk','rebuild'])

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'
