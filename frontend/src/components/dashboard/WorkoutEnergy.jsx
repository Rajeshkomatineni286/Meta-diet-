import { motion } from 'framer-motion';

export function WorkoutEnergy({ blocks = [] }) {
  return <motion.div whileHover={{ y: -2 }} className="glass panel p-5 md:p-6">
    <p className="label">ENERGY WORKOUT MATRIX</p>
    <div className="mt-5 space-y-4">
      {blocks.map((b, i) => (
        <div key={b}>
          <div className="text-zinc-200 text-sm md:text-base mb-1.5">{b}</div>
          <motion.div initial={{ width: 0 }} animate={{ width: `${65 + i * 10}%` }} transition={{ delay: i * 0.14, duration: .7 }} className="h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_14px_#a855f7]" />
        </div>
      ))}
    </div>
  </motion.div>
}
