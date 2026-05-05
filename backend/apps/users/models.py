from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    GOAL_CHOICES = [('cut','Cut'),('bulk','Bulk'),('rebuild','Rebuild')]
    height_cm = models.PositiveIntegerField(null=True, blank=True)
    weight_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    goal_mode = models.CharField(max_length=20, choices=GOAL_CHOICES, default='rebuild')
    bmi = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    premium_unlocked = models.BooleanField(default=False)
