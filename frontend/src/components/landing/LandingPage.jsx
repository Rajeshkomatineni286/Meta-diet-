import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Dumbbell, Utensils, GaugeCircle } from 'lucide-react';
import api from '../../lib/api';
import { Dashboard } from '../dashboard/Dashboard';
import { NeuralBackground } from '../dashboard/NeuralBackground';

const heights = Array.from({ length: (8-4)*12 + 1 }, (_,i)=>({feet:4+Math.floor(i/12), inches:i%12}));

export function LandingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ height_feet: 5, height_inches: 8, weight_kg: 72, goal_mode: 'cut', experience_level: 'beginner', diet_preference: 'veg', workout_preference: 'gym' });

  const bmi = useMemo(() => {
    const cm = (form.height_feet * 12 + form.height_inches) * 2.54;
    const m = cm / 100;
    return (form.weight_kg / (m*m)).toFixed(1);
  }, [form.height_feet, form.height_inches, form.weight_kg]);

  const generate = async () => {
    setStep(7); setLoading(true); setError('');
    let p = 0;
    const timer = setInterval(() => { p += 8; setProgress(Math.min(96,p)); }, 180);
    try {
      const res = await api.post('/plans/scan/', { ...form, weight_kg: Number(form.weight_kg) });
      setProgress(100);
      setTimeout(()=>{ setResult(res.data); setStep(8); }, 350);
    } catch (e) {
      const d=e?.response?.data; setError(d?.detail || Object.entries(d||{}).map(([k,v])=>`${k}: ${v}`).join(' | ') || e.message); setStep(6);
    } finally { clearInterval(timer); setLoading(false); }
  };

  const card = 'onboarding-card max-w-3xl mx-auto';
  const selectBtn = (active) => `goal-card ${active ? 'goal-card-active':''}`;

  return <div className='min-h-screen bg-[#050505] text-white relative overflow-hidden'><NeuralBackground />
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <AnimatePresence mode='wait'>
        {step===0 && <motion.div key='w' initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className='text-center py-24'>
          <p className='coach-label'>AI Transformation Coach</p>
          <h1 className='hero-title max-w-3xl mx-auto'>Let’s Build Your AI Body Transformation System</h1>
          <button className='generate-cta mt-10 w-full max-w-sm' onClick={()=>setStep(1)}>Start Body Scan</button>
        </motion.div>}

        {step>0 && step<7 && <motion.div key={`s${step}`} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} className={card}>
          {step===1 && <>
            <p className='field-label'>Height & Weight</p>
            <div className='grid grid-cols-2 gap-3 mt-3'>
              <select className='premium-input' value={`${form.height_feet}-${form.height_inches}`} onChange={e=>{const [f,i]=e.target.value.split('-').map(Number);setForm({...form,height_feet:f,height_inches:i});}}>{heights.map(h=><option key={`${h.feet}-${h.inches}`} value={`${h.feet}-${h.inches}`}>{h.feet} ft {h.inches} in</option>)}</select>
              <div className='relative'><input className='premium-input pr-10' type='number' value={form.weight_kg} onChange={e=>setForm({...form,weight_kg:Number(e.target.value)})}/><span className='suffix'>kg</span></div>
            </div>
            <div className='mt-4 bg-white/5 rounded-xl p-3 flex items-center justify-between'><p className='text-zinc-300 text-sm'>Live BMI</p><p className='text-xl font-semibold'>{bmi}</p></div>
          </>}

          {step===2 && <>
            <p className='field-label mb-3'>Choose Your Goal</p>
            {[['cut','🔥 Fat Loss','Burn fat while preserving muscle'],['bulk','💪 Muscle Gain','Build lean size and strength'],['maintain','⚖️ Maintain','Maintain your current physique']].map(([v,t,d])=><button key={v} onClick={()=>setForm({...form,goal_mode:v})} className={`${selectBtn(form.goal_mode===v)} mb-2`}><p className='goal-title'>{t}</p><p className='goal-desc'>{d}</p></button>)}
          </>}

          {step===3 && <>
            <p className='field-label mb-3'>Experience Level</p>
            <div className='grid grid-cols-3 gap-2'>{['beginner','intermediate','advanced'].map(v=><button key={v} onClick={()=>setForm({...form,experience_level:v==='advanced'?'intermediate':v})} className={`segment-pill ${form.experience_level===(v==='advanced'?'intermediate':v)?'segment-pill-active':''}`}>{v}</button>)}</div>
          </>}

          {step===4 && <>
            <p className='field-label mb-3'>Diet Preference</p>
            <div className='grid grid-cols-3 gap-2'>{['veg','non_veg','eggetarian'].map(v=><button key={v} onClick={()=>setForm({...form,diet_preference:v})} className={`segment-pill ${form.diet_preference===v?'segment-pill-active':''}`}>{v.replace('_','-')}</button>)}</div>
          </>}

          {step===5 && <>
            <p className='field-label mb-3'>Workout Preference</p>
            <div className='grid grid-cols-2 gap-2'><button onClick={()=>setForm({...form,workout_preference:'gym'})} className={`segment-pill ${form.workout_preference==='gym'?'segment-pill-active':''}`}>🏋 Gym Workout</button><button onClick={()=>setForm({...form,workout_preference:'home'})} className={`segment-pill ${form.workout_preference==='home'?'segment-pill-active':''}`}>🏠 Home Workout</button></div>
          </>}

          {step===6 && <>
            <p className='field-label'>Ready to Generate</p>
            <p className='text-zinc-300 text-sm mt-2'>We’ll build workout and nutrition strategy around your profile.</p>
            <button className='generate-cta mt-5 w-full' onClick={generate}>Generate My AI Plan</button>
            {error && <p className='text-rose-300 text-sm mt-3'>{error}</p>}
          </>}

          {step<6 && <button className='generate-cta mt-6 w-full' onClick={()=>setStep(step+1)}>Continue</button>}
        </motion.div>}

        {step===7 && <motion.div key='g' initial={{opacity:0}} animate={{opacity:1}} className={`${card} text-center py-12`}>
          <div className='mx-auto h-28 w-28 rounded-full border border-cyan-300/40 grid place-items-center mb-5 animate-pulse'><Activity className='text-cyan-300' /></div>
          <p className='text-lg'>Analyzing metabolism…</p>
          <p className='text-zinc-400 text-sm mt-2'>Generating nutrition strategy…</p>
          <p className='text-zinc-400 text-sm'>Building workout split…</p>
          <div className='mt-5 h-2 w-full bg-white/10 rounded-full overflow-hidden'><div className='h-full bg-gradient-to-r from-cyan-400 to-violet-400' style={{width:`${progress}%`}}/></div>
          <p className='text-sm text-zinc-300 mt-2'>{progress}%</p>
        </motion.div>}
      </AnimatePresence>

      {step===8 && result && <Dashboard data={result} payload={form} workoutPreference={form.workout_preference} />}
    </div>
  </div>
}
