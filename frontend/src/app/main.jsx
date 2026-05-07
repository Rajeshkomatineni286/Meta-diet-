import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/index.css';

const steps = ['Height + Weight', 'Goal', 'Diet Type', 'Workout Preference', 'Review & Payment'];

function Card({ title, children }) {
  return <motion.section initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className='glass premium-card rounded-[24px] p-5 mb-5'><h3 className='text-[18px] font-semibold mb-3'>{title}</h3>{children}</motion.section>;
}

function App() {
  const [screen, setScreen] = useState('splash');
  const [tab, setTab] = useState('home');
  const [otp, setOtp] = useState(['','','','','','']);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({height_feet:5,height_inches:8,weight_kg:72,goal_mode:'cut',diet_preference:'veg',workout_preference:'gym'});

  const loadingText = useMemo(() => ['Analyzing body metrics','Calculating nutrition','Building weekly split','Optimizing recovery','Preparing transformation strategy'], []);

  React.useEffect(() => {
    if (screen === 'splash') {
      const t = setTimeout(() => setScreen('login'), 2000);
      return () => clearTimeout(t);
    }
  }, [screen]);

  const completePaymentAndGenerate = () => {
    setLoading(true); setScreen('loading');
    setTimeout(() => { setLoading(false); setScreen('plan'); }, 5200);
  };

  return <div className='max-w-[420px] mx-auto min-h-screen bg-black text-white overflow-x-hidden px-4 pt-5 pb-[120px]'>
    <AnimatePresence mode='wait'>
      {screen === 'splash' && <motion.div key='splash' initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} className='min-h-[80vh] grid place-items-center text-center'>
        <div><p className='text-3xl font-extrabold tracking-wide'>METADIET</p><p className='text-zinc-300 mt-2'>Precision Fitness Coaching</p></div>
      </motion.div>}

      {screen === 'login' && <motion.div key='login' initial={{opacity:0}} animate={{opacity:1}}>
        <Card title='Welcome Back'><p className='text-sm text-zinc-300 mb-4'>Access your transformation dashboard.</p><input className='premium-input h-[58px] text-lg' placeholder='+91 Mobile Number'/><button className='generate-cta w-full h-[58px] mt-4' onClick={() => setScreen('otp')}>Continue</button></Card>
      </motion.div>}

      {screen === 'otp' && <motion.div key='otp' initial={{opacity:0}} animate={{opacity:1}}>
        <Card title='Verify Your Number'><div className='grid grid-cols-6 gap-2'>{otp.map((v,i)=><input key={i} value={v} onChange={e=>{const n=[...otp];n[i]=e.target.value.slice(-1);setOtp(n);}} className='premium-input h-12 text-center text-lg'/>)}</div><button className='generate-cta w-full h-[58px] mt-4' onClick={() => setScreen('home')}>Verify OTP</button></Card>
      </motion.div>}

      {screen === 'home' && <motion.div key='home' initial={{opacity:0}} animate={{opacity:1}}>
        <p className='text-[34px] leading-[1.05] font-extrabold mt-2 mb-3 max-w-[320px]'>Built Around Your Transformation</p>
        <p className='text-[15px] leading-[1.8] opacity-80 mb-8'>Training, nutrition, recovery, and physique planning personalized for your goals.</p>
        <button className='generate-cta w-full h-[58px] mb-8' onClick={() => setScreen('assessment')}>Start Assessment</button>
      </motion.div>}

      {screen === 'assessment' && <motion.div key='assess' initial={{opacity:0}} animate={{opacity:1}}>
        <Card title={`Step ${step+1} of 5 — ${steps[step]}`}>
          {step===0 && <div className='space-y-3'><input className='premium-input h-[58px]' value={form.height_feet} onChange={e=>setForm({...form,height_feet:Number(e.target.value)})}/><input className='premium-input h-[58px]' value={form.height_inches} onChange={e=>setForm({...form,height_inches:Number(e.target.value)})}/><input className='premium-input h-[58px]' value={form.weight_kg} onChange={e=>setForm({...form,weight_kg:Number(e.target.value)})}/></div>}
          {step===1 && <div className='space-y-4'>{[['cut','Fat Loss'],['bulk','Muscle Building'],['maintain','Athletic Fitness']].map(([k,t])=><button key={k} onClick={()=>setForm({...form,goal_mode:k})} className={`w-full text-left rounded-2xl p-4 border ${form.goal_mode===k?'border-cyan-300 bg-cyan-200/10':'border-white/20'}`}>{t}</button>)}</div>}
          {step===2 && <div className='grid grid-cols-3 gap-2'>{['veg','non_veg','eggetarian'].map(v=><button key={v} onClick={()=>setForm({...form,diet_preference:v})} className={`segment-pill ${form.diet_preference===v?'segment-pill-active':''}`}>{v}</button>)}</div>}
          {step===3 && <div className='space-y-3'><button onClick={()=>setForm({...form,workout_preference:'gym'})} className={`w-full text-left rounded-2xl p-4 border ${form.workout_preference==='gym'?'border-cyan-300 bg-cyan-200/10':'border-white/20'}`}>Gym Training</button><button onClick={()=>setForm({...form,workout_preference:'home'})} className={`w-full text-left rounded-2xl p-4 border ${form.workout_preference==='home'?'border-cyan-300 bg-cyan-200/10':'border-white/20'}`}>Home Training</button></div>}
          {step===4 && <div className='text-sm text-zinc-300'>Plan Includes: Weekly training split, meal strategy, hydration targets, recovery strategy and downloadable PDF.<button className='generate-cta w-full h-[58px] mt-4' onClick={completePaymentAndGenerate}>Pay ₹50 & Continue</button></div>}
          {step<4 && <button className='generate-cta w-full h-[58px] mt-4' onClick={()=>setStep(step+1)}>Continue</button>}
        </Card>
      </motion.div>}

      {screen === 'loading' && <motion.div key='loading' initial={{opacity:0}} animate={{opacity:1}} className='mt-20 text-center'>
        <div className='scan-loader mx-auto mb-5'/>
        {loadingText.map((t,i)=><p key={t} className='text-sm text-zinc-300 mt-2'>{t}</p>)}
      </motion.div>}

      {screen === 'plan' && <motion.div key='plan' initial={{opacity:0}} animate={{opacity:1}}>
        <Card title='Summary Card'><p>Goal: {form.goal_mode}</p></Card>
        <Card title='Transformation Timeline'><p className='text-sm'>Week 2, Week 4, Week 8, Week 12 milestones.</p></Card>
        <Card title='Nutrition Targets'><p className='text-sm'>Calories, Protein, Carbs, Fats.</p></Card>
        <Card title='Hydration & Recovery'><p className='text-sm'>Water, sleep, recovery recommendations.</p></Card>
        <button className='generate-cta w-full h-[58px]'>Download My Plan PDF</button>
      </motion.div>}
    </AnimatePresence>

    {screen !== 'splash' && screen !== 'login' && screen !== 'otp' && (
      <nav className='fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] h-[72px] bg-black/70 backdrop-blur border-t border-white/10 grid grid-cols-3 text-center'>
        {['home','plans','profile'].map(t=><button key={t} onClick={()=>setTab(t)} className={`text-sm ${tab===t?'text-cyan-300':'text-zinc-400'}`}>{t==='home'?'🏠 Home':t==='plans'?'📋 My Plans':'👤 Profile'}</button>)}
      </nav>
    )}
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
