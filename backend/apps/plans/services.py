from typing import Dict, List

def to_cm(feet:int, inches:int) -> int:
    return int(round((feet * 12 + inches) * 2.54))

def compute_bmi(height_cm: int, weight_kg: float) -> float:
    m = height_cm / 100
    return round(weight_kg / (m * m), 2)

def healthy_weight_range(height_cm: int):
    m2 = (height_cm / 100) ** 2
    low, high = int(18.5 * m2), int(24.9 * m2)
    return low, high, int((low + high) / 2)

def _meal_template(pref: str, goal: str):
    protein_source = {
        'veg': ('Paneer', '120g'),
        'non_veg': ('Chicken breast', '140g'),
        'eggetarian': ('Eggs', '3 whole'),
    }[pref]
    dinner_protein = {
        'veg': ('Tofu', '140g'),
        'non_veg': ('Fish', '150g'),
        'eggetarian': ('Egg bhurji', '3 eggs'),
    }[pref]
    kcal_boost = 80 if goal == 'bulk' else (-80 if goal == 'cut' else 0)
    return [
        {'meal': 'Breakfast', 'time': '8:00 AM', 'dish': 'Oats Protein Chilla', 'items': ['Oats 60g', f'{protein_source[0]} {protein_source[1]}', 'Curd 100g', 'Banana 1 medium'], 'calories_kcal': 420 + kcal_boost, 'protein_g': 32, 'carbs_g': 42, 'fat_g': 14, 'why': 'High protein + slow carbs for stable energy and fewer cravings.'},
        {'meal': 'Lunch', 'time': '1:00 PM', 'dish': 'Roti Rice Thali', 'items': ['Roti 2 medium', 'Rice 120g cooked', 'Dal 200g', 'Salad 150g'], 'calories_kcal': 560 + kcal_boost, 'protein_g': 26, 'carbs_g': 72, 'fat_g': 14, 'why': 'Balanced meal to sustain energy and recovery.'},
        {'meal': 'Snack', 'time': '5:00 PM', 'dish': 'Curd Sprout Bowl', 'items': ['Curd 150g', 'Sprouts 120g', 'Roasted peanuts 20g'], 'calories_kcal': 290 + int(kcal_boost*0.3), 'protein_g': 16, 'carbs_g': 24, 'fat_g': 12, 'why': 'Supports satiety and evening appetite control.'},
        {'meal': 'Dinner', 'time': '8:30 PM', 'dish': 'Protein Dinner Plate', 'items': [f'{dinner_protein[0]} {dinner_protein[1]}', 'Vegetable sabzi 180g', 'Roti 2 or rice 100g', 'Curd 100g'], 'calories_kcal': 520 + kcal_boost, 'protein_g': 34, 'carbs_g': 48, 'fat_g': 16, 'why': 'Improves overnight recovery while keeping digestion comfortable.'},
    ]

def _day(day, name, gym, home, burn_gym, burn_home, difficulty, tip):
    return {'day': day, 'workout_name': name, 'gym_workout': gym, 'home_workout': home, 'estimated_burn_gym': burn_gym, 'estimated_burn_home': burn_home, 'difficulty': difficulty, 'rest_time': '60-90 sec between sets', 'coach_tip': tip}

