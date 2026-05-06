import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';
import { Dashboard } from '../dashboard/Dashboard';
import { NeuralBackground } from '../dashboard/NeuralBackground';

export function LandingPage() {
  const [form, setForm] = useState({ height_cm: 172, weight_kg: 74, goal_mode: 'rebuild' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const initialize = async () => {
    const payload = {
      height_cm: Number.parseInt(String(form.height_cm), 10),
      weight_kg: Number.parseFloat(String(form.weight_kg)),
      goal_mode: String(form.goal_mode).toLowerCase(),
    };

    if (!Number.isFinite(payload.height_cm) || !Number.isFinite(payload.weight_kg) || !['cut', 'bulk', 'rebuild'].includes(payload.goal_mode)) {
      setError('Please enter valid height, weight, and goal mode.');
      setStatusMsg('');
      return;
    }

    setLoading(true);
    setError('');
    setStatusMsg('Submitting body scan...');

    try {
      console.log('POST /plans/scan payload:', payload);
      const scan = await api.post('/plans/scan/', payload, { headers: { 'Content-Type': 'application/json' } });
      console.log('POST /plans/scan success:', scan.data);
      setResult(scan.data);
      setStatusMsg(scan.data?.message || 'Neural Body System initialized successfully.');
    } catch (e) {
      const data = e?.response?.data;
      const detail = data?.detail || data?.message || (typeof data === 'object' ? Object.entries(data).map(([k,v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ') : '') || e?.message || 'Unknown API error';
      console.error('POST /api/v1/plans/scan/ failed', {
        endpoint: '/api/v1/plans/scan/',
        payload,
        request: e?.config,
        status: e?.response?.status,
        responseHeaders: e?.response?.headers,
        responseData: data,
        message: e?.message,
      });
      setError(detail);
      setStatusMsg('');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return <div className="min-h-screen bg-[#050505] text-white px-4 py-5 sm:py-8 md:p-10 relative">
    <NeuralBackground />
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="relative z-10 max-w-6xl mx-auto glass panel p-5 sm:p-7 md:p-10 rounded-3xl shadow-neon cinematic-border">
      <p className="label">INITIALIZING NEURAL BODY OS...</p>
      <h1 className="text-[2rem] sm:text-5xl md:text-7xl leading-[1.05] font-semibold mt-4 gradient-text tracking-tight">Upgrade Your Body Like Software</h1>
      <p className="text-zinc-300 mt-4 max-w-2xl text-sm sm:text-base leading-relaxed">Instant onboarding mode. No account required for your first body scan.</p>
      <div className="grid md:grid-cols-3 gap-3 mt-7">
        <input className="hud-input" placeholder="Height cm" type="number" value={form.height_cm} onChange={e=>setForm({...form,height_cm:e.target.value})} />
        <input className="hud-input" placeholder="Weight kg" type="number" value={form.weight_kg} onChange={e=>setForm({...form,weight_kg:e.target.value})} />
        <select className="hud-input" value={form.goal_mode} onChange={e=>setForm({...form,goal_mode:e.target.value})}><option value="cut">Cut</option><option value="bulk">Bulk</option><option value="rebuild">Rebuild</option></select>
      </div>
      <button onClick={initialize} disabled={loading} className="mt-6 w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-[1.02] hover:shadow-[0_0_30px_#22d3ee55] transition-all duration-300 disabled:opacity-60">
        {loading ? <span className="inline-flex items-center gap-2"><span className="loader"/> Neural Processing...</span> : 'Initialize Your Body System'}
      </button>
      {statusMsg && <p className="mt-3 text-emerald-300 text-sm">{statusMsg}</p>}
      {error && <p role="alert" className="mt-3 text-rose-300 text-sm">{error}</p>}
      <AnimatePresence mode='wait'>
        {result && <Dashboard data={result} goalMode={form.goal_mode} />}
      </AnimatePresence>
    </motion.div>
  </div>;
}
