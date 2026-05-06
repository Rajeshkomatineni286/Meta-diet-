import { motion } from 'framer-motion';

const Card = ({ title, children, className = '' }) => (
  <motion.section
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45 }}
    className={`glass premium-card p-5 md:p-6 ${className}`}
  >
    <p className="label">{title}</p>
    <div className="mt-3">{children}</div>
  </motion.section>
);

const recoveryLabel = (score = 0) => score >= 80 ? 'Excellent' : score >= 65 ? 'Moderate' : 'Low';

export function Dashboard({ data }) {
  const core = data?.body_core || {};
  const nutrition = data?.nutrition_matrix || {};
  const metabolism = data?.metabolism_engine || {};
  const recovery = data?.recovery_intelligence || {};
  const timeline = data?.timeline || [];
  const actions = (data?.recommendations || []).slice(0, 3);

  return (
    <div className="mt-8 space-y-4 md:space-y-5">
      <Card title="Body Score" className="relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />
        <div className="flex items-center gap-5">
          <div className="score-ring">
            <div className="score-ring-inner">
              <div className="text-3xl font-semibold">{core.optimization_score ?? '--'}</div>
            </div>
          </div>
          <div>
            <p className="text-zinc-100 text-lg md:text-xl font-medium">{core.goal_mode ? `${core.goal_mode.toUpperCase()} protocol active` : 'Body optimization active'}</p>
            <p className="text-zinc-400 text-sm mt-1">Your body is responding to this strategy. Keep daily consistency to compound progress.</p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4 md:gap-5">
        <Card title="Daily Calorie Target">
          <p className="metric-main">{nutrition.calories ?? '--'} kcal</p>
          <p className="metric-sub">Calculated for your current goal and metabolic profile.</p>
        </Card>
        <Card title="Protein Target">
          <p className="metric-main">{nutrition.protein_g ?? '--'} g</p>
          <p className="metric-sub">Supports satiety, muscle preservation, and recovery quality.</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4 md:gap-5">
        <Card title="Recovery Status">
          <p className="metric-main">{recoveryLabel(recovery.recovery_score)} <span className="text-base text-zinc-400">({recovery.recovery_score ?? '--'})</span></p>
          <p className="metric-sub">Hydration target: {recovery.hydration_liters ?? '--'}L. Prioritize sleep regularity tonight.</p>
        </Card>
        <Card title="Metabolic State">
          <p className="metric-main">{metabolism.classification?.replace('-', ' ') || '--'}</p>
          <p className="metric-sub">Your engine is tuned for sustainable progress, not short-term spikes.</p>
        </Card>
      </div>

      <Card title="Daily Actions">
        <ul className="space-y-2">
          {actions.map((a, i) => <li key={a} className="text-zinc-200 text-sm md:text-base flex gap-2"><span className="text-cyan-300">{i + 1}.</span>{a}</li>)}
        </ul>
      </Card>

      <Card title="Daily Timeline">
        <div className="space-y-3">
          {timeline.map((item) => (
            <div key={item.time} className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-cyan-300" />
              <div>
                <p className="text-zinc-100 text-sm md:text-base"><span className="text-cyan-300 mr-2">{item.time}</span>{item.title}</p>
                <p className="text-zinc-500 text-xs md:text-sm">{item.focus}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
