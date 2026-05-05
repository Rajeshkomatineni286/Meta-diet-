from rest_framework import serializers
from .models import User

class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'height_cm', 'weight_kg', 'goal_mode', 'bmi', 'premium_unlocked']
        read_only_fields = ['id', 'email', 'premium_unlocked', 'bmi']
