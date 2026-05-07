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
        {'meal': 'Breakfast', 'time': '8:00 AM', 'dish': 'Oats Protein Chilla', 'items': ['Oats 60g', f'{protein_source[0]} {protein_source[1]}', 'Curd 100g', 'Banana 1 medium'], 'calories_kcal': 420 + kcal_boost, 'protein_g': 32, 'carbs_g': 42, 'fat_g': 14},
        {'meal': 'Lunch', 'time': '1:00 PM', 'dish': 'Roti Rice Thali', 'items': ['Roti 2 medium', 'Rice 120g cooked', 'Dal 200g', 'Salad 150g'], 'calories_kcal': 560 + kcal_boost, 'protein_g': 26, 'carbs_g': 72, 'fat_g': 14},
        {'meal': 'Snack', 'time': '5:00 PM', 'dish': 'Curd Sprout Bowl', 'items': ['Curd 150g', 'Sprouts 120g', 'Roasted peanuts 20g'], 'calories_kcal': 290 + int(kcal_boost*0.3), 'protein_g': 16, 'carbs_g': 24, 'fat_g': 12},
        {'meal': 'Dinner', 'time': '8:30 PM', 'dish': 'Protein Dinner Plate', 'items': [f'{dinner_protein[0]} {dinner_protein[1]}', 'Vegetable sabzi 180g', 'Roti 2 or rice 100g', 'Curd 100g'], 'calories_kcal': 520 + kcal_boost, 'protein_g': 34, 'carbs_g': 48, 'fat_g': 16},
    ]

def _day(day, focus, gym, home, burn_gym, burn_home, intensity, duration, rest, warmup, finisher, cardio, tip):
    return {
        'day': day,
        'focus': focus,
        'workout_name': focus,
        'gym_workout': gym,
        'home_workout': home,
        'estimated_burn_gym': burn_gym,
        'estimated_burn_home': burn_home,
        'intensity': intensity,
        'duration': duration,
        'rest_time': rest,
        'warmup': warmup,
        'finisher': finisher,
        'cardio': cardio,
        'coach_tip': tip,
    }

