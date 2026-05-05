import { motion } from 'framer-motion';
export function LandingPage() {
  return <div className="min-h-screen bg-[#050505] text-white p-10">
    <div className="glass p-10 rounded-3xl">
      <p className="text-cyan-400">Initializing Neural System...</p>
      <h1 className="text-6xl font-bold mt-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Upgrade Your Body Like Software</h1>
      <button className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 shadow-[0_0_30px_#00E5FF]">Initialize Your Body System</button>
    </div>
    <motion.div animate={{opacity:[0.5,1,0.5]}} transition={{repeat:Infinity,duration:2}} className="mt-12 grid grid-cols-3 gap-6">
      <div className="glass p-6">Scan → Generate → Optimize</div>
      <div className="glass p-6">Live BMI Neural Gauge</div>
      <div className="glass p-6">Unlock Full System Access</div>
    </motion.div>
  </div>
}
