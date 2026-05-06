import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import { Flame, Droplets, Target, Dumbbell } from 'lucide-react';

const Card = ({title, icon:Icon, value, sub}) => <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className='glass premium-card p-4 rounded-2xl'><div className='flex items-center gap-2 text-zinc-300 text-sm'>{Icon && <Icon size={16}/>} {title}</div><p className='text-2xl font-semibold mt-2'>{value}</p>{sub && <p className='text-zinc-400 text-xs mt-1'>{sub}</p>}</motion.div>

export function Dashboard({ data, payload, workoutPreference='gym' }) {
  const [open, setOpen] = useState(0);
  const t = data.targets || {}; const h = data.healthy_weight || {};
  const workoutKey = workoutPreference === 'home' ? 'home_workout' : 'gym_workout';
  const burnKey = workoutPreference === 'home' ? 'estimated_burn_home' : 'estimated_burn_gym';

  const downloadPdf = async () => { const res = await api.post('/plans/export-pdf/', payload, { responseType: 'blob' }); const url=URL.createObjectURL(new Blob([res.data],{type:'application/pdf'})); const a=document.createElement('a'); a.href=url; a.download='metadiet-plan.pdf'; a.click(); URL.revokeObjectURL(url); };

  return <div className='mt-8 space-y-4'>
    <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
      <Card title='Daily Calories' icon={Flame} value={`${t.daily_calories} kcal`} />
      <Card title='Target Weight' icon={Target} value={h.ideal} sub={h.range} />
      <Card title='Protein Goal' icon={Dumbbell} value={`${t.protein_g} g`} />
      <Card title='Est. Monthly Fat Loss' value={data.profile?.goal_mode==='cut'?'2-3 kg':'0.8-1.5 kg'} />
      <Card title='Water Intake' icon={Droplets} value={`${t.water_liters} L`} />
    </div>

    <div className='glass premium-card p-5 rounded-2xl'>
      <p className='label'>Weekly Workout Plan ({workoutPreference === 'home' ? 'Home' : 'Gym'})</p>
      {(data.weekly_workout_plan||[]).map((d,idx)=><div key={d.day} className='mt-3 border border-white/10 rounded-xl overflow-hidden'>
        <button className='w-full text-left p-3 bg-white/5' onClick={()=>setOpen(open===idx?-1:idx)}>{d.day} — {d.workout_name}</button>
        {open===idx && <div className='p-3 space-y-2'>
          <p className='text-xs text-zinc-400'>Warmup: {d.warmup}</p>
          <div className='grid md:grid-cols-2 gap-2'>{d[workoutKey].map(ex=><div key={ex} className='bg-white/5 rounded-lg p-2 text-sm'>{ex}</div>)}</div>
          <p className='text-xs text-zinc-400'>Rest {d.rest_time} • Burn {d[burnKey]} • {d.coach_tip}</p>
        </div>}
      </div>)}
    </div>

    <div className='glass premium-card p-5 rounded-2xl'>
      <p className='label'>Daily Diet Plan</p>
      <div className='grid md:grid-cols-2 gap-3 mt-3'>
      {(data.daily_diet_plan||[]).map(m=><div key={m.meal} className='bg-white/5 rounded-xl p-3'><p className='font-semibold'>{m.meal} — {m.time}</p><p className='text-sm text-zinc-300 mt-1'>{m.dish}</p><p className='text-xs text-zinc-400 mt-2'>{m.items.join(' • ')}</p><p className='text-xs mt-2'>Calories {m.calories_kcal} • Protein {m.protein_g}g • Carbs {m.carbs_g}g • Fats {m.fat_g}g</p></div>)}
      </div>
    </div>

    <div className='sticky bottom-3'><button onClick={downloadPdf} className='generate-cta w-full'>Download Full Plan PDF</button></div>
  </div>
}
