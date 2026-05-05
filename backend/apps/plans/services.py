def compute_bmi(height_cm: int, weight_kg: float) -> float:
    meters = height_cm / 100
    return round(weight_kg / (meters * meters), 2)

def generate_ai_plan(goal_mode: str, bmi: float) -> dict:
    base = {'cut': 1800, 'bulk': 2800, 'rebuild': 2300}[goal_mode]
    calories = int(base + ((22 - bmi) * 30))
    return {
        'calories': max(1400, calories),
        'protein_g': 140,
        'fat_g': 70,
        'diet_plan': {'timeline': ['08:00 Protein breakfast', '13:00 Neural lunch', '20:00 Recovery dinner']},
        'workout_plan': {'energy_blocks': ['Mobility Sync', 'Strength Surge', 'Core Stabilize']}
    }
