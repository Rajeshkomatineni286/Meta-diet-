import { motion } from 'framer-motion';

const Tile = ({label, value, unit, color}) => (
  <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ type: 'spring', stiffness: 240, damping: 18 }} className="glass panel p-5 md:p-6 group">
    <p className="label">{label}</p>
    <p className={`text-3xl md:text-4xl font-semibold mt-3 tracking-tight ${color} group-hover:scale-[1.01] origin-left transition-transform`}>{value}<span className="text-sm text-zinc-400 ml-1">{unit}</span></p>
  </motion.div>
);

export function MetricsPanel({ calories, protein, fat }) {
  return <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
    <Tile label="CALORIES" value={calories} unit="kcal" color="glow-cyan"/>
    <Tile label="PROTEIN" value={protein} unit="g" color="glow-purple"/>
    <Tile label="FAT" value={fat} unit="g" color="text-fuchsia-300"/>
  </div>
}
