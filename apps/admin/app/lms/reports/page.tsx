import React from 'react';

export default function Reports() {
  const reportMetrics = [
    { title: 'Total Enrollments', value: '3,847', change: '+12.5%', trend: 'up' },
    { title: 'Avg. Completion Rate', value: '74.2%', change: '+3.8%', trend: 'up' },
    { title: 'Certificate Completion', value: '156', change: '+8.2%', trend: 'up' },
    { title: 'Revenue Attribution', value: '$124.5K', change: '+15.3%', trend: 'up' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
          <p className="text-slate-400">Analytics and performance metrics</p>
        </div>
      </div>

      <div className="mb-6 bg-card border border-slate-800 rounded-xl p-4">
        <div className="flex gap-4 items-center">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                defaultValue="2024-04-04"
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-gold transition-colors text-sm"
              />
              <span className="text-slate-400 py-2">to</span>
              <input
                type="date"
                defaultValue="2024-04-11"
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-gold transition-colors text-sm"
              />
            </div>
          </div>
          <button className="self-end px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors text-sm">
            Apply Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {reportMetrics.map((metric) => (
          <div key={metric.title} className="bg-card border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">{metric.title}</span>
              <span className={`text-xs font-semibold ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {metric.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gold">{metric.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Enrollment Trends</h2>
          <div className="h-64 flex items-center justify-center bg-slate-900 rounded-lg border border-slate-800">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-slate-400 text-sm">Chart placeholder - Enrollment trend data</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Course Completion Rates</h2>
          <div className="h-64 flex items-center justify-center bg-slate-900 rounded-lg border border-slate-800">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-slate-400 text-sm">Chart placeholder - Completion rate data</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quiz Performance</h2>
          <div className="h-64 flex items-center justify-center bg-slate-900 rounded-lg border border-slate-800">
            <div className="text-center">
              <div className="text-4xl mb-2">❓</div>
              <p className="text-slate-400 text-sm">Chart placeholder - Quiz performance data</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Revenue Attribution</h2>
          <div className="h-64 flex items-center justify-center bg-slate-900 rounded-lg border border-slate-800">
            <div className="text-center">
              <div className="text-4xl mb-2">💰</div>
              <p className="text-slate-400 text-sm">Chart placeholder - Revenue attribution data</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Top Performing Courses</h2>
        <div className="space-y-3">
          {[
            { name: 'Obedience Training Basics', students: 142, completion: '82%', rating: '4.8' },
            { name: 'Advanced Agility', students: 87, completion: '76%', rating: '4.7' },
            { name: 'Service Dog Training', students: 56, completion: '88%', rating: '4.9' },
            { name: 'Behavior Modification', students: 34, completion: '71%', rating: '4.5' },
          ].map((course, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{course.name}</p>
                <p className="text-slate-400 text-xs mt-1">{course.students} students enrolled</p>
              </div>
              <div className="flex gap-6 text-right">
                <div>
                  <div className="text-slate-400 text-xs">Completion</div>
                  <div className="text-white font-semibold">{course.completion}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs">Rating</div>
                  <div className="text-gold font-semibold">{course.rating}★</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
