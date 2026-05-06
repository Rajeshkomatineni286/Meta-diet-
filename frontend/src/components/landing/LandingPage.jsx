import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Droplets, Flame, HeartPulse, Zap } from 'lucide-react';
import api from '../../lib/api';
import { Dashboard } from '../dashboard/Dashboard';
import { NeuralBackground } from '../dashboard/NeuralBackground';

const heights = Array.from({ length: (8-4)*12 + 1 }, (_,i)=>({feet:4+Math.floor(i/12), inches:i%12}));

const FloatCard = ({title,value,icon:Icon,cls}) => <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} whileHover={{y:-4}} className={`float-card ${cls}`}><div className='flex items-center gap-2 text-xs text-zinc-300'><Icon size={14}/>{title}</div><p className='text-lg mt-1'>{value}</p></motion.div>

export function LandingPage() {
  const [step, setStep] = useState(0); const [loading, setLoading] = useState(false); const [progress, setProgress] = useState(0); const [result, setResult] = useState(null); const [toast, setToast] = useState('');
  const [form, setForm] = useState({ height_feet: 5, height_inches: 8, weight_kg: 72, goal_mode: 'cut', experience_level: 'beginner', diet_preference: 'veg', workout_preference: 'gym' });

  const bmi = useMemo(() => { const cm=(form.height_feet*12+form.height_inches)*2.54; const m=cm/100; return (form.weight_kg/(m*m)).toFixed(1); }, [form]);

  const generate = async () => {
    setStep(7); setLoading(true); let p=0;
    const timer = setInterval(()=>{ p+=7; setProgress(Math.min(95,p)); }, 170);
    try { const res=await api.post('/plans/scan/', { ...form, weight_kg:Number(form.weight_kg) }); setProgress(100); setTimeout(()=>{ setResult(res.data); setStep(8); },350); }
    catch { setToast('Unable to generate your AI plan. Please try again.'); setTimeout(()=>setToast(''),2800); setStep(6); }
    finally { clearInterval(timer); setLoading(false); }
  };

  const card = 'onboarding-card max-w-3xl mx-auto';

  return <div className='min-h-screen bg-[#050505] text-white relative overflow-hidden'><NeuralBackground />
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <AnimatePresence>{toast && <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0}} className='fixed top-4 left-1/2 -translate-x-1/2 z-40 bg-rose-500/90 text-white px-4 py-2 rounded-xl text-sm shadow-xl'>{toast}</motion.div>}</AnimatePresence>
      <AnimatePresence mode='wait'>
        {step===0 && <motion.section key='hero' initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className='grid lg:grid-cols-2 gap-8 items-center py-10'>
          <div>
            <p className='coach-label'>AI Transformation Coach</p>
            <h1 className='hero-title'>Upgrade Your Body Like Software.</h1>
            <p className='coach-subtitle'>Your AI coach builds a personalized fat-loss, muscle-building, and nutrition system designed specifically for your body.</p>
            <button className='generate-cta mt-7 w-full sm:w-auto px-8' onClick={()=>setStep(1)}>{loading?'Initializing AI Scan...':'Start AI Body Scan →'}</button>
            <div className='mt-6 flex items-center gap-3 text-sm text-zinc-300'><span>⭐⭐⭐⭐⭐</span><span>Trusted by 25,000+ users</span></div>
          </div>
          <div className='relative h-[360px] md:h-[420px]'>
            <div className='holo-core'>
              <div className='ring ring-a'/><div className='ring ring-b'/><div className='ring ring-c'/>
            </div>
            <FloatCard cls='fc1' title='BMI' value={bmi} icon={Activity}/>
            <FloatCard cls='fc2' title='Body Fat' value='23%' icon={HeartPulse}/>
            <FloatCard cls='fc3' title='Metabolism' value='Balanced' icon={Flame}/>
            <FloatCard cls='fc4' title='Hydration' value='3.2L' icon={Droplets}/>
            <FloatCard cls='fc5' title='Energy Score' value='81' icon={Zap}/>
          </div>
        </motion.section>}

        {step>0 && step<7 && <motion.div key={`s${step}`} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} className={card}>
          {step===1 && <><p className='field-label'>Height & Weight</p><div className='grid grid-cols-2 gap-3 mt-3'><select className='premium-input' value={`${form.height_feet}-${form.height_inches}`} onChange={e=>{const [f,i]=e.target.value.split('-').map(Number);setForm({...form,height_feet:f,height_inches:i});}}>{heights.map(h=><option key={`${h.feet}-${h.inches}`} value={`${h.feet}-${h.inches}`}>{h.feet} ft {h.inches} in</option>)}</select><div className='relative'><input className='premium-input pr-10' type='number' value={form.weight_kg} onChange={e=>setForm({...form,weight_kg:Number(e.target.value)})}/><span className='suffix'>kg</span></div></div><div className='mt-4 bg-white/5 rounded-xl p-3 flex justify-between'><span className='text-sm text-zinc-300'>Live BMI</span><span className='font-semibold'>{bmi}</span></div></>}
          {step===2 && <><p className='field-label mb-3'>Choose Your Goal</p>{[['cut','🔥 Fat Loss','Burn fat while preserving muscle'],['bulk','💪 Muscle Gain','Build lean size and strength'],['maintain','⚖️ Maintain','Maintain current physique']].map(([v,t,d])=><button key={v} onClick={()=>setForm({...form,goal_mode:v})} className={`goal-card ${form.goal_mode===v?'goal-card-active':''} mb-2`}><p className='goal-title'>{t}</p><p className='goal-desc'>{d}</p></button>)}</>}
          {step===3 && <><p className='field-label mb-3'>Experience Level</p><div className='grid grid-cols-3 gap-2'>{['beginner','intermediate','advanced'].map(v=><button key={v} onClick={()=>setForm({...form,experience_level:v==='advanced'?'intermediate':v})} className={`segment-pill ${form.experience_level===(v==='advanced'?'intermediate':v)?'segment-pill-active':''}`}>{v}</button>)}</div></>}
          {step===4 && <><p className='field-label mb-3'>Diet Preference</p><div className='grid grid-cols-3 gap-2'>{['veg','non_veg','eggetarian'].map(v=><button key={v} onClick={()=>setForm({...form,diet_preference:v})} className={`segment-pill ${form.diet_preference===v?'segment-pill-active':''}`}>{v.replace('_','-')}</button>)}</div></>}
          {step===5 && <><p className='field-label mb-3'>Workout Preference</p><div className='grid grid-cols-2 gap-2'><button onClick={()=>setForm({...form,workout_preference:'gym'})} className={`segment-pill ${form.workout_preference==='gym'?'segment-pill-active':''}`}>🏋 Gym Workout</button><button onClick={()=>setForm({...form,workout_preference:'home'})} className={`segment-pill ${form.workout_preference==='home'?'segment-pill-active':''}`}>🏠 Home Workout</button></div></>}
          {step===6 && <><p className='field-label'>Ready to Generate</p><p className='text-zinc-300 text-sm mt-2'>We’ll build your personalized transformation system.</p><button className='generate-cta mt-5 w-full' onClick={generate}>Generate My AI Plan</button></>}
          {step<6 && <button className='generate-cta mt-6 w-full' onClick={()=>setStep(step+1)}>Continue</button>}
        </motion.div>}

        {step===7 && <motion.div key='gen' initial={{opacity:0}} animate={{opacity:1}} className={`${card} text-center py-12`}><div className='scan-loader mx-auto mb-5'/><p className='text-lg'>Analyzing your body profile...</p><p className='text-zinc-400 text-sm mt-2'>Building personalized nutrition system...</p><p className='text-zinc-400 text-sm'>Generating AI workout engine...</p><div className='mt-5 h-2 w-full bg-white/10 rounded-full overflow-hidden'><div className='h-full bg-gradient-to-r from-cyan-400 to-violet-400' style={{width:`${progress}%`}}/></div><p className='text-sm text-zinc-300 mt-2'>{progress}%</p></motion.div>}
      </AnimatePresence>
      {step===8 && result && <Dashboard data={result} payload={form} workoutPreference={form.workout_preference} />}
    </div>
  </div>
}
