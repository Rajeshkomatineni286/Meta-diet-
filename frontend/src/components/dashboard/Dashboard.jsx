import { motion } from 'framer-motion';
import api from '../../lib/api';

const Section = ({title, children}) => <motion.section initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className='glass premium-card p-5 rounded-2xl'><p className='label'>{title}</p><div className='mt-3'>{children}</div></motion.section>

export function Dashboard({ data, payload, workoutPreference='gym' }) {
  const t = data.targets || {}; const h = data.healthy_weight || {}; const p = data.profile || {};
  const workoutKey = workoutPreference === 'home' ? 'home_workout' : 'gym_workout';
  const burnKey = workoutPreference === 'home' ? 'estimated_burn_home' : 'estimated_burn_gym';
  const downloadPdf = async () => { const res = await api.post('/plans/export-pdf/', payload, { responseType: 'blob' }); const url=URL.createObjectURL(new Blob([res.data],{type:'application/pdf'})); const a=document.createElement('a'); a.href=url; a.download='metadiet-plan.pdf'; a.click(); URL.revokeObjectURL(url); };

  return <div className='mt-10 space-y-4'>
    <Section title='Goal Summary'><p className='text-zinc-200'>Goal: <b>{p.goal_mode}</b> • Height: {p.height_display} • Weight: {p.weight_kg} kg</p></Section>
    <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
      {[['Healthy Weight',h.range],['Daily Calories',`${t.daily_calories} kcal`],['Protein',`${t.protein_g} g`],['Water',`${t.water_liters} L`]].map(([k,v])=><Section key={k} title={k}><p className='text-xl font-semibold'>{v}</p></Section>)}
    </div>
    <Section title={`Workout Plan (${workoutPreference === 'home' ? 'Home' : 'Gym'})`}>{(data.weekly_workout_plan||[]).map(d=><div key={d.day} className='mb-3 p-3 rounded-xl bg-white/5'><p className='font-medium'>{d.day} — {d.workout_name}</p><div className='grid sm:grid-cols-2 gap-2 mt-2'>{d[workoutKey].map(ex=><div key={ex} className='bg-white/5 rounded-lg p-2 text-sm'>{ex}</div>)}</div><p className='text-xs text-zinc-400 mt-2'>Rest: {d.rest_time} • Burn: {d[burnKey]} • {d.difficulty}</p></div>)}</Section>
    <Section title='Detailed Diet Plan'>{(data.daily_diet_plan||[]).map(m=><div key={m.meal} className='mb-3 p-3 rounded-xl bg-white/5'><p className='font-medium'>{m.meal} — {m.time}</p><p className='text-sm text-zinc-300'>{m.dish}</p><p className='text-xs text-zinc-400 mt-1'>{m.items.join(' • ')}</p><p className='text-xs mt-1'>Calories {m.calories_kcal} • Protein {m.protein_g}g • Carbs {m.carbs_g}g • Fats {m.fat_g}g</p></div>)}</Section>
    <Section title='Weekly Schedule'><ul className='text-sm text-zinc-300 space-y-1'>{(data.weekly_workout_plan||[]).map(d=><li key={d.day}>• {d.day}: {d.workout_name}</li>)}</ul></Section>
    <button onClick={downloadPdf} className='generate-cta w-full'>Download My AI Plan</button>
  </div>
}
