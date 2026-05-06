import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';
import { Dashboard } from '../dashboard/Dashboard';
import { NeuralBackground } from '../dashboard/NeuralBackground';

export function LandingPage() {
  const [phase, setPhase] = useState('hero'); // hero | onboarding | loading | results
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const onboardingRef = useRef(null);
  const [form, setForm] = useState({ height_feet: 5, height_inches: 8, weight_kg: 72, goal_mode: 'cut', experience_level: 'beginner', diet_preference: 'veg', workout_preference: 'gym' });

  const openOnboarding = () => {
    setPhase('onboarding');
    setTimeout(() => onboardingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
  };

  const generatePlan = async () => {
    setError('');
    setPhase('loading');
    let p = 5;
    setProgress(p);
    const timer = setInterval(() => { p = Math.min(95, p + 9); setProgress(p); }, 220);
    try {
      const res = await api.post('/plans/scan/', { ...form, weight_kg: Number(form.weight_kg) });
      clearInterval(timer); setProgress(100);
      setTimeout(() => { setResult(res.data); setPhase('results'); }, 300);
    } catch {
      clearInterval(timer);
      setError('Unable to generate your AI plan. Please try again.');
      setPhase('onboarding');
    }
  };

  return <div className='min-h-screen bg-[#050505] text-white relative overflow-hidden'><NeuralBackground />
    <div className='max-w-6xl mx-auto px-4 py-8 md:py-12'>
      <section className='hero-grid gap-10 items-center'>
        <div className='space-y-5'>
          <p className='coach-label'>METADIET AI</p>
          <h1 className='hero-title'>Upgrade Your Body Like Software.</h1>
          <p className='coach-subtitle'>Your AI coach builds a personalized fat-loss, muscle-building, and nutrition system designed specifically for your body.</p>
          <button className='generate-cta px-8 w-full sm:w-auto' onClick={openOnboarding}>Start AI Body Scan</button>
          <div className='flex items-center gap-3 text-sm text-zinc-300'><span>⭐⭐⭐⭐⭐</span><span>Trusted by 25,000+ users</span></div>
        </div>
        <div className='glass premium-card rounded-3xl p-6 h-[320px] grid place-items-center'>
          <div className='holo-body'>
            <div className='ring ring-a'/><div className='ring ring-b'/><div className='ring ring-c'/><div className='body-core'/>
          </div>
        </div>
      </section>

      <AnimatePresence mode='wait'>
        {phase === 'onboarding' && <motion.section key='on' ref={onboardingRef} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} className='onboarding-card max-w-3xl mx-auto mt-10'>
          <p className='field-label'>Body Scan Setup</p>
          <div className='grid sm:grid-cols-2 gap-3 mt-3'>
            <select className='premium-input' value={form.height_feet} onChange={e=>setForm({...form,height_feet:Number(e.target.value)})}>{[4,5,6,7,8].map(v=><option key={v}>{v} ft</option>)}</select>
            <select className='premium-input' value={form.height_inches} onChange={e=>setForm({...form,height_inches:Number(e.target.value)})}>{Array.from({length:12},(_,i)=>i).map(v=><option key={v}>{v} in</option>)}</select>
            <div className='relative sm:col-span-2'><input className='premium-input pr-10' type='number' value={form.weight_kg} onChange={e=>setForm({...form,weight_kg:Number(e.target.value)})}/><span className='suffix'>kg</span></div>
          </div>
          <div className='mt-4 grid sm:grid-cols-3 gap-2'>{[['cut','Fat Loss'],['bulk','Muscle Gain'],['maintain','Maintain']].map(([v,t])=><button key={v} onClick={()=>setForm({...form,goal_mode:v})} className={`segment-pill ${form.goal_mode===v?'segment-pill-active':''}`}>{t}</button>)}</div>
          <div className='mt-3 grid sm:grid-cols-3 gap-2'>{['veg','non_veg','eggetarian'].map(v=><button key={v} onClick={()=>setForm({...form,diet_preference:v})} className={`segment-pill ${form.diet_preference===v?'segment-pill-active':''}`}>{v.replace('_','-')}</button>)}</div>
          <div className='mt-3 grid sm:grid-cols-3 gap-2'>{['beginner','intermediate','advanced'].map(v=><button key={v} onClick={()=>setForm({...form,experience_level:v==='advanced'?'intermediate':v})} className={`segment-pill ${form.experience_level===(v==='advanced'?'intermediate':v)?'segment-pill-active':''}`}>{v}</button>)}</div>
          <div className='mt-3 grid sm:grid-cols-2 gap-2'><button onClick={()=>setForm({...form,workout_preference:'gym'})} className={`segment-pill ${form.workout_preference==='gym'?'segment-pill-active':''}`}>Gym Workout</button><button onClick={()=>setForm({...form,workout_preference:'home'})} className={`segment-pill ${form.workout_preference==='home'?'segment-pill-active':''}`}>Home Workout</button></div>
          <button className='generate-cta w-full mt-6' onClick={generatePlan}>Generate My AI Plan</button>
          {error && <p className='text-rose-300 text-sm mt-3'>{error}</p>}
        </motion.section>}

        {phase === 'loading' && <motion.section key='load' initial={{opacity:0}} animate={{opacity:1}} className='onboarding-card max-w-3xl mx-auto mt-10 text-center py-12'>
          <div className='scan-loader mx-auto mb-4'/>
          <p className='text-lg'>Analyzing body profile...</p>
          <p className='text-zinc-400 text-sm mt-2'>Building nutrition system...</p>
          <p className='text-zinc-400 text-sm'>Creating workout engine...</p>
          <p className='text-zinc-400 text-sm'>Finalizing transformation plan...</p>
          <div className='mt-4 h-2 w-full bg-white/10 rounded-full overflow-hidden'><div className='h-full bg-gradient-to-r from-cyan-400 to-violet-400' style={{width:`${progress}%`}}/></div>
        </motion.section>}
      </AnimatePresence>

      {phase === 'results' && result && <Dashboard data={result} payload={form} workoutPreference={form.workout_preference} />}
    </div>
  </div>
}
