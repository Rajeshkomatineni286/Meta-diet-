import { motion } from 'framer-motion';
import api from '../../lib/api';

const Card = ({title, children}) => <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className='glass premium-card p-5 rounded-2xl'><p className='label'>{title}</p><div className='mt-3'>{children}</div></motion.div>

const WorkoutDay = ({d}) => <div className='mb-5 border-b border-white/10 pb-4'>
  <p className='text-zinc-100 font-semibold'>{d.day} — {d.workout_name}</p>
  <div className='grid md:grid-cols-2 gap-3 mt-3'>
    <div className='bg-white/5 rounded-xl p-3'><p className='font-medium text-sm'>🏋 Gym Workout</p><ul className='text-zinc-300 text-sm mt-2 space-y-1'>{d.gym_workout.map(x=><li key={x}>• {x}</li>)}</ul><p className='text-xs text-zinc-400 mt-2'>Estimated Burn: {d.estimated_burn_gym}</p></div>
    <div className='bg-white/5 rounded-xl p-3'><p className='font-medium text-sm'>🏠 Home Workout</p><ul className='text-zinc-300 text-sm mt-2 space-y-1'>{d.home_workout.map(x=><li key={x}>• {x}</li>)}</ul><p className='text-xs text-zinc-400 mt-2'>Estimated Burn: {d.estimated_burn_home}</p></div>
  </div>
  <p className='text-xs text-zinc-400 mt-2'>Rest: {d.rest_time} • Difficulty: {d.difficulty}</p>
  <p className='text-xs text-zinc-400'>Coach Tip: {d.coach_tip}</p>
</div>

export function Dashboard({ data, payload }) {
  const h = data?.healthy_weight || {}; const t = data?.targets || {};
  const downloadPdf = async () => { const res = await api.post('/plans/export-pdf/', payload, { responseType: 'blob' }); const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' })); const a=document.createElement('a'); a.href=url; a.download='metadiet-plan.pdf'; a.click(); URL.revokeObjectURL(url); };
  return <div className='mt-8 space-y-4'>
    <Card title='Healthy Weight'><p className='metric-main'>{h.range}</p><p className='metric-sub'>Ideal target: {h.ideal}</p><p className='metric-sub'>{h.note}</p></Card>
    <Card title='Daily Nutrition Goal'><div className='grid grid-cols-2 md:grid-cols-5 gap-3 text-sm'>{[['Calories',`${t.daily_calories} kcal`],['Protein',`${t.protein_g} g`],['Carbs',`${t.carbs_g} g`],['Fats',`${t.fat_g} g`],['Water',`${t.water_liters} L`]].map(([k,v])=><div key={k} className='bg-white/5 rounded-xl p-3'><p className='text-zinc-400 text-xs'>{k}</p><p className='text-zinc-100 mt-1'>{v}</p></div>)}</div><p className='metric-sub mt-3'>Your meals are designed to meet these daily targets realistically.</p></Card>
    <Card title='Weekly Workout Plan'>{(data?.weekly_workout_plan||[]).map(d=><WorkoutDay key={d.day} d={d} />)}</Card>
    <Card title='Detailed Daily Diet Plan'>{(data?.daily_diet_plan||[]).map(m=><div key={m.meal} className='mb-4 border-b border-white/10 pb-3'><p className='text-zinc-100 font-semibold'>{m.meal} — {m.time}</p><p className='text-zinc-300 text-sm mt-1'>{m.dish}</p><ul className='text-zinc-400 text-sm mt-1 space-y-1'>{m.items.map(i=><li key={i}>• {i}</li>)}</ul><p className='text-zinc-300 text-sm mt-2'>Calories {m.calories_kcal} • Protein {m.protein_g}g • Carbs {m.carbs_g}g • Fats {m.fat_g}g</p><p className='text-zinc-400 text-xs mt-1'>Why this meal? {m.why}</p></div>)}</Card>
    <Card title='Progress Expectations'><ul className='text-zinc-200 text-sm space-y-2'>{(data?.progress_expectations||[]).map(a=><li key={a}>• {a}</li>)}</ul></Card>
    <div className='sticky bottom-3'><button onClick={downloadPdf} className='w-full py-3 rounded-full bg-white text-black font-semibold'>Download My Full Transformation Plan</button></div>
  </div>
}
