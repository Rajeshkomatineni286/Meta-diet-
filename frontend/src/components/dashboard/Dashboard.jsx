import api from '../../lib/api';

const Section = ({ title, children }) => (
  <section className='glass premium-card p-6 rounded-2xl shadow-xl'>
    <p className='label'>{title}</p>
    <div className='mt-4'>{children}</div>
  </section>
);

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const weeklyPlan = (plan = [], workoutKey, burnKey) => days.map((day, i) => {
  const source = plan.find((d) => d.day === day) || plan[i % Math.max(plan.length, 1)] || {};
  const exercises = source[workoutKey] || [];
  const workoutName = source.workout_name || 'Active Recovery + Mobility';
  return {
    day,
    workoutName,
    warmup: ['5–8 min brisk walk', 'Dynamic mobility drill', 'Light activation set'],
    main: exercises.length ? exercises : ['Bodyweight squats — 3 x 12', 'Push-ups — 3 x 10', 'Plank — 3 x 40 sec'],
    cardio: source.cardio || '15–25 min moderate cardio',
    burn: source[burnKey] || '250–420 kcal',
    rest: source.rest_time || '60–90 sec between sets',
    tip: source.coach_tip || 'Focus on clean form first, then increase intensity gradually.',
  };
});

const timelineByGoal = (goalMode, weightKg) => {
  if (goalMode === 'bulk') {
    return [
      'Estimated lean gain: about 0.8–1.5 kg per month with consistent training and nutrition.',
      'Strength improvements often become noticeable within 3–5 weeks.',
      'Visible physique improvements usually appear around 8–12 weeks.',
      `A meaningful transformation can take roughly 4–6 months from your current ${weightKg || '-'} kg baseline.`,
    ];
  }

  if (goalMode === 'maintain') {
    return [
      'Weight stability target: keep body weight within ±1 kg month to month.',
      'Body composition refinement can begin in 4–8 weeks through consistency.',
      'Endurance and strength quality typically improve within 3–6 weeks.',
      'Sustainable maintenance is a long-term lifestyle phase with periodic progression cycles.',
    ];
  }

  return [
    'Expected fat loss: around 2–3 kg per month with high adherence.',
    'Visible waist reduction can begin within 4–6 weeks.',
    'Energy and conditioning usually improve in the first 2–4 weeks.',
    'Target body weight may take about 4–6 months depending on consistency.',
  ];
};

