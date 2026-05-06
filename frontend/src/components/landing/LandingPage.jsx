import { useRef, useState } from 'react';
import api from '../../lib/api';
import { Dashboard } from '../dashboard/Dashboard';
import { NeuralBackground } from '../dashboard/NeuralBackground';

const initialForm = {
  height_feet: 5,
  height_inches: 8,
  weight_kg: 72,
  goal_mode: 'cut',
  experience_level: 'beginner',
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
  const onboardingRef = useRef(null);

  const openOnboarding = () => {
    console.log('BUTTON CLICKED');
    setResult(null);
    setError('');
    setShowOnboarding(true);
    setTimeout(() => onboardingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const validateForm = () => {
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
      const res = await api.post('/plans/scan/', { ...form, weight_kg: Number(form.weight_kg) });
      clearInterval(timer);
      setProgress(100);
      setTimeout(() => {
        setResult(res.data);
        setIsLoading(false);
      }, 220);
    } catch {
      clearInterval(timer);
      setIsLoading(false);
      setError('Unable to generate your AI plan. Please try again.');
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
              <select className='premium-input' value={form.height_feet} onChange={(e) => setForm({ ...form, height_feet: Number(e.target.value) })}>{[4, 5, 6, 7, 8].map((v) => <option key={v}>{v} ft</option>)}</select>
              <select className='premium-input' value={form.height_inches} onChange={(e) => setForm({ ...form, height_inches: Number(e.target.value) })}>{Array.from({ length: 12 }, (_, i) => i).map((v) => <option key={v}>{v} in</option>)}</select>
              <div className='relative sm:col-span-2'><input className='premium-input pr-10' type='number' value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: Number(e.target.value) })} /><span className='suffix'>kg</span></div>
            </div>
            <div className='mt-4 grid sm:grid-cols-3 gap-2'>{[['cut', 'Fat Loss'], ['bulk', 'Muscle Gain'], ['maintain', 'Maintain']].map(([v, t]) => <button type='button' key={v} onClick={() => setForm({ ...form, goal_mode: v })} className={`segment-pill ${form.goal_mode === v ? 'segment-pill-active' : ''}`}>{t}</button>)}</div>
            <div className='mt-3 grid sm:grid-cols-3 gap-2'>{['veg', 'non_veg', 'eggetarian'].map((v) => <button type='button' key={v} onClick={() => setForm({ ...form, diet_preference: v })} className={`segment-pill ${form.diet_preference === v ? 'segment-pill-active' : ''}`}>{v.replace('_', '-')}</button>)}</div>
            <div className='mt-3 grid sm:grid-cols-3 gap-2'>{['beginner', 'intermediate', 'advanced'].map((v) => <button type='button' key={v} onClick={() => setForm({ ...form, experience_level: v === 'advanced' ? 'intermediate' : v })} className={`segment-pill ${form.experience_level === (v === 'advanced' ? 'intermediate' : v) ? 'segment-pill-active' : ''}`}>{v}</button>)}</div>
            <div className='mt-3 grid sm:grid-cols-2 gap-2'><button type='button' onClick={() => setForm({ ...form, workout_preference: 'gym' })} className={`segment-pill ${form.workout_preference === 'gym' ? 'segment-pill-active' : ''}`}>Gym Workout</button><button type='button' onClick={() => setForm({ ...form, workout_preference: 'home' })} className={`segment-pill ${form.workout_preference === 'home' ? 'segment-pill-active' : ''}`}>Home Workout</button></div>
            <button type='button' className='generate-cta w-full mt-6' onClick={generatePlan}>Generate My AI Plan</button>
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

        {result && <Dashboard data={result} payload={form} workoutPreference={form.workout_preference} />}
      </div>
    </div>
  );
}
