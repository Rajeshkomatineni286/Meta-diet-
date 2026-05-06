import { useRef, useState } from 'react';
import api from '../../lib/api';
import { Dashboard } from '../dashboard/Dashboard';
import { NeuralBackground } from '../dashboard/NeuralBackground';

const initialForm = {
  weight_kg: 72,
  goal_mode: 'cut',
  diet_preference: 'veg',
  workout_preference: 'gym',
};

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
    console.log('BUTTON CLICKED');
    setResult(null);
    setError('');
    setShowOnboarding(true);
    setTimeout(() => onboardingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const validateForm = () => {
    if (!heightFeet || !heightInches) {
      setError('Please select both height fields (feet and inches).');
      return false;
    }
    if (!form.weight_kg || Number(form.weight_kg) <= 0) {
      setError('Please enter a valid weight in kg.');
      return false;
    }
    return true;
  };

  const generatePlan = async () => {
    if (!validateForm()) return;

    setError('');
    setIsLoading(true);
    setProgress(5);

    let p = 5;
    const timer = setInterval(() => {
      p = Math.min(95, p + 8);
      setProgress(p);
    }, 220);

    try {
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
      const res = await api.post('/plans/scan/', payload);
      clearInterval(timer);
      setProgress(100);
      setTimeout(() => {
        setResult(res.data);
        setIsLoading(false);
      }, 220);
    } catch (err) {
      clearInterval(timer);
      setIsLoading(false);
      const backendMessage = err?.response?.data?.detail || err?.response?.data?.message || err?.response?.data?.error || (typeof err?.response?.data === 'string' ? err.response.data : null);
      setError(backendMessage || 'API unreachable. Please check your connection and try again.');
    }
  };

  return (
    <div className='min-h-screen bg-[#050505] text-white relative'>
      <NeuralBackground />

      <div className='relative z-10 max-w-4xl mx-auto px-4 py-6 sm:py-10'>
        <section className='bg-[#111827] rounded-2xl p-5 sm:p-8'>
          <p className='coach-label'>METADIET AI</p>
          <h1 className='hero-title'>Upgrade Your Body Like Software.</h1>
          <p className='coach-subtitle'>Your AI coach builds a personalized fat-loss, muscle-building, and nutrition system designed specifically for your body.</p>
          <div className='relative z-50 mt-5'>
            <button type='button' onClick={openOnboarding} className='generate-cta w-full sm:w-auto px-8'>
              Start AI Body Scan
            </button>
          </div>
        </section>

        {showOnboarding && !isLoading && !result && (
          <section ref={onboardingRef} className='bg-[#14532d] rounded-2xl p-5 sm:p-6 mt-6'>
            <p className='field-label text-white'>Body Scan Setup</p>
            <div className='grid sm:grid-cols-2 gap-3 mt-3'>
              <select className='premium-input min-h-12 text-base' value={heightFeet} onChange={(e) => setHeightFeet(e.target.value)}>
                <option value=''>Feet</option>
                {[4, 5, 6, 7, 8].map((v) => <option key={v} value={String(v)}>{v} ft</option>)}
              </select>
              <select className='premium-input min-h-12 text-base' value={heightInches} onChange={(e) => setHeightInches(e.target.value)}>
                <option value=''>Inches</option>
                {Array.from({ length: 12 }, (_, i) => i).map((v) => <option key={v} value={String(v)}>{v} in</option>)}
              </select>
              <div className='relative sm:col-span-2'><input className='premium-input pr-10 min-h-12 text-base' type='number' value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: Number(e.target.value) })} /><span className='suffix'>kg</span></div>
            </div>
            <div className='mt-4 grid sm:grid-cols-3 gap-2'>{[['cut', 'Fat Loss'], ['bulk', 'Muscle Gain'], ['maintain', 'Maintain']].map(([v, t]) => <button type='button' key={v} onClick={() => setForm({ ...form, goal_mode: v })} className={`segment-pill ${form.goal_mode === v ? 'segment-pill-active' : ''}`}>{t}</button>)}</div>
            <div className='mt-3 grid sm:grid-cols-3 gap-2'>{['veg', 'non_veg', 'eggetarian'].map((v) => <button type='button' key={v} onClick={() => setForm({ ...form, diet_preference: v })} className={`segment-pill ${form.diet_preference === v ? 'segment-pill-active' : ''}`}>{v.replace('_', '-')}</button>)}</div>
            <div className='mt-3 grid sm:grid-cols-2 gap-2'><button type='button' onClick={() => setForm({ ...form, workout_preference: 'gym' })} className={`segment-pill ${form.workout_preference === 'gym' ? 'segment-pill-active' : ''}`}>Gym Workout</button><button type='button' onClick={() => setForm({ ...form, workout_preference: 'home' })} className={`segment-pill ${form.workout_preference === 'home' ? 'segment-pill-active' : ''}`}>Home Workout</button></div>
            <button type='button' className='generate-cta w-full mt-6 min-h-12 text-base' onClick={generatePlan}>Generate My AI Plan</button>
            {error && <p className='text-rose-200 text-sm mt-3'>{error}</p>}
          </section>
        )}

        {isLoading && (
          <section className='bg-[#1e3a8a] rounded-2xl p-6 mt-6 text-center'>
            <div className='scan-loader mx-auto mb-4' />
            <p className='text-lg'>Analyzing body profile...</p>
            <p className='text-zinc-200 text-sm mt-2'>Building nutrition system...</p>
            <p className='text-zinc-200 text-sm'>Creating workout engine...</p>
            <p className='text-zinc-200 text-sm'>Finalizing transformation plan...</p>
            <div className='mt-4 h-2 w-full bg-white/20 rounded-full overflow-hidden'><div className='h-full bg-white' style={{ width: `${progress}%` }} /></div>
          </section>
        )}

        {result && <Dashboard data={result} payload={submittedPayload || form} workoutPreference={form.workout_preference} />}
      </div>
    </div>
  );
}
