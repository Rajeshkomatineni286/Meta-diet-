import { motion } from 'framer-motion';

export function BMIGauge({ bmi = 22.4 }) {
  const min = 12, max = 40;
  const pct = Math.min(1, Math.max(0, (bmi - min) / (max - min)));
  const circumference = 2 * Math.PI * 74;
  const offset = circumference * (1 - pct);
  return (
    <div className="glass panel p-5">
      <p className="label">BMI CORE</p>
      <div className="relative w-44 h-44 mx-auto mt-4">
        <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
          <circle cx="90" cy="90" r="74" stroke="rgba(255,255,255,0.1)" strokeWidth="14" fill="none" />
          <motion.circle cx="90" cy="90" r="74" stroke="url(#g)" strokeWidth="14" fill="none" strokeLinecap="round"
            strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.4 }} />
          <defs><linearGradient id="g"><stop stopColor="#22d3ee"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-semibold glow-cyan">{bmi}</span>
          <span className="text-xs text-zinc-400">System Index</span>
        </div>
      </div>
    </div>
  );
}
