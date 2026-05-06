from dataclasses import dataclass
from typing import Dict, List

@dataclass
class BodyProfile:
    height_cm: int
    weight_kg: float
    goal_mode: str
    bmi: float


def compute_bmi(height_cm: int, weight_kg: float) -> float:
    meters = height_cm / 100
    return round(weight_kg / (meters * meters), 2)


def _metabolism_classification(bmi: float) -> str:
    if bmi < 18.5:
        return 'adaptive-rebuild'
    if bmi < 25:
        return 'balanced'
    if bmi < 30:
        return 'fat-optimization'
    return 'high-risk-cut'


def _calorie_target(profile: BodyProfile) -> int:
    bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * 30 + 5
    tdee = bmr * 1.4
    delta = {'cut': -350, 'bulk': 300, 'rebuild': 50}[profile.goal_mode]
    return int(max(1400, tdee + delta))


def build_body_intelligence(height_cm: int, weight_kg: float, goal_mode: str) -> Dict:
    bmi = compute_bmi(height_cm, weight_kg)
    profile = BodyProfile(height_cm, weight_kg, goal_mode, bmi)
    calories = _calorie_target(profile)
    protein = int(round(weight_kg * (2.2 if goal_mode == 'cut' else 1.9)))
    fat = int(round(weight_kg * 0.8))
    carbs = max(80, int((calories - (protein * 4 + fat * 9)) / 4))

    bmi_score = max(40, min(100, int(100 - abs(22 - bmi) * 7)))
    recovery = max(50, min(95, int(60 + (protein / max(weight_kg, 1) - 1.5) * 25)))
    performance = max(45, min(95, int(55 + (carbs / 4))))
    consistency = max(55, min(98, int((bmi_score + recovery) / 2)))
    optimization = int((bmi_score + recovery + performance + consistency) / 4)

    timeline: List[dict] = [
        {'time': '07:30', 'title': 'Protein-forward breakfast', 'focus': 'metabolic activation'},
        {'time': '12:30', 'title': 'Balanced performance lunch', 'focus': 'glucose stability'},
        {'time': '16:30', 'title': 'Recovery snack', 'focus': 'muscle preservation'},
        {'time': '20:00', 'title': 'Low-noise dinner', 'focus': 'sleep & recovery'}
    ]

    recommendations = [
        f"Target {protein}g protein across 4 feedings",
        f"Keep daily hydration above {max(2.5, round(weight_kg*0.035,1))}L",
        f"Use {goal_mode} protocol with weekly body score check-ins",
    ]

    return {
        'body_core': {'bmi': bmi, 'bmi_score': bmi_score, 'optimization_score': optimization, 'goal_mode': goal_mode},
        'nutrition_matrix': {'calories': calories, 'protein_g': protein, 'carb_g': carbs, 'fat_g': fat},
        'metabolism_engine': {'classification': _metabolism_classification(bmi), 'metabolic_index': int((bmi_score + performance)/2)},
        'recovery_intelligence': {'recovery_score': recovery, 'hydration_liters': max(2.5, round(weight_kg*0.035,1))},
        'performance_signals': {'performance_score': performance, 'consistency_score': consistency},
        'timeline': timeline,
        'recommendations': recommendations,
        'workout_strategy': {'focus': 'strength + zone2', 'sessions_per_week': 4 if goal_mode == 'bulk' else 5},
        'optimization_insights': {'primary': f"{goal_mode.title()} strategy optimized for current body profile", 'secondary': 'Maintain sleep regularity to improve recovery signal'},
    }
