export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
      <p className="text-slate-400 mb-8">K9 Genius platform management</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: '0', icon: '👥' },
          { label: 'Active Today', value: '0', icon: '📈' },
          { label: 'Revenue', value: '$0', icon: '💰' },
          { label: 'Courses', value: '0', icon: '📚' },
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
