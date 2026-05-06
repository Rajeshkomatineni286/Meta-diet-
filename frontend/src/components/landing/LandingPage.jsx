import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Droplets, Flame, BatteryCharging, HeartPulse } from 'lucide-react';
import api from '../../lib/api';
import { Dashboard } from '../dashboard/Dashboard';
import { NeuralBackground } from '../dashboard/NeuralBackground';

const metricCards = [
  ['BMI', '24.1', Activity],
  ['Body Fat', '23%', HeartPulse],
  ['Hydration', '3.2L', Droplets],
  ['Metabolism', 'Balanced', Flame],
  ['Energy', '81', BatteryCharging],
];

export function LandingPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ height_feet: 5, height_inches: 8, weight_kg: 72, goal_mode: 'cut', experience_level: 'beginner', diet_preference: 'veg', workout_preference: 'gym' });

  const bmi = useMemo(() => {
    const cm = (form.height_feet * 12 + form.height_inches) * 2.54;
    const m = cm / 100;
    return (form.weight_kg / (m * m)).toFixed(1);
  }, [form.height_feet, form.height_inches, form.weight_kg]);

  const generate = async () => {
    setLoading(true); let p = 0;
    const timer = setInterval(() => { p += 8; setProgress(Math.min(96, p)); }, 180);
    try {
      const res = await api.post('/plans/scan/', { ...form, weight_kg: Number(form.weight_kg) });
      setProgress(100);
      setTimeout(() => setResult(res.data), 300);
    } catch {
      setToast('Unable to generate your AI plan. Please try again.');
      setTimeout(() => setToast(''), 2600);
    } finally { clearInterval(timer); setLoading(false); }
  };

  return <div className='min-h-screen bg-[#050505] text-white relative overflow-hidden'><NeuralBackground />
    <div className='max-w-6xl mx-auto px-4 py-8 md:py-12'>
      <AnimatePresence>{toast && <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0}} className='fixed top-4 left-1/2 -translate-x-1/2 z-40 bg-rose-500/90 text-white px-4 py-2 rounded-xl text-sm'>{toast}</motion.div>}</AnimatePresence>

      <section className='hero-grid items-center gap-8'>
        <div className='space-y-5'>
          <p className='coach-label'>METADIET AI</p>
          <h1 className='hero-title'>Upgrade Your Body Like Software.</h1>
          <p className='coach-subtitle'>Your AI coach builds a personalized fat-loss, muscle-building, and nutrition system designed specifically for your body.</p>
          <div className='flex flex-wrap gap-3'>
            <button className='generate-cta px-8' onClick={() => setShowOnboarding(true)}>Start AI Body Scan</button>
            <button className='segment-pill px-6'>See How It Works</button>
          </div>
          <div className='flex items-center gap-3 text-sm text-zinc-300'><span>⭐⭐⭐⭐⭐</span><span>Trusted by 25,000+ users</span></div>
        </div>

        <div className='glass premium-card p-5 rounded-3xl'>
          <div className='holo-wrap'>
            <div className='holo-body'>
              <div className='ring ring-a'/><div className='ring ring-b'/><div className='ring ring-c'/>
              <div className='body-core'/>
            </div>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4'>
            {metricCards.map(([k,v,Icon]) => <motion.div key={k} whileHover={{ y:-3 }} className='glass p-3 rounded-xl'>
              <p className='text-xs text-zinc-400 flex items-center gap-1'><Icon size={14}/>{k}</p><p className='text-lg mt-1'>{k==='BMI'?bmi:v}</p>
            </motion.div>)}
          </div>
        </div>
      </section>

      <AnimatePresence>
      {showOnboarding && !result && <motion.section initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0}} className='onboarding-card max-w-3xl mx-auto mt-10'>
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

        {!loading ? <button className='generate-cta w-full mt-6' onClick={generate}>Generate My AI Plan</button> : <div className='mt-6 text-center'><div className='scan-loader mx-auto mb-3'/><p>Analyzing your body profile...</p><div className='mt-3 h-2 w-full bg-white/10 rounded-full overflow-hidden'><div className='h-full bg-gradient-to-r from-cyan-400 to-violet-400' style={{width:`${progress}%`}}/></div></div>}
      </motion.section>}
      </AnimatePresence>

      {result && <Dashboard data={result} payload={form} workoutPreference={form.workout_preference} />}
    </div>
  </div>
}
