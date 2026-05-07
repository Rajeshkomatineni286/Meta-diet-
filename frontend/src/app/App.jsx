import { useRef, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { sendOtpCode } from '../lib/firebase';

function Login() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const send = async () => {
    if (!/^\d{10}$/.test(phone)) return toast.error('Enter valid mobile number');
    setLoading(true);
    try {
      await sendOtpCode(phone);
      toast.success('OTP sent');
      navigate(`/otp/${phone}`);
    } catch (e) {
      console.error(e);
      toast.error('OTP send failed');
    } finally { setLoading(false); }
  };

  return <div className='max-w-[420px] mx-auto min-h-screen p-6 bg-black text-white flex flex-col justify-center'>
    <div id='recaptcha-container' />
    <div className='bg-white/5 border border-white/10 rounded-3xl p-7'>
      <h1 className='text-3xl font-bold'>Welcome Back</h1>
      <p className='text-zinc-300 mt-2'>Continue your transformation journey.</p>
      <div className='mt-5 flex gap-2'><span className='h-[58px] px-4 rounded-[18px] bg-white/5 grid place-items-center border border-white/10'>+91</span><input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,''))} className='premium-input h-[58px] text-lg' /></div>
      <button onClick={send} disabled={loading} className='generate-cta w-full h-[58px] rounded-[18px] mt-4'>{loading?'Sending...':'Continue'}</button>
    </div>
  </div>;
}

function Otp() {
  const [otp, setOtp] = useState(['','','','','','']);
  const refs = useRef([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const verify = async (code) => {
    if (code.length !== 6 || loading) return;
    setLoading(true);
    try {
      await window.confirmationResult.confirm(code);
      toast.success('Login successful');
      navigate('/home');
    } catch (e) {
      console.error(e);
      toast.error('Invalid OTP');
    } finally { setLoading(false); }
  };

  return <div className='max-w-[420px] mx-auto min-h-screen p-6 bg-black text-white flex flex-col justify-center'>
    <div className='bg-white/5 border border-white/10 rounded-3xl p-7'>
      <h1 className='text-3xl font-bold'>Verify Your Number</h1>
      <p className='text-zinc-300 mt-2'>Enter the 6-digit code sent to your mobile number.</p>
      <div className='mt-5 flex justify-between gap-2'>{otp.map((v,i)=><input key={i} ref={el=>refs.current[i]=el} value={v} onKeyDown={(e)=>{if(e.key==='Backspace'&&!otp[i]&&i>0)refs.current[i-1]?.focus();}} onChange={e=>{const d=e.target.value.replace(/\D/g,'').slice(-1); const n=[...otp]; n[i]=d; setOtp(n); if(d&&i<5) refs.current[i+1]?.focus(); const code=n.join(''); if(code.length===6) verify(code);}} className='w-12 h-[58px] rounded-2xl bg-white/5 border border-white/10 text-center text-2xl' />)}</div>
      <button onClick={()=>verify(otp.join(''))} disabled={loading || otp.join('').length!==6} className='generate-cta w-full h-[58px] rounded-[18px] mt-4'>{loading?'Verifying...':'Verify OTP'}</button>
    </div>
  </div>;
}

function Home() { return <div className='max-w-[420px] mx-auto min-h-screen p-6 bg-black text-white'>METADIET WORKING</div>; }

export default function App() {
  return <Routes>
    <Route path='/' element={<Navigate to='/login' replace />} />
    <Route path='/login' element={<Login />} />
    <Route path='/otp/:phone' element={<Otp />} />
    <Route path='/home' element={<Home />} />
  </Routes>;
}
