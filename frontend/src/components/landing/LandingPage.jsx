import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';
import { Dashboard } from '../dashboard/Dashboard';
import { NeuralBackground } from '../dashboard/NeuralBackground';

const feet = [4,5,6,7,8];
const inches = Array.from({length:12},(_,i)=>i);
const goals = [
  ['cut','🔥','Fat Loss','Lose body fat while maintaining muscle'],
  ['bulk','💪','Muscle Gain','Build lean size and strength'],
  ['maintain','⚖️','Maintain','Maintain current physique'],
];

const SegPill = ({ active, children, ...rest }) => (
  <button {...rest} className={`segment-pill ${active ? 'segment-pill-active' : ''}`}>{children}</button>
);

export function LandingPage() {
  const [form, setForm] = useState({ height_feet: 5, height_inches: 6, weight_kg: 72, goal_mode: 'cut', diet_preference: 'veg', experience_level: 'beginner', workout_preference: 'gym' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const payload = { ...form, weight_kg: Number(form.weight_kg) };

  const initialize = async () => {
    setLoading(true); setError(''); setStatusMsg('Generating your transformation plan...');
    try {
      const res = await api.post('/plans/scan/', payload);
      setResult(res.data); setStatusMsg(res.data.message);
    } catch (e) {
      const d = e?.response?.data;
      setError(d?.detail || Object.entries(d || {}).map(([k,v])=>`${k}: ${Array.isArray(v)?v.join(','):v}`).join(' | ') || e.message);
    } finally { setLoading(false); }
  };

  return <div className='min-h-screen bg-[#050505] text-white px-4 py-6 md:p-10 relative'><NeuralBackground />
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className='relative z-10 max-w-xl mx-auto onboarding-shell'>
      <p className='coach-label'>AI Transformation Coach</p>
      <h1 className='coach-title'>Build Your Personalized Fat Loss & Fitness Plan</h1>
      <p className='coach-subtitle'>Custom workout and diet plans based on your body, goal, and lifestyle.</p>

      <div className='onboarding-card mt-6'>
        <label className='field-label'>Height</label>
        <div className='grid grid-cols-2 gap-3 mt-2'>
          <select className='premium-input' value={form.height_feet} onChange={e=>setForm({...form,height_feet:Number(e.target.value)})}>{feet.map(f=><option key={f}>{f} ft</option>)}</select>
          <select className='premium-input' value={form.height_inches} onChange={e=>setForm({...form,height_inches:Number(e.target.value)})}>{inches.map(i=><option key={i}>{i} in</option>)}</select>
        </div>

        <label className='field-label mt-5 block'>Current Weight</label>
        <div className='relative mt-2'>
          <input className='premium-input pr-11' type='number' placeholder='Enter your current weight' value={form.weight_kg} onChange={e=>setForm({...form,weight_kg:e.target.value})} />
          <span className='suffix'>kg</span>
        </div>

        <label className='field-label mt-5 block'>Goal</label>
        <div className='mt-2 space-y-2'>
          {goals.map(([v,icon,t,d]) => <button key={v} onClick={()=>setForm({...form,goal_mode:v})} className={`goal-card ${form.goal_mode===v?'goal-card-active':''}`}>
            <p className='goal-title'>{icon} {t} {form.goal_mode===v ? '✓' : ''}</p>
            <p className='goal-desc'>{d}</p>
          </button>)}
        </div>

        <label className='field-label mt-5 block'>Diet Preference</label>
        <div className='mt-2 grid grid-cols-3 gap-2'>
          {['veg','non_veg','eggetarian'].map(v => <SegPill key={v} active={form.diet_preference===v} onClick={()=>setForm({...form,diet_preference:v})}>{v.replace('_','-')}</SegPill>)}
        </div>

        <label className='field-label mt-5 block'>Experience Level</label>
        <div className='mt-2 grid grid-cols-3 gap-2'>
          {['beginner','intermediate','advanced'].map(v => <SegPill key={v} active={form.experience_level===(v==='advanced'?'intermediate':v)} onClick={()=>setForm({...form,experience_level:v==='advanced'?'intermediate':v})}>{v}</SegPill>)}
        </div>

        <label className='field-label mt-5 block'>Workout Preference</label>
        <div className='mt-2 grid grid-cols-2 gap-2'>
          <SegPill active={form.workout_preference==='gym'} onClick={()=>setForm({...form,workout_preference:'gym'})}>Gym Workout</SegPill>
          <SegPill active={form.workout_preference==='home'} onClick={()=>setForm({...form,workout_preference:'home'})}>Home Workout</SegPill>
        </div>

        <button onClick={initialize} disabled={loading} className='generate-cta mt-6'>{loading ? 'Generating...' : 'Generate My AI Plan'}</button>
        {statusMsg && <p className='mt-3 text-emerald-300 text-sm'>{statusMsg}</p>}
        {error && <p className='mt-3 text-rose-300 text-sm'>{error}</p>}
      </div>

      <AnimatePresence>{result && <Dashboard data={result} payload={payload} />}</AnimatePresence>
    </motion.div>
  </div>;
}
