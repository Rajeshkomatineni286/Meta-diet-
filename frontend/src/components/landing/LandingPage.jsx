import { useRef, useState } from 'react';
import { Dashboard } from '../dashboard/Dashboard';
import { NeuralBackground } from '../dashboard/NeuralBackground';
import { API_BASE_URL } from '../../lib/api';

const initialForm = { weight_kg: 72, goal_mode: 'cut', diet_preference: 'veg', workout_preference: 'gym' };

const goalOptions = [
  { value: 'cut', title: 'Fat Loss', desc: 'Burn body fat while maintaining muscle.' },
  { value: 'bulk', title: 'Muscle Gain', desc: 'Build lean muscle and strength.' },
  { value: 'maintain', title: 'Maintain', desc: 'Maintain your current weight and energy.' },
];

const selectedCard = 'border-2 border-cyan-300 bg-gradient-to-r from-cyan-100 to-indigo-100 text-black shadow-[0_0_30px_rgba(34,211,238,0.35)] scale-[1.01]';
const idleCard = 'border border-white/20 bg-white/5 text-white';

export function LandingPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialForm);
  const [submittedPayload, setSubmittedPayload] = useState(null);
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const onboardingRef = useRef(null);

  const openOnboarding = () => {
    setResult(null);
    setError('');
    setShowOnboarding(true);
    setTimeout(() => onboardingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const validateForm = () => {
    if (!heightFeet || !heightInches) return 'Please select height (feet and inches).';
    if (!form.weight_kg || Number(form.weight_kg) <= 0) return 'Please enter a valid weight.';

    const payload = {
      height_feet: Number(heightFeet),
      height_inches: Number(heightInches),
      weight: Number(form.weight_kg),
      goal: form.goal_mode,
      diet_type: form.diet_preference,
      workout_type: form.workout_preference,
      experience_level: 'intermediate',
    };

    for (const [k, v] of Object.entries(payload)) {
      if (v === '' || v === null || v === undefined || Number.isNaN(v)) return `Missing or invalid field: ${k}`;
    }

    return '';
  };

  const generatePlan = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      ...form,
      height_feet: Number(heightFeet),
      height_inches: Number(heightInches),
      weight_kg: Number(form.weight_kg),
      weight: Number(form.weight_kg),
      goal: form.goal_mode,
      diet_type: form.diet_preference,
      workout_type: form.workout_preference,
      experience_level: 'intermediate',
    };

    setSubmittedPayload(payload);
    setError('');
    setIsLoading(true);
    setProgress(8);

    let p = 8;
    const timer = setInterval(() => { p = Math.min(94, p + 7); setProgress(p); }, 220);

    try {
      const url = `${API_BASE_URL}/api/v1/plans/scan/`;
      console.log('Submitting payload:', payload);
      console.log('API URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Status:', response.status);
      const responseText = await response.text();
      console.log('RAW RESPONSE:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        if (responseText.trim().toLowerCase().startsWith('<!doctype html') || responseText.trim().startsWith('<html')) {
          throw new Error('Backend returned HTML instead of JSON. Check API_BASE_URL and backend route.');
        }
        throw new Error('Invalid JSON response from backend.');
      }

      console.log('Response data:', data);

      if (!response.ok) {
        const exact = data?.detail || data?.message || data?.error || JSON.stringify(data);
        throw new Error(exact || `Server returned ${response.status}`);
      }

      clearInterval(timer);
      setProgress(100);
      setTimeout(() => { setResult(data); setIsLoading(false); }, 220);
    } catch (err) {
      console.error('Plan generation error:', err);
      clearInterval(timer);
      setIsLoading(false);
      setError(err?.message || 'Unknown API error');
    }
  };

  return <div className='min-h-screen bg-[#050505] text-white relative'>
    <NeuralBackground />
    <div className='relative z-10 w-full max-w-[420px] mx-auto px-[18px] pt-5 pb-14'>
      <section className='bg-[#111827] rounded-2xl p-6 sm:p-10 mb-6'>
        <p className='coach-label text-center'>METADIET</p>
        <h1 className='hero-title text-center text-[34px] sm:text-[42px]'>Transform Your Physique With Precision</h1>
        <p className='coach-subtitle max-w-xl mx-auto text-center text-[15px] leading-[1.8] opacity-80 max-w-[320px] mx-auto'>Personalized workout and nutrition plans designed for your body, goals, and lifestyle.</p>
        <div className='relative z-50 mt-6 max-w-md mx-auto'>
          <button type='button' onClick={openOnboarding} className='generate-cta w-full h-[58px] px-7 rounded-[18px] text-lg font-bold shadow-[0_0_30px_rgba(103,232,249,0.35)] hover:scale-[1.01] transition'>Build My Plan</button>
        </div>
      </section>

      {showOnboarding && !isLoading && !result && <section ref={onboardingRef} className='bg-[#14532d] rounded-2xl max-w-[420px] mx-auto px-5 pt-8 pb-6'>
        <p className='field-label text-white text-center text-xl'>Program Setup</p>

        <div className='mt-7 space-y-7'>
          <div>
            <label className='block mb-[10px] text-base'>Height</label>
            <div className='grid grid-cols-2 gap-[14px]'>
              <select className='premium-input w-full h-14 rounded-[18px] text-lg pl-4' value={heightFeet} onChange={(e) => setHeightFeet(e.target.value)}><option value=''>Feet</option>{[4, 5, 6, 7, 8].map((v) => <option key={v} value={String(v)}>{v} ft</option>)}</select>
              <select className='premium-input w-full h-14 rounded-[18px] text-lg pl-4' value={heightInches} onChange={(e) => setHeightInches(e.target.value)}><option value=''>Inches</option>{Array.from({ length: 12 }, (_, i) => i).map((v) => <option key={v} value={String(v)}>{v} in</option>)}</select>
            </div>
          </div>

          <div className='mt-6'>
            <label className='block mb-[10px] text-base'>Current Weight (kg)</label>
            <input className='premium-input w-full h-14 rounded-[18px] text-lg pl-4' type='number' value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: Number(e.target.value) })} />
          </div>

          <div className='mt-6'>
            <label className='block mb-[10px] text-base'>Goal</label>
            <div className='space-y-[14px]'>
              {goalOptions.map((g) => {
                const active = form.goal_mode === g.value;
                return <button type='button' key={g.value} onClick={() => setForm({ ...form, goal_mode: g.value })} className={`w-full text-left rounded-2xl p-4 min-h-14 transition ${active ? selectedCard : idleCard}`}>
                  <div className='flex items-start justify-between gap-3'>
                    <div><p className='font-semibold text-lg'>{g.title}</p><p className={`text-sm mt-1 ${active ? 'text-slate-700' : 'text-zinc-300'}`}>{g.desc}</p></div>
                    {active && <span className='text-lg font-bold'>✓</span>}
                  </div>
                </button>;
              })}
            </div>
          </div>

          <div className='mt-6'>
            <label className='block mb-[10px] text-base'>Diet Type</label>
            <div className='space-y-[14px]'>{['veg', 'non_veg', 'eggetarian'].map((v) => {
              const active = form.diet_preference === v;
              return <button type='button' key={v} onClick={() => setForm({ ...form, diet_preference: v })} className={`w-full text-left rounded-2xl p-4 min-h-14 transition ${active ? selectedCard : idleCard}`}>
                <div className='flex items-center justify-between'><span className='text-lg capitalize'>{v.replace('_', '-')}</span>{active && <span className='text-lg font-bold'>✓</span>}</div>
              </button>;
            })}</div>
          </div>

          <div className='mt-6'>
            <label className='block mb-[10px] text-base'>Workout Type</label>
            <div className='space-y-[14px]'>{['gym', 'home'].map((v) => {
              const active = form.workout_preference === v;
              return <button type='button' key={v} onClick={() => setForm({ ...form, workout_preference: v })} className={`w-full text-left rounded-2xl p-4 min-h-14 transition ${active ? selectedCard : idleCard}`}>
                <div className='flex items-center justify-between'><span className='text-lg'>{v === 'gym' ? 'Gym Workout' : 'Home Workout'}</span>{active && <span className='text-lg font-bold'>✓</span>}</div>
              </button>;
            })}</div>
          </div>

          <button type='button' disabled={isLoading} className='generate-cta w-full h-14 text-lg font-semibold mt-6 disabled:opacity-60' onClick={generatePlan}>Create My Fitness Plan</button>
          {error && <div className='mt-4 rounded-2xl border border-rose-300/40 bg-rose-500/10 p-4 text-left'>
            <p className='text-base font-semibold text-rose-100'>Unable to create your plan right now.</p>
            <p className='text-sm text-rose-200 mt-1'>Server connection issue detected. Please retry in a few seconds.</p>
          </div>}
        </div>
      </section>}

      {isLoading && <section className='bg-[#1e3a8a] rounded-2xl p-6 mt-6 text-center max-w-[420px] mx-auto'>
        <div className='scan-loader mx-auto mb-4' />
        <p className='text-lg font-semibold'>Analyzing your profile…</p>
        <p className='text-zinc-200 text-sm mt-2'>Preparing workouts, nutrition, and recovery guidance...</p>
        <div className='mt-4 h-2 w-full bg-white/20 rounded-full overflow-hidden'><div className='h-full bg-gradient-to-r from-cyan-300 to-violet-300' style={{ width: `${progress}%` }} /></div>
      </section>}

      {result && <Dashboard data={result} payload={submittedPayload || form} workoutPreference={form.workout_preference} />}
    </div>
  </div>;
}
