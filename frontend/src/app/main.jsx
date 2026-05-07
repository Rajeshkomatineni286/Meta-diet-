import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/index.css';
import { requestOtp } from '../lib/firebase';

function Toast({ text }) { return text ? <div className='fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/85 border border-white/15 rounded-xl px-4 py-2 text-sm z-50'>{text}</div> : null; }
function Card({ title, sub, children }) { return <motion.section initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-[28px] p-7'><h2 className='text-[32px] font-bold leading-tight'>{title}</h2><p className='text-zinc-300 mt-2 text-sm'>{sub}</p><div className='mt-5'>{children}</div></motion.section>; }

function App() {
  const [screen, setScreen] = useState('splash');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['','','','','','']);
  const otpRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [resend, setResend] = useState(30);

  useEffect(() => { if (screen==='splash') { const t=setTimeout(()=>setScreen('login'),2000); return ()=>clearTimeout(t);} }, [screen]);
  useEffect(() => { if (screen !== 'otp' || resend <= 0) return; const t = setTimeout(()=>setResend(resend-1),1000); return ()=>clearTimeout(t); }, [screen, resend]);
  const otpCode = useMemo(() => otp.join(''), [otp]);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(''),2500); };

  const sendOtp = async () => {
    if (!/^\d{10}$/.test(phone)) return showToast('Enter a valid 10-digit number');
    setLoading(true);
    try { await requestOtp(phone); setScreen('otp'); setResend(30); showToast('OTP sent successfully'); }
    catch (e) { console.error(e); showToast('OTP send failed. Check Firebase domains.'); }
    finally { setLoading(false); }
  };

  const verifyOtp = async (code = otpCode) => {
    if (code.length !== 6 || loading) return;
    setLoading(true);
    try { await window.confirmationResult.confirm(code); showToast('Login successful'); setTimeout(()=>setScreen('home'),500); }
    catch (e) { console.error(e); showToast('Invalid or expired OTP'); }
    finally { setLoading(false); }
  };

  const onOtpChange = (i, val) => {
    const digit = val.replace(/\D/g,'').slice(-1);
    const next = [...otp]; next[i] = digit; setOtp(next);
    if (digit && i < 5) otpRefs.current[i+1]?.focus();
    if (next.join('').length === 6) verifyOtp(next.join(''));
  };

  const onOtpKey = (i, e) => { if (e.key === 'Backspace' && !otp[i] && i>0) otpRefs.current[i-1]?.focus(); };

  return <div className='max-w-[420px] mx-auto min-h-screen px-6 flex flex-col justify-center bg-[linear-gradient(180deg,#050816_0%,#0f172a_45%,#111827_100%)] text-white'>
    <div id='recaptcha-container' />
    <AnimatePresence mode='wait'>
      {screen==='splash' && <motion.div key='s' initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} className='text-center'><p className='text-3xl font-extrabold'>METADIET</p><p className='text-zinc-300 mt-2'>Precision Fitness Coaching</p></motion.div>}
      {screen==='login' && <div key='l'><Card title='Welcome Back' sub='Continue your transformation journey.'><div className='flex items-center gap-2'><span className='h-[58px] px-4 grid place-items-center rounded-[18px] bg-white/5 border border-white/10'>+91</span><input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,''))} className='premium-input h-[58px] text-lg' placeholder='Mobile Number'/></div><button disabled={loading} onClick={sendOtp} className='generate-cta w-full h-[58px] rounded-[18px] mt-4 font-bold'>{loading?'Sending...':'Continue'}</button></Card></div>}
      {screen==='otp' && <div key='o'><Card title='Verify Your Number' sub={`Enter the 6-digit code sent to +91 ${phone}.`}><div className='flex justify-between gap-2'>{otp.map((v,i)=><input key={i} ref={el=>otpRefs.current[i]=el} value={v} disabled={loading} onChange={e=>onOtpChange(i,e.target.value)} onKeyDown={e=>onOtpKey(i,e)} className='w-12 h-[58px] rounded-2xl bg-white/5 border border-white/10 text-center text-2xl' />)}</div><button disabled={loading || otpCode.length!==6} onClick={()=>verifyOtp()} className='generate-cta w-full h-[58px] rounded-[18px] mt-4 font-bold'>{loading?'Verifying...':'Verify OTP'}</button><p className='text-sm text-zinc-300 mt-3 text-center'>{resend>0?`Resend OTP in ${resend}s`:<button onClick={sendOtp} className='text-cyan-300'>Resend OTP</button>}</p></Card></div>}
      {screen==='home' && <div key='h' className='text-center'><motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}><p className='text-2xl font-semibold'>Welcome back</p><p className='text-zinc-300 mt-2'>Redirecting to dashboard...</p></motion.div></div>}
    </AnimatePresence>
    <Toast text={toast} />
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
