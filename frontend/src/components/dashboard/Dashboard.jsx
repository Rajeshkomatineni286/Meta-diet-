import { motion } from 'framer-motion';

const Card = ({title, children}) => <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className='glass premium-card p-5 rounded-2xl'><p className='label'>{title}</p><div className='mt-3'>{children}</div></motion.div>

export function Dashboard({ data }) {
  const core = data?.body_core || {}; const targets = data?.targets || {};
  return <div className='mt-8 space-y-4'>
    <Card title='Suggested Healthy Weight'>
      <p className='metric-main'>{core.suggested_weight_range || '--'}</p>
      <p className='metric-sub'>Ideal target weight: {core.ideal_target_weight || '--'}</p>
      <p className='metric-sub'>{data?.coach_note}</p>
    </Card>
    <div className='grid md:grid-cols-3 gap-4'>
      <Card title='Daily Calories'><p className='metric-main'>{targets.daily_calories} kcal</p></Card>
      <Card title='Protein Target'><p className='metric-main'>{targets.protein_g} g</p></Card>
      <Card title='Water Intake'><p className='metric-main'>{targets.water_liters} L</p></Card>
    </div>
    <Card title='Weekly Workout Plan'>{(data?.weekly_workout_plan||[]).map(d=><div key={d.day} className='mb-3'><p className='text-zinc-100 font-medium'>{d.day} • {d.focus}</p><ul className='text-zinc-300 text-sm list-disc ml-5'>{d.plan.map(p=><li key={p}>{p}</li>)}</ul></div>)}</Card>
    <Card title='Daily Diet Plan'>{(data?.daily_diet_plan||[]).map(m=><div key={m.meal} className='mb-3'><p className='text-zinc-100 font-medium'>{m.meal}</p><p className='text-zinc-300 text-sm'>{m.items.join(' • ')}</p></div>)}</Card>
    <Card title="Today's Actions"><ul className='text-zinc-200 text-sm space-y-2'>{(data?.todays_actions||[]).map(a=><li key={a}>• {a}</li>)}</ul></Card>
  </div>
}
