from django.db import models
from apps.users.models import User

class Plan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    diet_plan = models.JSONField(default=dict)
    workout_plan = models.JSONField(default=dict)
    calories = models.IntegerField()
    protein_g = models.IntegerField()
    fat_g = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_locked = models.BooleanField(default=True)
