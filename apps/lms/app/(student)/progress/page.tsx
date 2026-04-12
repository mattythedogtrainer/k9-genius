'use client';

export default function ProgressPage() {
  // Stats data
  const stats = [
    {
      label: 'Total Hours',
      value: '48h',
      change: '+12%',
      icon: '⏱️',
      changeType: 'up',
    },
    {
      label: 'Courses Completed',
      value: '2',
      change: 'In Progress',
      icon: '🎓',
      changeType: 'neutral',
    },
    {
      label: 'Current Streak',
      value: '12 days',
      change: 'Keep it up!',
      icon: '🔥',
      changeType: 'neutral',
    },
    {
      label: 'Average Score',
      value: '87%',
      change: 'Excellent',
      icon: '📊',
      changeType: 'up',
    },
  ];

  // Weekly activity data
  const weeklyData = [
    { day: 'Mon', hours: 2.5, abbreviated: 'M' },
    { day: 'Tue', hours: 1.0, abbreviated: 'T' },
    { day: 'Wed', hours: 3.0, abbreviated: 'W' },
    { day: 'Thu', hours: 0.5, abbreviated: 'T' },
    { day: 'Fri', hours: 2.0, abbreviated: 'F' },
    { day: 'Sat', hours: 4.0, abbreviated: 'S' },
    { day: 'Sun', hours: 1.5, abbreviated: 'S' },
  ];

  // Maximum hours for chart scaling
  const maxHours = Math.max(...weeklyData.map(d => d.hours));

  // Course progress data
  const courses = [
    {
      name: 'Canine Behavior Basics',
      progress: 65,
      hoursSpent: 7.8,
      modulesComplete: 4,
      modulesTotal: 6,
      lastActivity: '2 hours ago',
      status: 'in-progress',
    },
    {
      name: 'Advanced Obedience Training',
      progress: 35,
      hoursSpent: 6.3,
      modulesComplete: 3,
      modulesTotal: 8,
      lastActivity: 'yesterday',
      status: 'in-progress',
    },
    {
      name: 'Resource Guarding Protocols',
      progress: 10,
      hoursSpent: 0.8,
      modulesComplete: 1,
      modulesTotal: 4,
      lastActivity: '3 days ago',
      status: 'in-progress',
    },
    {
      name: 'Therapy Dog Certification Prep',
      progress: 100,
      hoursSpent: 12,
      modulesComplete: 6,
      modulesTotal: 6,
      lastActivity: 'completed 2 weeks ago',
      status: 'completed',
    },
  ];

  // Badges data
  const badges = [
    {
      name: 'First Lesson',
      icon: '🐾',
      earned: true,
    },
    {
      name: 'Week Streak',
      icon: '🔥',
      earned: true,
    },
    {
      name: 'Quick Learner',
      icon: '⚡',
      earned: true,
    },
    {
      name: 'Behavior Expert',
      icon: '⭐',
      earned: false,
    },
    {
      name: 'Community Helper',
      icon: '❤️',
      earned: false,
    },
    {
      name: 'Certification Ready',
      icon: '🏆',
      earned: false,
    },
  ];

  // Recent activity data
  const activities = [
    {
      title: 'Completed Lesson: Positive Reinforcement Techniques',
      time: '2 hours ago',
      icon: '✓',
      type: 'completed',
    },
    {
      title: 'Scored 92% on Module 3 Quiz',
      time: 'yesterday',
      icon: '📝',
      type: 'quiz',
    },
    {
      title: 'Started Module: Counter-Conditioning',
      time: 'yesterday',
      icon: '▶️',
      type: 'started',
    },
    {
      title: 'Downloaded: Reactivity Assessment Worksheet',
      time: '3 days ago',
      icon: '📥',
      type: 'download',
    },
    {
      title: 'Earned badge: Quick Learner',
      time: '5 days ago',
      icon: '⭐',
      type: 'badge',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-heading font-bold text-teal-900">
          My Progress
        </h1>
        <p className="text-teal-400 mt-2 font-body text-lg">
          Track your learning journey and achievements.
        </p>
      </div>

      {/* Stats Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <span className="text-4xl">{stat.icon}</span>
              {stat.changeType === 'up' && (
                <span className="inline-block px-2.5 py-1 bg-coral-300 text-coral-700 text-xs font-medium rounded-full">
                  {stat.change}
                </span>
              )}
              {stat.changeType === 'neutral' && (
                <span className="inline-block px-2.5 py-1 bg-teal-400 text-teal-900 text-xs font-medium rounded-full">
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-4xl font-heading font-bold text-teal-900">{stat.value}</p>
            <p className="text-teal-400 font-body text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Two-Column Layout: Main Content + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Charts and Courses (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Activity Chart */}
          <div className="bg-teal-700 rounded-xl shadow-sm p-6 text-white">
            <h2 className="text-xl font-heading font-bold mb-6">Weekly Activity</h2>

            {/* Chart Container */}
            <div className="space-y-6">
              {/* Bars Container */}
              <div className="flex items-end justify-between gap-2 h-40">
                {weeklyData.map((data, index) => {
                  const barHeight = (data.hours / maxHours) * 100;
                  const isToday = index === 5; // Saturday highlighted as "today"

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      {/* Hours Label */}
                      <span className="text-xs font-body opacity-75 h-5">
                        {data.hours.toFixed(1)}h
                      </span>

                      {/* Bar */}
                      <div className="w-full flex items-end justify-center flex-1">
                        <div
                          className={`w-full rounded-t-md transition-all ${
                            isToday ? 'bg-coral-500 hover:bg-coral-300' : 'bg-white/30 hover:bg-white/50'
                          }`}
                          style={{ height: `${barHeight}%`, minHeight: '8px' }}
                        />
                      </div>

                      {/* Day Label */}
                      <span className="text-xs font-body font-medium">{data.abbreviated}</span>
                    </div>
                  );
                })}
              </div>

              {/* Summary Stats */}
              <div className="space-y-1 border-t border-white/20 pt-4">
                <p className="font-medium text-sm font-body">16.5 hours this week</p>
                <p className="text-xs opacity-90 font-body">Keep up the great progress!</p>
              </div>
            </div>
          </div>

          {/* Course Progress Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-bold text-teal-900">Course Progress</h2>

            {courses.map((course, index) => (
              <div key={index} className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
                {/* Course Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-teal-900">{course.name}</h3>
                    <p className="text-sm text-teal-400 font-body mt-1">
                      {course.modulesComplete} of {course.modulesTotal} modules completed
                    </p>
                  </div>
                  {course.status === 'completed' && (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Completed
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-body text-teal-400">{course.progress}%</span>
                    <span className="text-sm font-body text-teal-400">{course.hoursSpent}h spent</span>
                  </div>
                  <div className="w-full bg-cream-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${
                        course.status === 'completed' ? 'bg-green-500' : 'bg-teal-700'
                      }`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                {/* Course Footer */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-teal-400 font-body">
                    Last activity: {course.lastActivity}
                  </p>
                  <button className="px-4 py-2 bg-teal-700 hover:bg-teal-900 text-white font-heading font-medium text-sm rounded-lg transition-colors duration-200">
                    {course.status === 'completed' ? 'Review' : 'Continue'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Achievements & Activity (1/3 width on desktop) */}
        <div className="space-y-6">
          {/* Achievements & Badges Section */}
          <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
            <h2 className="text-xl font-heading font-bold text-teal-900 mb-6">Achievements</h2>

            {/* Badges Grid */}
            <div className="grid grid-cols-3 gap-4">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center rounded-lg p-4 transition-all ${
                    badge.earned
                      ? 'bg-teal-700 text-white'
                      : 'bg-cream-100 text-teal-400 opacity-50'
                  }`}
                >
                  <span className="text-3xl mb-2">{badge.icon}</span>
                  <span className="text-xs font-body text-center font-medium leading-tight">
                    {badge.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Earned Count */}
            <div className="mt-6 pt-4 border-t border-cream-100">
              <p className="text-sm text-teal-400 font-body">
                {badges.filter(b => b.earned).length} of {badges.length} badges earned
              </p>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
            <h2 className="text-lg font-heading font-bold text-teal-900 mb-4">Recent Activity</h2>

            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex gap-3 pb-4 border-b border-cream-100 last:border-b-0 last:pb-0"
                >
                  {/* Activity Icon */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        activity.type === 'completed'
                          ? 'bg-green-100 text-green-600'
                          : activity.type === 'quiz'
                            ? 'bg-blue-100 text-blue-600'
                            : activity.type === 'started'
                              ? 'bg-teal-100 text-teal-600'
                              : activity.type === 'download'
                                ? 'bg-purple-100 text-purple-600'
                                : 'bg-coral-100 text-coral-600'
                      }`}
                    >
                      {activity.icon}
                    </div>
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-teal-900 text-sm">
                      {activity.title}
                    </p>
                    <p className="text-xs text-teal-400 font-body mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Link */}
            <div className="mt-4 pt-4 border-t border-cream-100">
              <button className="text-coral-500 hover:text-coral-700 text-sm font-medium transition-colors">
                View All Activity →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
