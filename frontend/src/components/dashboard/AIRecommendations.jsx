export function AIRecommendations({ goal = 'rebuild' }) {
  const tips = {
    cut: ['Increase NEAT steps to 10k/day', 'Prioritize lean protein each meal', 'Use low-volume high-intensity training'],
    bulk: ['Add +300 kcal quality surplus', 'Track weekly bodyweight trend', 'Progressive overload 4x/week'],
    rebuild: ['Balance strength + conditioning', 'Target 7.5h sleep recovery', 'Protein distribution every 4 hours']
  };
  return <div className="glass panel p-5 md:p-6">
    <p className="label">AI RECOMMENDATIONS</p>
    <ul className="mt-4 space-y-2 text-sm md:text-base text-zinc-200">
      {tips[goal].map((t) => <li key={t} className="flex gap-2"><span className="text-cyan-300">▸</span><span>{t}</span></li>)}
    </ul>
  </div>
}
