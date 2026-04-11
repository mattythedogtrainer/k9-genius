export default function LMSDashboard() {
  const stats = [
    { label: 'Total Enrollments', value: '0', icon: '📝' },
    { label: 'Active Students', value: '0', icon: '👨‍🎓' },
    { label: 'Course Completions', value: '0', icon: '✅' },
    { label: 'Certifications Issued', value: '0', icon: '🏆' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">LMS Dashboard</h1>
          <p className="text-slate-400">Learning Management System overview and management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">{stat.label}</span>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <div className="text-2xl font-bold text-gold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-2 h-2 bg-gold rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-white">New course enrollment</p>
                <p className="text-xs text-slate-400">Just now</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-2 h-2 bg-gold rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-white">Certificate generated</p>
                <p className="text-xs text-slate-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gold rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-white">Course module published</p>
                <p className="text-xs text-slate-400">5 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors text-sm">
              Create Course
            </button>
            <button className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors text-sm">
              Add Product
            </button>
            <button className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors text-sm">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