export function Dashboard({ data, payload, workoutPreference = 'gym' }) {
  const t = data.targets || {};
  const h = data.healthy_weight || {};
  const p = data.profile || {};
  const workoutKey = workoutPreference === 'home' ? 'home_workout' : 'gym_workout';
  const burnKey = workoutPreference === 'home' ? 'estimated_burn_home' : 'estimated_burn_gym';
  const plan7 = weeklyPlan(data.weekly_workout_plan || [], workoutKey, burnKey);

  const water = t.water_liters ? `${t.water_liters} L/day` : '3.0–3.5 L/day';
  const sleep = '7.5–8 hours/night';
  const steps = '8,000–10,000 steps/day';

  const diet = data.daily_diet_plan || [];
  const totals = diet.reduce((acc, meal) => ({
    calories: acc.calories + (meal.calories_kcal || 0),
    protein: acc.protein + (meal.protein_g || 0),
    carbs: acc.carbs + (meal.carbs_g || 0),
    fats: acc.fats + (meal.fat_g || 0),
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const downloadPdf = async () => {
    const res = await api.post('/plans/export-pdf/', payload, { responseType: 'blob' });
    const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'metadiet-plan.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return <div className='mt-8 space-y-5 pb-12'>
    <Section title='Transformation Summary'>
      <p className='text-zinc-100 text-base leading-7'>Goal: <b>{p.goal_mode || payload?.goal_mode}</b> • Height: {p.height_display || `${payload?.height_feet || '-'}ft ${payload?.height_inches || '-'}in`} • Weight: {p.weight_kg || payload?.weight_kg} kg</p>
      <p className='text-zinc-300 mt-2'>Healthy range: <b>{h.range || 'Based on your profile'}</b></p>
    </Section>

    <Section title='Daily Nutrition Targets'>
      <div className='grid grid-cols-2 gap-3'>
        {[['Calories', `${t.daily_calories || totals.calories || '-'} kcal`], ['Protein', `${t.protein_g || totals.protein || '-'} g`], ['Carbs', `${t.carbs_g || totals.carbs || '-'} g`], ['Fats', `${t.fats_g || totals.fats || '-'} g`]].map(([k, v]) => (
          <div key={k} className='rounded-xl bg-white/5 p-4'>
            <p className='text-sm text-zinc-300'>{k}</p>
            <p className='text-lg font-semibold mt-1'>{v}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section title='Water + Sleep Targets'>
      <div className='grid sm:grid-cols-3 gap-3'>
        <div className='rounded-xl bg-white/5 p-4'><p className='text-sm text-zinc-300'>Daily Water Intake</p><p className='text-lg font-semibold mt-1'>{water}</p></div>
        <div className='rounded-xl bg-white/5 p-4'><p className='text-sm text-zinc-300'>Sleep Target</p><p className='text-lg font-semibold mt-1'>{sleep}</p></div>
        <div className='rounded-xl bg-white/5 p-4'><p className='text-sm text-zinc-300'>Daily Step Goal</p><p className='text-lg font-semibold mt-1'>{steps}</p></div>
      </div>
    </Section>

    <Section title={`Weekly Workout Plan (${workoutPreference === 'home' ? 'Home' : 'Gym'})`}>
      <div className='space-y-4'>
        {plan7.map((d) => <article key={d.day} className='rounded-xl bg-white/5 p-4 space-y-3'>
          <h3 className='font-semibold text-base'>{d.day} — {d.workoutName}</h3>
          <div><p className='text-sm font-medium text-cyan-300'>1. Warmup</p><ul className='text-sm mt-1 space-y-1 text-zinc-200'>{d.warmup.map((x) => <li key={x}>• {x}</li>)}</ul></div>
          <div><p className='text-sm font-medium text-cyan-300'>2. Main Workout</p><ul className='text-sm mt-1 space-y-1 text-zinc-200'>{d.main.map((x) => <li key={x}>• {x}</li>)}</ul></div>
          <div><p className='text-sm font-medium text-cyan-300'>3. Cardio</p><p className='text-sm text-zinc-200 mt-1'>{d.cardio}</p></div>
          <div className='grid sm:grid-cols-2 gap-2 text-sm'><p>4. Calories Burn Estimate: <b>{d.burn}</b></p><p>Rest Recommendation: <b>{d.rest}</b></p></div>
          <p className='text-sm text-zinc-300'>5. Coach Tip: {d.tip}</p>
        </article>)}
      </div>
    </Section>

    <Section title='Detailed Diet Plan'>
      <div className='space-y-3'>
        {diet.map((m) => <div key={`${m.meal}-${m.time}`} className='rounded-xl bg-white/5 p-4'>
          <p className='font-medium'>{m.meal} — {m.time}</p>
          <p className='text-zinc-200 mt-1'>{m.dish}</p>
          <ul className='mt-2 space-y-1 text-sm text-zinc-300'>{(m.items || []).map((item) => <li key={item}>• {item}</li>)}</ul>
          <p className='text-sm mt-3'>Calories: <b>{m.calories_kcal}</b> • Protein: <b>{m.protein_g}g</b> • Carbs: <b>{m.carbs_g}g</b> • Fats: <b>{m.fat_g}g</b></p>
        </div>)}
        <div className='rounded-xl bg-cyan-500/10 p-4 border border-cyan-300/20'>
          <p className='font-semibold'>Total Daily Intake</p>
          <p className='text-sm mt-2'>Calories: <b>{totals.calories}</b> • Protein: <b>{totals.protein}g</b> • Carbs: <b>{totals.carbs}g</b> • Fats: <b>{totals.fats}g</b> • Water: <b>{water}</b></p>
        </div>
      </div>
    </Section>

    <Section title='Expected Progress Timeline'>
      <ul className='space-y-2 text-zinc-200 text-sm'>
        {timelineByGoal(p.goal_mode || payload?.goal_mode, p.weight_kg || payload?.weight_kg).map((line) => <li key={line}>• {line}</li>)}
      </ul>
    </Section>

    <Section title='Download PDF'>
      <button onClick={downloadPdf} className='generate-cta w-full min-h-12 text-base'>Download My AI Plan</button>
    </Section>
  </div>;
}
