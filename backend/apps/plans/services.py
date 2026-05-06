from typing import Dict, List

def compute_bmi(height_cm: int, weight_kg: float) -> float:
    m = height_cm / 100
    return round(weight_kg / (m * m), 2)

def healthy_weight_range(height_cm: int):
    m2 = (height_cm / 100) ** 2
    low, high = int(18.5 * m2), int(24.9 * m2)
    return low, high, int((low + high) / 2)

def diet_plan(pref: str, goal: str) -> List[dict]:
    protein = {
        'veg': ['paneer bhurji', 'dal + curd', 'soya chunks'],
        'non_veg': ['egg bhurji', 'chicken curry', 'grilled fish'],
        'eggetarian': ['boiled eggs', 'paneer tikka', 'dal + curd'],
    }[pref]
    return [
        {'meal': 'Breakfast', 'items': ['oats / poha / idli', protein[0], 'banana']},
        {'meal': 'Lunch', 'items': ['rice or roti', protein[1], 'salad']},
        {'meal': 'Snack', 'items': ['fruit', 'buttermilk / curd']},
        {'meal': 'Dinner', 'items': ['vegetables', protein[2], 'curd']},
    ]

def workout_plan(goal: str, exp: str) -> List[dict]:
    if goal == 'cut':
        return [
            {'day': 'Monday', 'focus': 'Walking + Strength', 'plan': ['40 min brisk walk', 'Squats 3x12', 'Pushups 3x10']},
            {'day': 'Tuesday', 'focus': 'Cardio', 'plan': ['25 min cycling', 'Core plank 3x40 sec']},
            {'day': 'Wednesday', 'focus': 'Home Strength', 'plan': ['Lunges 3x12', 'Dumbbell Row 3x12', 'Shoulder Press 3x10']},
            {'day': 'Thursday', 'focus': 'Active Recovery', 'plan': ['30 min walk', 'Mobility 15 min']},
            {'day': 'Friday', 'focus': 'Full Body', 'plan': ['Deadlift pattern 3x10', 'Pushups 3x12', 'Glute bridge 3x15']},
            {'day': 'Saturday', 'focus': 'Cardio + Steps', 'plan': ['30 min jog', '8k-10k steps']},
        ]
    return [
        {'day': 'Monday', 'focus': 'Chest + Triceps', 'plan': ['Bench Press 4x8', 'Incline DB Press 3x10', 'Pushups 3x12', 'Tricep Pushdown 3x12']},
        {'day': 'Tuesday', 'focus': 'Back + Biceps', 'plan': ['Lat Pulldown 4x10', 'Barbell Row 3x10', 'Seated Row 3x12', 'Bicep Curl 3x12']},
        {'day': 'Wednesday', 'focus': 'Legs', 'plan': ['Squat 4x8', 'RDL 3x10', 'Leg Press 3x12', 'Calf Raise 3x15']},
        {'day': 'Thursday', 'focus': 'Shoulders + Core', 'plan': ['Overhead Press 4x8', 'Lateral Raise 3x12', 'Plank 3x45 sec']},
            {'day': 'Friday', 'focus': 'Push/Pull Mix', 'plan': ['Incline Press 3x10', 'Pull-ups assisted 3x8', 'Tricep dips 3x10', 'Hammer curls 3x12']},
    ]

def build_body_intelligence(height_cm: int, weight_kg: float, goal_mode: str, diet_preference: str, experience_level: str) -> Dict:
    bmi = compute_bmi(height_cm, weight_kg)
    low, high, ideal = healthy_weight_range(height_cm)
    calories = int((22 * weight_kg) + {'cut': -300, 'bulk': 280, 'maintain': 0}[goal_mode])
    protein = int(weight_kg * (2.0 if goal_mode != 'maintain' else 1.6))
    water = round(max(2.5, weight_kg * 0.035), 1)
    mode_label = {'cut': 'Fat-burning mode', 'bulk': 'Muscle-building mode', 'maintain': 'Maintenance mode'}[goal_mode]

    return {
        'body_core': {'bmi': bmi, 'metabolic_state': mode_label, 'suggested_weight_range': f'{low}-{high} kg', 'ideal_target_weight': f'{ideal} kg'},
        'targets': {'daily_calories': max(1400, calories), 'protein_g': protein, 'water_liters': water},
        'daily_diet_plan': diet_plan(diet_preference, goal_mode),
        'weekly_workout_plan': workout_plan(goal_mode, experience_level),
        'todays_actions': [
            f"Hit {max(6500, int(weight_kg*110))} steps",
            f"Eat {protein}g protein across 3-4 meals",
            f"Drink {water}L water and sleep 7+ hours",
        ],
        'coach_note': 'This is an estimated healthy weight range for your height.'
    }
