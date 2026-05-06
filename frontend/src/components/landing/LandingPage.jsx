import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';
import { Dashboard } from '../dashboard/Dashboard';
import { NeuralBackground } from '../dashboard/NeuralBackground';

const feet = [4,5,6,7,8];
const inches = Array.from({length:12},(_,i)=>i);

export function LandingPage() {
  const [form, setForm] = useState({ height_feet: 5, height_inches: 6, weight_kg: 72, goal_mode: 'cut', diet_preference: 'veg', experience_level: 'beginner' });
  const [loading, setLoading] = useState(false); const [result, setResult] = useState(null); const [error, setError] = useState(''); const [statusMsg, setStatusMsg] = useState('');
  const payload = { ...form, weight_kg: Number(form.weight_kg) };
  const initialize = async () => {
    setLoading(true); setError(''); setStatusMsg('Generating your transformation plan...');
    try { const res = await api.post('/plans/scan/', payload); setResult(res.data); setStatusMsg(res.data.message); }
    catch (e) { const d=e?.response?.data; setError(d?.detail || Object.entries(d||{}).map(([k,v])=>`${k}: ${Array.isArray(v)?v.join(','):v}`).join(' | ') || e.message); }
    finally { setLoading(false); }
  };

  return <div className='min-h-screen bg-[#050505] text-white px-4 py-6 md:p-10 relative'><NeuralBackground />
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className='relative z-10 max-w-5xl mx-auto glass premium-card p-5 sm:p-7 rounded-3xl'>
      <p className='label'>Personal Transformation Setup</p>
      <h1 className='text-3xl sm:text-5xl font-semibold mt-3'>Build My Practical Fitness Plan</h1>
      <div className='grid md:grid-cols-2 gap-4 mt-6'>
        <div><label className='text-sm text-zinc-300'>Your Height</label><div className='mt-1 grid grid-cols-2 gap-2'><select className='hud-input' value={form.height_feet} onChange={e=>setForm({...form,height_feet:Number(e.target.value)})}>{feet.map(f=><option key={f} value={f}>{f} ft</option>)}</select><select className='hud-input' value={form.height_inches} onChange={e=>setForm({...form,height_inches:Number(e.target.value)})}>{inches.map(i=><option key={i} value={i}>{i} in</option>)}</select></div></div>
        <div><label className='text-sm text-zinc-300'>Current Weight</label><div className='relative mt-1'><input className='hud-input pr-10' type='number' value={form.weight_kg} onChange={e=>setForm({...form,weight_kg:e.target.value})}/><span className='absolute right-3 top-3 text-zinc-400 text-sm'>kg</span></div></div>
        <div><label className='text-sm text-zinc-300'>Goal</label><div className='mt-1 space-y-2'>{[['cut','Fat Loss','Reduce body fat and improve fitness'],['bulk','Muscle Gain','Build lean muscle and increase strength'],['maintain','Maintain','Maintain current body composition']].map(([v,t,d])=><button key={v} onClick={()=>setForm({...form,goal_mode:v})} className={`w-full text-left p-3 rounded-xl ${form.goal_mode===v?'bg-white text-black':'bg-white/10 text-white'}`}><p className='font-medium'>{t}</p><p className={`text-xs ${form.goal_mode===v?'text-black/70':'text-zinc-400'}`}>{d}</p></button>)}</div></div>
        <div><label className='text-sm text-zinc-300'>Diet Preference</label><div className='mt-1 flex gap-2'>{['veg','non_veg','eggetarian'].map(v=><button key={v} onClick={()=>setForm({...form,diet_preference:v})} className={`px-4 py-2 rounded-full text-sm ${form.diet_preference===v?'bg-white text-black':'bg-white/10'}`}>{v.replace('_','-')}</button>)}</div><label className='text-sm text-zinc-300 block mt-3'>Experience</label><div className='mt-1 flex gap-2'>{['beginner','intermediate'].map(v=><button key={v} onClick={()=>setForm({...form,experience_level:v})} className={`px-4 py-2 rounded-full text-sm ${form.experience_level===v?'bg-white text-black':'bg-white/10'}`}>{v}</button>)}</div></div>
      </div>
      <div className='sticky bottom-3 mt-6'><button onClick={initialize} disabled={loading} className='w-full px-8 py-3 rounded-full bg-white text-black font-semibold'>{loading?'Generating...':'Generate My Transformation Plan'}</button></div>
      {statusMsg && <p className='mt-3 text-emerald-300 text-sm'>{statusMsg}</p>}
      {error && <p className='mt-3 text-rose-300 text-sm'>{error}</p>}
      <AnimatePresence>{result && <Dashboard data={result} payload={payload} />}</AnimatePresence>
    </motion.div></div>;
}
