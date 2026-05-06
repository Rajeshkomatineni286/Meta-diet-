import { useRef, useState } from 'react';
import api, { API_BASE_URL } from '../../lib/api';
import { Dashboard } from '../dashboard/Dashboard';
import { NeuralBackground } from '../dashboard/NeuralBackground';

const initialForm = { weight_kg: 72, goal_mode: 'cut', diet_preference: 'veg', workout_preference: 'gym' };

const goalOptions = [
  { value: 'cut', title: 'Fat Loss', desc: 'Burn body fat while maintaining muscle.' },
  { value: 'bulk', title: 'Muscle Gain', desc: 'Build lean muscle and strength.' },
  { value: 'maintain', title: 'Maintain', desc: 'Maintain your current weight and energy.' },
];

const mapApiError = (err) => {
  if (err?.code === 'ECONNABORTED') return 'Request timeout. Server took too long to respond.';
  if (!err?.response) return 'Backend sleeping or network/CORS issue. Retrying automatically...';
  if (err.response.status === 400) return err?.response?.data?.detail || 'Validation failed. Please verify all fields.';
  if (err.response.status === 401 || err.response.status === 403) return 'Authorization issue. Please re-authenticate.';
  if (err.response.status >= 500) return 'Server error on backend. Please retry in a moment.';
  return err?.response?.data?.detail || err?.response?.data?.message || err?.response?.data?.error || 'Request failed.';
};