def workout_plan(goal: str, exp: str) -> List[dict]:
    sets = '4' if exp != 'beginner' else '3'
    if goal == 'cut':
        return [
            _day('Monday', 'Upper Body Strength', [f'Bench Press — {sets} x 8', 'Seated Cable Row — 4 x 10', 'Dumbbell Shoulder Press — 3 x 12', 'Lat Pulldown — 3 x 12'], [f'Pushups — {sets} x 12', 'Resistance Band Row — 4 x 12', 'Pike Press — 3 x 10', 'Band Lat Pulldown — 3 x 15'], '420-550 kcal', '300-390 kcal', 'Moderate-High', '60 min', '75 sec', 'Dynamic mobility + incline walk 5 min', 'Battle rope intervals 3 rounds', '10 min bike intervals', 'Keep tempo controlled and add load weekly.'),
            _day('Tuesday', 'Lower Body + Core', [f'Back Squat — {sets} x 8', 'Romanian Deadlift — 4 x 10', 'Walking Lunges — 3 x 12/leg', 'Cable Crunch — 3 x 15'], [f'Goblet Squat — {sets} x 12', 'Hip Hinge with backpack — 4 x 12', 'Reverse Lunges — 3 x 12/leg', 'Plank shoulder taps — 3 x 30 sec'], '430-560 kcal', '310-400 kcal', 'Moderate', '58 min', '75 sec', 'Hip opener flow + glute activation', 'Sled push / stair climb 8 min', '12 min incline walk', 'Prioritize full depth and stable core bracing.'),
            _day('Wednesday', 'Conditioning + Mobility', ['Kettlebell Swing — 4 x 15', 'Row Erg — 6 x 250m', 'TRX Rows — 3 x 12', 'Dead Bug — 3 x 12'], ['Jump Rope — 6 x 60 sec', 'Mountain Climbers — 5 x 30 sec', 'Band Pull Apart — 3 x 20', 'Dead Bug — 3 x 12'], '360-480 kcal', '260-340 kcal', 'Moderate', '45 min', '45 sec', 'Joint prep + dynamic stretch 8 min', 'Farmer carry 4 x 40m', 'Steady state jog 15 min', 'Today is about movement quality and recovery pace.'),
            _day('Thursday', 'Push Hypertrophy', [f'Incline DB Press — {sets} x 10', 'Machine Chest Press — 3 x 12', 'Cable Lateral Raise — 3 x 15', 'Overhead Tricep Extension — 3 x 12'], [f'Decline Pushups — {sets} x 12', 'Chair Dips — 3 x 15', 'Band Lateral Raise — 3 x 18', 'Diamond Pushups — 3 x 10'], '400-520 kcal', '280-360 kcal', 'Moderate-High', '55 min', '60 sec', 'Band shoulder warmup + scap activation', 'Pushup burnout 2 sets', 'Rower intervals 8 min', 'Chase a deep muscle pump with strict form.'),
            _day('Friday', 'Pull Hypertrophy', [f'Chest Supported Row — {sets} x 10', 'Single Arm Lat Pulldown — 3 x 12', 'Face Pull — 3 x 15', 'EZ Bar Curl — 3 x 12'], [f'Backpack Row — {sets} x 12', 'Towel Row — 3 x 12', 'Band Face Pull — 3 x 18', 'Hammer Curl with dumbbells — 3 x 12'], '390-510 kcal', '270-350 kcal', 'Moderate', '55 min', '60 sec', 'Thoracic mobility + light rows', 'Bike sprint 6 rounds', '12 min incline walk', 'Pause at peak contraction on every pull rep.'),
            _day('Saturday', 'Athletic Conditioning', ['Sled Push — 6 rounds', 'Medicine Ball Slams — 4 x 12', 'Box Step Ups — 3 x 14', 'Hanging Knee Raise — 3 x 12'], ['Shuttle Runs — 8 rounds', 'Burpees — 4 x 10', 'Step Ups — 3 x 16', 'Leg Raises — 3 x 12'], '450-590 kcal', '320-420 kcal', 'High', '50 min', '45 sec', 'Movement prep + ankle mobility', 'Assault bike finisher 6 min', 'Light recovery walk 10 min', 'Strong effort day—hydrate aggressively post workout.'),
            _day('Sunday', 'Recovery + Walking', ['Recovery walk 35-45 min', 'Mobility flow 20 min', 'Breathing drills 8 min'], ['Recovery walk 35-45 min', 'Yoga flow 20 min', 'Breathing drills 8 min'], '180-260 kcal', '160-230 kcal', 'Low', '45 min', 'As needed', 'Gentle full-body mobility', 'None', 'Easy walk only', 'Keep intensity low; this is your reset day.'),
        ]

    return [
        _day('Monday', 'Chest + Triceps', [f'Bench Press — {sets} x 6', 'Incline DB Press — 4 x 8', 'Cable Fly — 3 x 12', 'Tricep Pushdown — 3 x 12'], [f'Decline Pushups — {sets} x 10', 'Floor Press — 4 x 10', 'Band Fly — 3 x 15', 'Chair Dips — 3 x 12'], '380-500 kcal', '260-340 kcal', 'Moderate-High', '62 min', '90 sec', 'Band warmup + shoulder prep', 'Pushup mechanical drop-set', '8 min easy bike', 'Control eccentric tempo on presses.'),
        _day('Tuesday', 'Back + Biceps', [f'Weighted Pullup/Lat Pulldown — {sets} x 6', 'Barbell Row — 4 x 8', 'Seated Row — 3 x 10', 'Incline Curl — 3 x 12'], [f'Band Pulldown — {sets} x 12', 'Backpack Row — 4 x 10', 'Towel Row — 3 x 12', 'Biceps Curl — 3 x 15'], '370-490 kcal', '250-330 kcal', 'Moderate-High', '60 min', '90 sec', 'Thoracic opener + activation', 'Farmer hold 3 x 40 sec', '10 min incline walk', 'Drive elbows to hips on vertical pulls.'),
        _day('Wednesday', 'Legs', [f'Back Squat — {sets} x 6', 'Romanian Deadlift — 4 x 8', 'Leg Press — 3 x 12', 'Walking Lunges — 3 x 12/leg'], [f'Goblet Squat — {sets} x 12', 'Hip Hinge with dumbbells — 4 x 10', 'Split Squat — 3 x 12/leg', 'Calf Raise — 3 x 20'], '420-560 kcal', '300-390 kcal', 'High', '65 min', '90 sec', 'Glute activation + hip mobility', 'Sled drag / stair finisher 6 min', '10 min cycle', 'Keep bracing tight for all compound lifts.'),
        _day('Thursday', 'Shoulders + Core', [f'Seated OHP — {sets} x 6', 'Lateral Raise — 4 x 12', 'Rear Delt Fly — 3 x 15', 'Cable Woodchop — 3 x 12/side'], [f'Pike Pushup — {sets} x 10', 'Lateral Raise — 4 x 15', 'Rear Delt Band Pull — 3 x 20', 'Russian Twist — 3 x 20'], '340-450 kcal', '240-320 kcal', 'Moderate', '52 min', '75 sec', 'Shoulder CARs + core priming', 'Plank ladder 3 rounds', '12 min incline walk', 'Avoid shrugging during overhead movements.'),
        _day('Friday', 'Upper Power', [f'Bench Press — {sets} x 5', 'Weighted Row — 4 x 6', 'Push Press — 3 x 5', 'Pullup — 3 x 6'], [f'Explosive Pushups — {sets} x 8', 'Heavy Band Row — 4 x 8', 'Pike Push Press — 3 x 8', 'Pullup assisted — 3 x 6'], '400-520 kcal', '280-360 kcal', 'High', '58 min', '105 sec', 'Nervous system prep + activation', 'Sled sprint 5 rounds', '8 min easy jog', 'Move explosive but keep every rep technical.'),
        _day('Saturday', 'Lower Power', [f'Deadlift — {sets} x 4', 'Front Squat — 4 x 5', 'Hip Thrust — 3 x 8', 'Box Jump — 3 x 6'], [f'Dumbbell Deadlift — {sets} x 8', 'Tempo Squat — 4 x 8', 'Glute Bridge — 3 x 15', 'Broad Jump — 3 x 6'], '430-570 kcal', '300-390 kcal', 'High', '60 min', '105 sec', 'Ankle + hip prep sequence', 'Bike assault 5 rounds', '10 min recovery walk', 'Keep power outputs sharp, not sloppy.'),
        _day('Sunday', 'Recovery', ['Mobility flow 25 min', 'Light walk 30 min', 'Breathing drills 8 min'], ['Mobility flow 25 min', 'Light walk 30 min', 'Breathing drills 8 min'], '160-240 kcal', '150-220 kcal', 'Low', '40 min', 'As needed', 'Gentle mobility sequence', 'None', 'Walk only', 'Recovery drives progress—do not skip this day.'),
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
        'profile': {'height_display': f'{height_feet} ft {height_inches} in', 'weight_kg': weight_kg, 'goal_mode': goal_mode, 'bmi': compute_bmi(cm, weight_kg)},
        'healthy_weight': {'range': f'{low}-{high} kg', 'ideal': f'{ideal} kg', 'note': 'This is a realistic healthy weight target for your height.'},
        'targets': {'daily_calories': max(1400, calories), 'protein_g': protein, 'carbs_g': carbs, 'fat_g': fats, 'water_liters': water},
        'daily_diet_plan': meals,
        'weekly_workout_plan': workout_plan(goal_mode, experience_level),
        'progress_expectations': ['Week 2: Improved energy and recovery', 'Week 4: Visible fat reduction begins', 'Week 6: Strength noticeably improves', 'Week 8: Visible physique transformation', 'Week 12: Major body composition change']
    }
