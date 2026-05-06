from rest_framework import serializers
from .models import Plan

class BodyScanSerializer(serializers.Serializer):
    height_feet = serializers.IntegerField(min_value=4, max_value=8)
    height_inches = serializers.IntegerField(min_value=0, max_value=11)
    weight_kg = serializers.FloatField(min_value=30, max_value=250)
    goal_mode = serializers.ChoiceField(choices=['cut','bulk','maintain'])
    diet_preference = serializers.ChoiceField(choices=['veg', 'non_veg', 'eggetarian'])
    experience_level = serializers.ChoiceField(choices=['beginner', 'intermediate'])

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'