export function LandingPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [wakingUp, setWakingUp] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submittedPayload, setSubmittedPayload] = useState(null);
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const onboardingRef = useRef(null);

  const openOnboarding = () => {
    console.log('BUTTON CLICKED');
    setResult(null);
    setError('');
    setShowOnboarding(true);
    setTimeout(() => onboardingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const validateForm = () => {
    if (!heightFeet || !heightInches) return setError('Please select both height fields (feet and inches).'), false;
    if (!form.weight_kg || Number(form.weight_kg) <= 0) return setError('Please enter a valid weight in kg.'), false;
    return true;
  };

  const requestPlan = async (payload) => {
    console.log('API URL:', API_BASE_URL);
    console.log('Payload:', payload);
    const response = await api.post('/plans/scan/', payload);
    console.log('Response:', response?.data);
    return response;
  };

  const generatePlan = async () => {
    if (!validateForm()) return;
    setError('');
    setWakingUp(false);
    setIsLoading(true);
    setProgress(5);

    let p = 5;
    const timer = setInterval(() => { p = Math.min(95, p + 8); setProgress(p); }, 220);

    const payload = {
      ...form,
      height_feet: Number(heightFeet),
      height_inches: Number(heightInches),
      weight_kg: Number(form.weight_kg),
      weight: Number(form.weight_kg),
      goal: form.goal_mode,
      diet_type: form.diet_preference,
      workout_type: form.workout_preference,
    };

    setSubmittedPayload(payload);

    try {
      const res = await requestPlan(payload);
      clearInterval(timer);
      setProgress(100);
      setTimeout(() => { setResult(res.data); setIsLoading(false); }, 220);
    } catch (err) {
      console.error('API ERROR:', err);
      setWakingUp(true);
      setError(mapApiError(err));

      try {
        await new Promise((r) => setTimeout(r, 5000));
        const retryRes = await requestPlan(payload);
        clearInterval(timer);
        setProgress(100);
        setWakingUp(false);
        setTimeout(() => { setResult(retryRes.data); setIsLoading(false); }, 220);
      } catch (retryErr) {
        console.error('API ERROR:', retryErr);
        clearInterval(timer);
        setIsLoading(false);
        setWakingUp(false);
        setError(mapApiError(retryErr));
      }
    }
  };

  return <div className='min-h-screen bg-[#050505] text-white relative'>
    <NeuralBackground />
    <div className='relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12'>
      <section className='bg-[#111827] rounded-2xl p-6 sm:p-10 mb-6'>
        <p className='coach-label text-center'>METADIET AI</p>
        <h1 className='hero-title text-center'>Upgrade Your Body Like Software.</h1>
        <p className='coach-subtitle max-w-xl mx-auto text-center'>Your AI coach builds a personalized fat-loss, muscle-building, and nutrition system designed specifically for your body.</p>
        <div className='relative z-50 mt-6 max-w-md mx-auto'>
          <button type='button' onClick={openOnboarding} className='generate-cta w-full min-h-12 text-base'>Start AI Body Scan</button>
        </div>
      </section>

      {showOnboarding && !isLoading && !result && <section ref={onboardingRef} className='bg-[#14532d] rounded-2xl p-6 max-w-[420px] mx-auto'>
        <p className='field-label text-white text-center text-base'>Body Scan Setup</p>

        <div className='mt-6 space-y-6'>
          <div>
            <label className='block mb-2 text-sm'>Height</label>
            <div className='grid grid-cols-2 gap-3'>
              <select className='premium-input w-full rounded-2xl p-4 text-base min-h-12' value={heightFeet} onChange={(e) => setHeightFeet(e.target.value)}><option value=''>Feet</option>{[4, 5, 6, 7, 8].map((v) => <option key={v} value={String(v)}>{v} ft</option>)}</select>
              <select className='premium-input w-full rounded-2xl p-4 text-base min-h-12' value={heightInches} onChange={(e) => setHeightInches(e.target.value)}><option value=''>Inches</option>{Array.from({ length: 12 }, (_, i) => i).map((v) => <option key={v} value={String(v)}>{v} in</option>)}</select>
            </div>
          </div>

          <div>
            <label className='block mb-2 text-sm'>Current Weight (kg)</label>
            <input className='premium-input w-full rounded-2xl p-4 text-base min-h-12' type='number' value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: Number(e.target.value) })} />
          </div>

          <div>
            <label className='block mb-2 text-sm'>Goal</label>
            <div className='space-y-3'>
              {goalOptions.map((g) => <button type='button' key={g.value} onClick={() => setForm({ ...form, goal_mode: g.value })} className={`w-full text-left rounded-2xl p-4 border min-h-12 ${form.goal_mode === g.value ? 'bg-white text-black border-cyan-300' : 'bg-white/5 border-white/20'}`}><p className='font-semibold text-base'>{g.title}</p><p className={`text-sm mt-1 ${form.goal_mode === g.value ? 'text-slate-700' : 'text-zinc-300'}`}>{g.desc}</p></button>)}
            </div>
          </div>

          <div>
            <label className='block mb-2 text-sm'>Diet Type</label>
            <div className='space-y-3'>{['veg', 'non_veg', 'eggetarian'].map((v) => <button type='button' key={v} onClick={() => setForm({ ...form, diet_preference: v })} className={`w-full text-left rounded-2xl p-4 border min-h-12 ${form.diet_preference === v ? 'bg-white text-black border-cyan-300' : 'bg-white/5 border-white/20'}`}>{v.replace('_', '-')}</button>)}</div>
          </div>

          <div>
            <label className='block mb-2 text-sm'>Workout Type</label>
            <div className='space-y-3'><button type='button' onClick={() => setForm({ ...form, workout_preference: 'gym' })} className={`w-full text-left rounded-2xl p-4 border min-h-12 ${form.workout_preference === 'gym' ? 'bg-white text-black border-cyan-300' : 'bg-white/5 border-white/20'}`}>Gym Workout</button><button type='button' onClick={() => setForm({ ...form, workout_preference: 'home' })} className={`w-full text-left rounded-2xl p-4 border min-h-12 ${form.workout_preference === 'home' ? 'bg-white text-black border-cyan-300' : 'bg-white/5 border-white/20'}`}>Home Workout</button></div>
          </div>

          <button type='button' className='generate-cta w-full min-h-12 text-base mt-6' onClick={generatePlan}>Generate My AI Fitness Plan</button>
          {error && <p className='text-rose-200 text-sm mt-3'>{error}</p>}
        </div>
      </section>}

      {isLoading && <section className='bg-[#1e3a8a] rounded-2xl p-6 mt-6 text-center max-w-[420px] mx-auto'>
        <div className='scan-loader mx-auto mb-4' />
        <p className='text-lg'>Analyzing body profile...</p>
        {wakingUp ? <p className='text-amber-200 text-sm mt-2'>Waking up AI engine...</p> : <p className='text-zinc-200 text-sm mt-2'>Building nutrition system...</p>}
        <p className='text-zinc-200 text-sm'>Creating workout engine...</p>
        <p className='text-zinc-200 text-sm'>Finalizing transformation plan...</p>
        <div className='mt-4 h-2 w-full bg-white/20 rounded-full overflow-hidden'><div className='h-full bg-white' style={{ width: `${progress}%` }} /></div>
      </section>}

      {result && <Dashboard data={result} payload={submittedPayload || form} workoutPreference={form.workout_preference} />}
    </div>
  </div>;
}
