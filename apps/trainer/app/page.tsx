export default function TrainerDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Trainer Dashboard</h1>
      <p className="text-slate-400 mb-8">Manage your courses, students, and revenue</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'My Courses', value: '0', icon: '📚' },
          { label: 'Students', value: '0', icon: '🎓' },
          { label: 'Revenue', value: '$0', icon: '💰' },
          { label: 'Avg Rating', value: '-', icon: '⭐' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">{stat.label}</span>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <div className="text-2xl font-bold text-gold">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
