import { motion } from 'framer-motion';

const Section = ({ title, children }) => (
  <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="glass panel p-4 md:p-5">
    <p className="label">{title}</p>
    <div className="mt-3">{children}</div>
  </motion.div>
);

export function Dashboard({ data }) {
  const core = data?.body_core || {};
  const nutrition = data?.nutrition_matrix || {};
  const metabolism = data?.metabolism_engine || {};
  const recovery = data?.recovery_intelligence || {};
  const perf = data?.performance_signals || {};
  const timeline = data?.timeline || [];
  const recs = data?.recommendations || [];

  const metrics = [
    ['BMI', core.bmi], ['Body Score', core.optimization_score], ['Calories', nutrition.calories], ['Protein', nutrition.protein_g],
    ['Carbs', nutrition.carb_g], ['Fat', nutrition.fat_g], ['Recovery', recovery.recovery_score], ['Performance', perf.performance_score]
  ];

  return <section className="mt-8 grid lg:grid-cols-12 gap-4 md:gap-5">
    <div className="lg:col-span-4 space-y-4">
      <Section title="Body Core">
        <div className="text-4xl font-semibold glow-cyan">{core.bmi ?? '--'}</div>
        <div className="text-sm text-zinc-300 mt-1">BMI • Score {core.bmi_score ?? '--'}</div>
      </Section>
      <Section title="Metabolism Engine"><p className="text-zinc-200">{metabolism.classification || '--'}</p></Section>
      <Section title="Recovery Intelligence"><p className="text-zinc-200">Recovery {recovery.recovery_score ?? '--'} • Hydration {recovery.hydration_liters ?? '--'}L</p></Section>
    </div>
    <div className="lg:col-span-8 space-y-4">
      <Section title="Nutrition Matrix">
        <div className="grid sm:grid-cols-2 gap-3">{metrics.map(([k,v]) => <div key={k} className="bg-white/5 rounded-xl p-3"><p className="text-xs text-zinc-400">{k}</p><p className="text-xl mt-1">{v ?? '--'}</p></div>)}</div>
      </Section>
      <div className="grid md:grid-cols-2 gap-4">
        <Section title="Daily Timeline">{timeline.map((i)=> <div key={i.time} className="mb-2 text-sm"><span className="text-cyan-300">{i.time}</span> {i.title}</div>)}</Section>
        <Section title="AI Recommendations">{recs.map((r)=> <div key={r} className="mb-2 text-sm">• {r}</div>)}</Section>
      </div>
      <Section title="Optimization Insights"><p className="text-zinc-200">{data?.optimization_insights?.primary}</p><p className="text-zinc-400 text-sm mt-1">{data?.optimization_insights?.secondary}</p></Section>
    </div>
  </section>
}
