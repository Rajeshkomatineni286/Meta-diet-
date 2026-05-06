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

def _meal_bank(pref: str):
    common = [
        ('Breakfast', 'Oats + Fruit Bowl', 380, 14, 58, 9, 'Steady energy and better appetite control.'),
        ('Lunch', 'Roti + Dal + Salad', 540, 22, 68, 16, 'Balanced carbs and protein for sustained energy.'),
        ('Snack', 'Curd + Sprouts Chaat', 240, 14, 20, 8, 'Improves fullness and micronutrient intake.'),
    ]
    dinner = {
        'veg': ('Dinner', 'Paneer Bhurji + Rice', 560, 30, 54, 22, 'High-protein dinner supporting recovery.'),
        'non_veg': ('Dinner', 'Chicken Curry + Rice', 590, 38, 52, 20, 'Lean protein supports muscle and fat loss.'),
        'eggetarian': ('Dinner', 'Egg Curry + Roti', 560, 34, 50, 19, 'Quality protein helps preserve lean mass.'),
    }[pref]
    breakfast_pref = {
        'veg': ('Breakfast', 'Paneer Oats Chilla', 420, 32, 38, 14, 'High-protein breakfast that controls cravings.'),
        'non_veg': ('Breakfast', 'Egg Bhurji + Toast + Fruit', 430, 30, 34, 16, 'Strong protein start for better satiety.'),
        'eggetarian': ('Breakfast', 'Veg Omelette + Oats', 410, 29, 36, 13, 'Supports muscle maintenance and stable energy.'),
    }[pref]
    return [breakfast_pref, common[1], common[2], dinner]

def _workout_day(day, focus, lifts, kcal, note):
    return {'day': day, 'focus': focus, 'warmup': '5-8 min brisk walk + mobility', 'exercises': lifts, 'calories_burned': kcal, 'coach_note': note, 'rest_guidance': '60-90 sec between sets'}

def workout_plan(goal: str, exp: str) -> List[dict]:
    sets = '3' if exp == 'beginner' else '4'
    if goal == 'cut':
        return [
            _workout_day('Monday','Fat Loss Strength',[f'Squats {sets} x 12',f'Pushups {sets} x 10',f'Dumbbell Rows {sets} x 12'],'320-420 kcal','Focus on form over speed.'),
            _workout_day('Tuesday','Cardio + Core',[f'Brisk Walk 35 min',f'Plank {sets} x 40 sec',f'Mountain Climbers {sets} x 20'],'280-360 kcal','Keep pace conversational.'),
            _workout_day('Wednesday','Lower Body + Core',[f'Lunges {sets} x 12',f'Glute Bridges {sets} x 15',f'Deadbug {sets} x 12'],'300-390 kcal','Control each rep.'),
            _workout_day('Thursday','Active Recovery',[f'Walk 30 min',f'Stretch 15 min'],'180-240 kcal','Recovery day still counts.'),
            _workout_day('Friday','Full Body',[f'Goblet Squat {sets} x 12',f'Incline Pushups {sets} x 12',f'Rows {sets} x 12'],'320-420 kcal','Stay 1-2 reps away from failure.'),
        ]
    return [
        _workout_day('Monday','Chest + Triceps',[f'Bench Press {sets} x 8',f'Incline DB Press {sets} x 10',f'Tricep Pushdown {sets} x 12'],'300-420 kcal','Progress load gradually.'),
        _workout_day('Tuesday','Back + Biceps',[f'Lat Pulldown {sets} x 10',f'Barbell Row {sets} x 10',f'Bicep Curl {sets} x 12'],'300-430 kcal','Full range of motion.'),
        _workout_day('Wednesday','Legs',[f'Squat {sets} x 8',f'RDL {sets} x 10',f'Leg Press {sets} x 12'],'340-480 kcal','Brace core each rep.'),
        _workout_day('Thursday','Shoulders + Core',[f'OHP {sets} x 8',f'Lateral Raise {sets} x 12',f'Plank {sets} x 45 sec'],'260-360 kcal','Quality reps over momentum.'),
        _workout_day('Friday','Push/Pull Mix',[f'Incline Press {sets} x 10',f'Seated Row {sets} x 12',f'Hammer Curl {sets} x 12'],'300-420 kcal','Maintain consistent tempo.'),
    ]

def build_body_intelligence(height_feet:int, height_inches:int, weight_kg:float, goal_mode:str, diet_preference:str, experience_level:str) -> Dict:
    cm = to_cm(height_feet, height_inches)
    bmi = compute_bmi(cm, weight_kg)
    low, high, ideal = healthy_weight_range(cm)
    calories = int((22 * weight_kg) + {'cut': -300, 'bulk': 280, 'maintain': 0}[goal_mode])
    protein = int(weight_kg * (2.0 if goal_mode != 'maintain' else 1.6))
    water = round(max(2.5, weight_kg * 0.035), 1)
    expectations = [
      'Expected fat loss: 2-3 kg/month' if goal_mode == 'cut' else 'Expected muscle gain: 0.8-1.5 kg/month',
      'Visible body changes may start within 4-6 weeks',
      'Strength improvements expected within 2 weeks',
    ]
    meals = _meal_bank(diet_preference)
    diet = [{'meal':m[0],'dish':m[1],'calories_kcal':m[2],'protein_g':m[3],'carbs_g':m[4],'fat_g':m[5],'why':m[6]} for m in meals]
    return {
        'profile': {'height_display': f'{height_feet} ft {height_inches} in', 'height_cm': cm, 'weight_kg': weight_kg, 'goal_mode': goal_mode, 'diet_preference': diet_preference},
        'healthy_weight': {'range': f'{low}-{high} kg', 'ideal': f'{ideal} kg', 'note': 'This is a realistic healthy weight target for your height.'},
        'targets': {'daily_calories': max(1400, calories), 'protein_g': protein, 'water_liters': water},
        'daily_diet_plan': diet,
        'weekly_workout_plan': workout_plan(goal_mode, experience_level),
        'progress_expectations': expectations,
    }
