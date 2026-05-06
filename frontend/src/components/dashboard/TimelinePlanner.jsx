import { motion } from 'framer-motion';

export function TimelinePlanner({ timeline = [] }) {
  return <motion.div whileHover={{ y: -2 }} className="glass panel p-5 md:p-6">
    <p className="label">DIET TIMELINE</p>
    <div className="mt-5 space-y-4">
      {timeline.map((item, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex gap-3 items-start">
          <div className="mt-1.5 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#22d3ee]" />
          <div className="text-zinc-200 text-sm md:text-base leading-relaxed">{item}</div>
        </motion.div>
      ))}
    </div>
  </motion.div>
}
