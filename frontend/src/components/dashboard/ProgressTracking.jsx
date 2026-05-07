import { motion } from 'framer-motion';

export function ProgressTracking() {
  const metrics = [{k:'Consistency', v:78}, {k:'Recovery', v:66}, {k:'Performance', v:83}];
  return <div className="glass panel p-5 md:p-6">
    <p className="label">PROGRESS TRACKING</p>
    <div className="mt-4 space-y-3">
      {metrics.map((m, i) => <div key={m.k}>
        <div className="flex justify-between text-sm text-zinc-300 mb-1"><span>{m.k}</span><span>{m.v}%</span></div>
        <motion.div initial={{width:0}} animate={{width:`${m.v}%`}} transition={{delay:i*0.1,duration:.65}} className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400" />
      </div>)}
    </div>
  </div>
}
