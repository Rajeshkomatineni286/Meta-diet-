import { motion } from 'framer-motion';
import { BMIGauge } from './BMIGauge';
import { MetricsPanel } from './MetricsPanel';
import { TimelinePlanner } from './TimelinePlanner';
import { WorkoutEnergy } from './WorkoutEnergy';
import { MetabolismStatus } from './MetabolismStatus';
import { AIRecommendations } from './AIRecommendations';
import { ProgressTracking } from './ProgressTracking';

const v = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: .55, ease: 'easeOut', staggerChildren: .08 } } };

export function Dashboard({ data, goalMode='rebuild' }) {
  const timeline = data?.preview?.diet_timeline?.length ? data.preview.diet_timeline : ['No nutrition timeline yet'];
  const blocks = data?.preview?.workout_blocks?.length ? data.preview.workout_blocks : ['No workout blocks yet'];
  const bmi = data?.bmi || 22.4;
  return <motion.section variants={v} initial="hidden" animate="show" className="mt-8 max-w-6xl mx-auto grid lg:grid-cols-12 gap-4 md:gap-5" aria-label="Body Core System Dashboard">
    <motion.div variants={v} className="lg:col-span-4 space-y-4 md:space-y-5">
      <BMIGauge bmi={bmi} />
      <MetabolismStatus bmi={bmi} />
    </motion.div>
    <motion.div variants={v} className="lg:col-span-8 space-y-4 md:space-y-5">
      <MetricsPanel calories={2280} protein={140} fat={70} />
      <div className="grid md:grid-cols-2 gap-4 md:gap-5">
        <TimelinePlanner timeline={timeline} />
        <WorkoutEnergy blocks={blocks} />
        <AIRecommendations goal={goalMode} />
        <ProgressTracking />
      </div>
    </motion.div>
  </motion.section>
}