def workout_plan(goal: str, exp: str) -> List[dict]:
    sets = '4' if exp != 'beginner' else '3'
    if goal == 'cut':
        return [
            _day('Monday','Chest + Fat Loss',[f'Bench Press — {sets} x 10','Incline DB Press — 3 x 12','Cable Fly — 3 x 15','Treadmill Incline Walk — 15 min'],[f'Pushups — {sets} x 15','Pike Pushups — 3 x 12','Chair Dips — 3 x 15','Band Fly — 3 x 20'],'420-550 kcal','280-380 kcal','Moderate','Focus on slow controlled reps.'),
            _day('Tuesday','Back + Conditioning',[f'Lat Pulldown — {sets} x 10','Seated Row — 3 x 12','Face Pull — 3 x 15','Bike — 12 min'],[f'Resistance Row — {sets} x 15','Superman Hold — 3 x 30 sec','Band Pull-apart — 3 x 20','Marching Jog — 12 min'],'390-500 kcal','250-340 kcal','Moderate','Keep core braced on every pull.'),
            _day('Wednesday','Legs + Core',[f'Squat — {sets} x 10','RDL — 3 x 12','Leg Press — 3 x 15','Plank — 3 x 45 sec'],[f'Bodyweight Squat — {sets} x 20','Lunges — 3 x 14','Glute Bridge — 3 x 18','Plank — 3 x 40 sec'],'430-560 kcal','290-390 kcal','Moderate','Depth and form matter more than speed.'),
        ]
    return [
        _day('Monday','Chest + Triceps',[f'Bench Press — {sets} x 8','Incline Press — 3 x 10','Cable Fly — 3 x 12','Tricep Pushdown — 3 x 12'],[f'Decline Pushups — {sets} x 12','Diamond Pushups — 3 x 10','Chair Dips — 3 x 12','Band Extensions — 3 x 15'],'360-480 kcal','240-330 kcal','Intermediate','Prioritize progressive overload weekly.'),
        _day('Tuesday','Back + Biceps',[f'Lat Pulldown — {sets} x 8','Barbell Row — 3 x 10','Seated Row — 3 x 12','Hammer Curl — 3 x 12'],[f'Band Rows — {sets} x 15','Towel Rows — 3 x 12','Backpack Curl — 3 x 15','Reverse Snow Angels — 3 x 12'],'350-470 kcal','230-320 kcal','Intermediate','Use full range of motion.'),
        _day('Wednesday','Legs + Shoulders',[f'Squat — {sets} x 8','RDL — 3 x 10','Leg Press — 3 x 12','OHP — 3 x 10'],[f'Jump Squat — {sets} x 12','Bulgarian Split Squat — 3 x 10','Pike Press — 3 x 10','Lateral Raise Band — 3 x 18'],'400-530 kcal','260-350 kcal','Intermediate','Keep tempo controlled and breathe out on effort.'),
    ]

def build_body_intelligence(height_feet:int, height_inches:int, weight_kg:float, goal_mode:str, diet_preference:str, experience_level:str='intermediate') -> Dict:
    cm = to_cm(height_feet, height_inches)
    low, high, ideal = healthy_weight_range(cm)
    calories = int((22 * weight_kg) + {'cut': -300, 'bulk': 280, 'maintain': 0}[goal_mode])
    protein = int(weight_kg * (2.0 if goal_mode != 'maintain' else 1.6))
    carbs = int((max(1400, calories) - protein*4 - int(weight_kg*0.8)*9)/4)
    fats = int(weight_kg*0.8)
    water = round(max(2.5, weight_kg * 0.035), 1)
    meals = _meal_template(diet_preference, goal_mode)
    return {
        'profile': {'height_display': f'{height_feet} ft {height_inches} in', 'weight_kg': weight_kg, 'goal_mode': goal_mode},
        'healthy_weight': {'range': f'{low}-{high} kg', 'ideal': f'{ideal} kg', 'note': 'This is a realistic healthy weight target for your height.'},
        'targets': {'daily_calories': max(1400, calories), 'protein_g': protein, 'carbs_g': carbs, 'fat_g': fats, 'water_liters': water},
        'daily_diet_plan': meals,
        'weekly_workout_plan': workout_plan(goal_mode, experience_level),
        'progress_expectations': ['Expected fat loss: 2-3 kg/month' if goal_mode == 'cut' else 'Expected muscle gain: 0.8-1.5 kg/month', 'Visible body changes may start within 4-6 weeks', 'Strength improvements expected within 2 weeks']
    }
