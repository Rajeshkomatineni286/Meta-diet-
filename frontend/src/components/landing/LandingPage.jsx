import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';
import { Dashboard } from '../dashboard/Dashboard';
import { NeuralBackground } from '../dashboard/NeuralBackground';

const heightOptions = [{label:'4 ft',cm:122},{label:'4.5 ft',cm:137},{label:'5 ft',cm:152},{label:'5.5 ft',cm:167},{label:'6 ft',cm:183},{label:'6.5 ft',cm:198},{label:'7 ft',cm:213},{label:'7.5 ft',cm:229},{label:'8 ft',cm:244}];

export function LandingPage() {
  const [form, setForm] = useState({ height_cm: 167, weight_kg: 72, goal_mode: 'cut', diet_preference: 'veg', experience_level: 'beginner' });
  const [loading, setLoading] = useState(false); const [result, setResult] = useState(null); const [error, setError] = useState(''); const [statusMsg, setStatusMsg] = useState('');

  const initialize = async () => {
    const payload = { height_cm: Number(form.height_cm), weight_kg: Number(form.weight_kg), goal_mode: form.goal_mode, diet_preference: form.diet_preference, experience_level: form.experience_level };
    setLoading(true); setError(''); setStatusMsg('Generating your personalized coach...');
    try { const res = await api.post('/plans/scan/', payload, { headers: { 'Content-Type': 'application/json' } }); setResult(res.data); setStatusMsg(res.data.message); }
    catch (e) { const d=e?.response?.data; setError(d?.detail || Object.entries(d||{}).map(([k,v])=>`${k}: ${Array.isArray(v)?v.join(','):v}`).join(' | ') || e.message); }
    finally { setLoading(false); }
  };

  return <div className="min-h-screen bg-[#050505] text-white px-4 py-6 md:p-10 relative"><NeuralBackground />
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="relative z-10 max-w-5xl mx-auto glass premium-card p-5 sm:p-7 rounded-3xl">
      <p className="label">Initializing Neural Body OS</p>
      <h1 className="text-3xl sm:text-5xl font-semibold mt-3">Your Premium Transformation Coach</h1>
      <div className="grid md:grid-cols-2 gap-3 mt-6">
        <div><label className='text-sm text-zinc-300'>Height</label><select className='hud-input mt-1' value={form.height_cm} onChange={e=>setForm({...form,height_cm:e.target.value})}>{heightOptions.map(h=><option key={h.cm} value={h.cm}>{h.label}</option>)}</select></div>
        <div><label className='text-sm text-zinc-300'>Current Weight (kg)</label><input className='hud-input mt-1' type='number' value={form.weight_kg} onChange={e=>setForm({...form,weight_kg:e.target.value})} /></div>
        <div><label className='text-sm text-zinc-300'>Goal</label><div className='mt-1 grid grid-cols-3 gap-2'>{[['cut','Lose Fat'],['bulk','Build Muscle'],['maintain','Maintain Weight']].map(([v,l])=><button key={v} onClick={()=>setForm({...form,goal_mode:v})} className={`px-3 py-2 rounded-xl text-sm ${form.goal_mode===v?'bg-white text-black':'bg-white/10'}`}>{l}</button>)}</div></div>
        <div><label className='text-sm text-zinc-300'>Diet Preference</label><select className='hud-input mt-1' value={form.diet_preference} onChange={e=>setForm({...form,diet_preference:e.target.value})}><option value='veg'>Veg</option><option value='non_veg'>Non-Veg</option><option value='eggetarian'>Eggetarian</option></select></div>
      </div>
      <button onClick={initialize} disabled={loading} className='mt-6 px-8 py-3 rounded-full bg-white text-black font-medium'>{loading?'Analyzing...':'Initialize Your Body System'}</button>
      {statusMsg && <p className='mt-3 text-emerald-300 text-sm'>{statusMsg}</p>}
      {error && <p className='mt-3 text-rose-300 text-sm'>{error}</p>}
      <AnimatePresence>{result && <Dashboard data={result} />}</AnimatePresence>
    </motion.div></div>;
}
