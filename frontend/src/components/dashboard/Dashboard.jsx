import { useState } from 'react';
import { API_BASE_URL } from '../../lib/api';

const Section = ({ title, children }) => (
  <section className='glass premium-card p-[18px] rounded-3xl shadow-xl'>
    <p className='label text-[18px] tracking-[0.12em]'>{title}</p>
    <div className='mt-4'>{children}</div>
  </section>
);

const StatCard = ({ icon, label, value }) => (
  <div className='rounded-2xl bg-white/5 border border-white/10 p-4'>
    <p className='text-xs text-zinc-300'>{icon} {label}</p>
    <p className='text-base font-semibold mt-1'>{value}</p>
  </div>
);

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const weeklyPlan = (plan = [], workoutKey, burnKey) => days.map((day, i) => {
  const source = plan.find((d) => d.day === day) || plan[i % Math.max(plan.length, 1)] || {};
  return {
    day,
    workoutName: source.workout_name || 'Active Recovery + Mobility',
    warmup: ['5–8 min brisk walk', 'Dynamic mobility drill', 'Light activation set'],
    main: source[workoutKey] || ['Bodyweight squats — 3 x 12', 'Push-ups — 3 x 10', 'Plank — 3 x 40 sec'],
    cardio: source.cardio || '15–25 min moderate cardio',
    cooldown: '5 min easy walk + stretch',
    burn: source[burnKey] || '250–420 kcal',
    rest: source.rest_time || '60–90 sec between sets',
    difficulty: source.difficulty || 'Moderate',
    tip: source.coach_tip || 'Focus on clean form first, then increase intensity gradually.',
  };
});

export function Dashboard({ data, payload, workoutPreference = 'gym' }) {
  const [expandedDay, setExpandedDay] = useState('Monday');
  const t = data.targets || {}; const h = data.healthy_weight || {}; const p = data.profile || {};
  const workoutKey = workoutPreference === 'home' ? 'home_workout' : 'gym_workout';
  const burnKey = workoutPreference === 'home' ? 'estimated_burn_home' : 'estimated_burn_gym';
  const plan7 = data.weekly_workout_plan?.length ? data.weekly_workout_plan : weeklyPlan(data.weekly_workout_plan || [], workoutKey, burnKey);
  const water = t.water_liters ? `${t.water_liters} L/day` : '3.0–3.5 L/day';
  const diet = data.daily_diet_plan || [];
  const timeline = data.progress_expectations || [];

  const downloadPdf = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/export-plan/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fitness-plan.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Unable to download plan');
    }
  };

  return <div className='mt-8 space-y-8 pb-28'>
    <Section title='Progress Overview'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <StatCard icon='🎯' label='Goal' value={p.goal_mode || payload?.goal_mode || '-'} />
        <StatCard icon='📏' label='Height' value={p.height_display || `${payload?.height_feet || '-'}ft ${payload?.height_inches || '-'}in`} />
        <StatCard icon='⚖️' label='Weight' value={`${p.weight_kg || payload?.weight_kg || '-'} kg`} />
        <StatCard icon='🔥' label='Healthy Range' value={h.range || 'Based on profile'} />
      </div>
    </Section>


    <Section title='Expected Results Timeline'>
      <div className='space-y-2 text-sm'>
        {timeline.map((t) => <p key={t} className='rounded-xl bg-white/5 border border-white/10 p-3'>{t}</p>)}
      </div>
    </Section>

    <Section title='Daily Targets & Macros'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <StatCard icon='🍽️' label='Calories' value={`${t.daily_calories || '-'} kcal`} />
        <StatCard icon='🥩' label='Protein' value={`${t.protein_g || '-'} g`} />
        <StatCard icon='🍚' label='Carbs' value={`${t.carbs_g || '-'} g`} />
        <StatCard icon='🥑' label='Fats' value={`${t.fat_g || t.fats_g || '-'} g`} />
      </div>
    </Section>

    <Section title='Hydration + Recovery'>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
        <StatCard icon='💧' label='Water' value={water} />
        <StatCard icon='😴' label='Sleep' value='7.5–8 hrs' />
        <StatCard icon='👣' label='Steps' value='8k–10k/day' />
      </div>
    </Section>

    <Section title={`Weekly Workout Plan (${workoutPreference === 'home' ? 'Home' : 'Gym'})`}>
      <div className='space-y-4'>
        {plan7.map((d) => {
          const open = expandedDay === d.day;
          return <article key={d.day} className='rounded-2xl bg-white/5 border border-white/10 p-4'>
            <button type='button' onClick={() => setExpandedDay(open ? '' : d.day)} className='w-full text-left'>
              <p className='font-semibold text-base'>{d.day} — {d.workoutName}</p>
              <p className='text-xs text-zinc-300 mt-1'>Burn: {d[burnKey] || d.burn} • Intensity: {d.intensity || d.difficulty}</p>
            </button>
            {open && <div className='mt-4 space-y-3 text-sm'>
              <div><p className='text-cyan-300 font-medium'>Warmup</p><p>{Array.isArray(d.warmup) ? d.warmup.join(' • ') : d.warmup}</p></div>
              <div><p className='text-cyan-300 font-medium'>Main Workout</p>{(d[workoutKey] || d.main || []).map((x) => <p key={x} className='mt-1'>{x}</p>)}</div>
              <div><p><b>Duration:</b> {d.duration || '50-60 min'}</p><p><b>Intensity:</b> {d.intensity || d.difficulty || 'Moderate'}</p><p><b>Cardio:</b> {d.cardio}</p><p><b>Finisher:</b> {d.finisher || 'Core finisher 6 min'}</p><p><b>Cooldown:</b> {d.cooldown || 'Mobility cool down 5 min'}</p><p><b>Rest:</b> {d.rest_time || d.rest}</p></div>
              <p className='text-zinc-300'>Trainer Note: {d.coach_tip || d.tip}</p>
            </div>}
          </article>;
        })}
      </div>
    </Section>

    <Section title='Detailed Diet Plan'>
      <div className='space-y-4'>
        {diet.map((m) => <article key={`${m.meal}-${m.time}`} className='rounded-2xl bg-white/5 border border-white/10 p-4'>
          <p className='font-semibold text-base'>🍽️ {m.meal}</p><p className='text-xs text-zinc-300'>{m.time}</p>
          <p className='mt-2 text-sm'>{m.dish}</p>
          <ul className='mt-2 text-sm space-y-1'>{(m.items || []).map((item) => <li key={item}>{item}</li>)}</ul>
          <p className='mt-3 text-sm'><b>{m.calories_kcal} kcal</b> • Protein {m.protein_g}g • Carbs {m.carbs_g}g • Fats {m.fat_g}g</p>
        </article>)}
      </div>
    </Section>

    <button onClick={downloadPdf} className='generate-cta w-full h-14 rounded-[20px] text-lg font-semibold'>Download My Plan PDF</button>
  </div>;
}
