import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';
import { Dashboard } from '../dashboard/Dashboard';
import { NeuralBackground } from '../dashboard/NeuralBackground';

const feet = [4,5,6,7,8];
const inches = Array.from({length:12},(_,i)=>i);
const goals = [
  ['cut','🔥','Fat Loss','Burn fat while maintaining muscle'],
  ['bulk','💪','Muscle Gain','Build lean size and strength'],
  ['maintain','⚖️','Maintain','Maintain your current physique'],
];

const Pill = ({active, children, ...rest}) => <button {...rest} className={`px-4 py-2 rounded-full text-sm transition-all ${active?'bg-white text-black ring-2 ring-cyan-300/40 shadow-lg shadow-cyan-500/10':'bg-white/10 text-zinc-300 border border-white/10 opacity-80'}`}>{active?'✓ ':''}{children}</button>;

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
      <h1 className='text-3xl sm:text-5xl font-semibold tracking-tight'>Your AI Body Transformation Coach</h1>
      <p className='text-zinc-300 mt-3 max-w-3xl'>Personalized workout, nutrition, and fat-loss planning built around your body, goals, and lifestyle.</p>

      <div className='grid md:grid-cols-2 gap-4 mt-7'>
        <div className='glass p-4 rounded-2xl'><label className='text-sm text-zinc-300'>Your Height</label><div className='mt-2 grid grid-cols-2 gap-2'><select className='hud-input' value={form.height_feet} onChange={e=>setForm({...form,height_feet:Number(e.target.value)})}>{feet.map(f=><option key={f}>{f}</option>)}</select><select className='hud-input' value={form.height_inches} onChange={e=>setForm({...form,height_inches:Number(e.target.value)})}>{inches.map(i=><option key={i}>{i}</option>)}</select></div></div>
        <div className='glass p-4 rounded-2xl'><label className='text-sm text-zinc-300'>Current Weight</label><div className='relative mt-2'><input className='hud-input pr-10' type='number' value={form.weight_kg} onChange={e=>setForm({...form,weight_kg:e.target.value})}/><span className='absolute right-3 top-3 text-zinc-400 text-sm'>kg</span></div></div>
      </div>

      <div className='mt-5 grid md:grid-cols-3 gap-3'>{goals.map(([v,icon,t,d])=><button key={v} onClick={()=>setForm({...form,goal_mode:v})} className={`text-left rounded-2xl p-4 transition-all ${form.goal_mode===v?'bg-white text-black ring-2 ring-cyan-300/40 shadow-lg':'bg-white/5 border border-white/10 opacity-90'}`}><p className='font-semibold'>{icon} {t} {form.goal_mode===v?'✓':''}</p><p className={`text-xs mt-1 ${form.goal_mode===v?'text-black/70':'text-zinc-400'}`}>{d}</p></button>)}</div>

      <div className='mt-5 glass p-4 rounded-2xl'><p className='text-sm text-zinc-300 mb-2'>Diet Preference</p><div className='flex flex-wrap gap-2'>{['veg','non_veg','eggetarian'].map(v=><Pill key={v} active={form.diet_preference===v} onClick={()=>setForm({...form,diet_preference:v})}>{v.replace('_','-')}</Pill>)}</div>
      <p className='text-sm text-zinc-300 mt-4 mb-2'>Experience Level</p><div className='grid sm:grid-cols-3 gap-2'>{[['beginner','Beginner','Starting or inconsistent'],['intermediate','Intermediate','Training regularly'],['advanced','Advanced','High-volume training']].map(([v,t,d])=><button key={v} onClick={()=>setForm({...form,experience_level:v==='advanced'?'intermediate':v})} className={`p-3 rounded-xl text-left ${form.experience_level===(v==='advanced'?'intermediate':v)?'bg-white text-black ring-2 ring-cyan-300/40':'bg-white/5 border border-white/10 opacity-80'}`}><p className='font-medium text-sm'>{t} {form.experience_level===(v==='advanced'?'intermediate':v)?'✓':''}</p><p className={`text-xs ${form.experience_level===(v==='advanced'?'intermediate':v)?'text-black/70':'text-zinc-400'}`}>{d}</p></button>)}</div></div>

      <div className='sticky bottom-3 mt-6'><button onClick={initialize} disabled={loading} className='w-full px-8 py-3 rounded-full bg-white text-black font-semibold'>{loading?'Generating...':'Generate My Transformation Plan'}</button></div>
      {statusMsg && <p className='mt-3 text-emerald-300 text-sm'>{statusMsg}</p>}
      {error && <p className='mt-3 text-rose-300 text-sm'>{error}</p>}
      <AnimatePresence>{result && <Dashboard data={result} payload={payload} />}</AnimatePresence>
    </motion.div></div>;
}
