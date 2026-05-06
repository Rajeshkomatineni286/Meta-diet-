import { motion } from 'framer-motion';

export function MetabolismStatus({ bmi = 22.4 }) {
  const state = bmi < 18.5 ? 'Recovery Mode' : bmi > 25 ? 'Cut Optimization' : 'Prime Balance';
  return <motion.div whileHover={{ y: -2 }} className="glass panel p-5 md:p-6">
    <p className="label">METABOLISM STATUS</p>
    <div className="mt-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-zinc-300 text-sm">System State</p>
        <p className="text-xl font-semibold glow-purple">{state}</p>
      </div>
      <div className="pulse-dot" aria-hidden />
    </div>
  </motion.div>
}
