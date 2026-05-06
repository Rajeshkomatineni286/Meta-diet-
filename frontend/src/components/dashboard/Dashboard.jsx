import { motion } from 'framer-motion';
import api from '../../lib/api';

const Card = ({title, children}) => <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className='glass premium-card p-5 rounded-2xl'><p className='label'>{title}</p><div className='mt-3'>{children}</div></motion.div>

export function Dashboard({ data, payload }) {
  const core = data?.healthy_weight || {}; const targets = data?.targets || {};
  const downloadPdf = async () => {
    const res = await api.post('/plans/export-pdf/', payload, { responseType: 'blob' });
    const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const a = document.createElement('a'); a.href = url; a.download = 'metadiet-plan.pdf'; a.click(); URL.revokeObjectURL(url);
  };
  return <div className='mt-8 space-y-4'>
    <Card title='Healthy Weight Range'><p className='metric-main'>{core.range || '--'}</p><p className='metric-sub'>Ideal goal weight: {core.ideal || '--'}</p><p className='metric-sub'>{core.note}</p></Card>
    <div className='grid md:grid-cols-3 gap-4'>
      <Card title='Daily Calories'><p className='metric-main'>{targets.daily_calories} kcal</p></Card>
      <Card title='Protein Target'><p className='metric-main'>{targets.protein_g} g</p></Card>
      <Card title='Water Intake'><p className='metric-main'>{targets.water_liters} L</p></Card>
    </div>
    <Card title='Full Workout Plan'>{(data?.weekly_workout_plan||[]).map(d=><div key={d.day} className='mb-4'><p className='text-zinc-100 font-medium'>{d.day} — {d.focus}</p><p className='text-zinc-400 text-xs mt-1'>Warmup: {d.warmup}</p><ul className='text-zinc-300 text-sm list-disc ml-5 mt-1'>{d.exercises.map(p=><li key={p}>{p}</li>)}</ul><p className='text-zinc-400 text-xs mt-1'>Estimated Burn: {d.calories_burned}</p><p className='text-zinc-400 text-xs'>Coach note: {d.coach_note}</p></div>)}</Card>
    <Card title='Full Diet Plan'>{(data?.daily_diet_plan||[]).map(m=><div key={m.meal} className='mb-4'><p className='text-zinc-100 font-medium'>{m.meal} — {m.dish}</p><p className='text-zinc-300 text-sm'>Calories: {m.calories_kcal} kcal • Protein: {m.protein_g}g • Carbs: {m.carbs_g}g • Fats: {m.fat_g}g</p><p className='text-zinc-400 text-xs mt-1'>Why this meal? {m.why}</p></div>)}</Card>
    <Card title='Progress Expectations'><ul className='text-zinc-200 text-sm space-y-2'>{(data?.progress_expectations||[]).map(a=><li key={a}>• {a}</li>)}</ul></Card>
    <button onClick={downloadPdf} className='w-full py-3 rounded-full bg-white text-black font-semibold'>Download Full Plan PDF</button>
  </div>
}
