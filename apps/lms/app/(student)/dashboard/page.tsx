export default function DashboardPage() {
  // In production, this data comes from tRPC queries
  const userName = 'Matty';

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-teal-900">
          Welcome back, {userName}
        </h1>
        <p className="text-teal-400 mt-1 font-body">
          Pick up where you left off or explore something new.
        </p>
      </div>

      {/* Continue Learning Card */}
      <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-bold text-teal-900">Continue Learning</h2>
          <span className="text-sm text-teal-400">65% complete</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="w-32 h-20 bg-cream-100 rounded-lg flex items-center justify-center text-teal-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-teal-900">Foundation Course: Canine Behavior Basics</h3>
            <p className="text-sm text-teal-400 mt-1">Module 3 — Lesson 2: Reading Body Language Signals</p>
            <div className="mt-3 w-full bg-cream-100 rounded-full h-2">
              <div className="bg-coral-500 h-2 rounded-full transition-all duration-500" style={{ width: '65%' }} />
            </div>
          </div>
          <button className="px-6 py-2.5 bg-teal-700 hover:bg-teal-900 text-cream-50 font-heading font-medium text-sm rounded-lg transition-colors duration-200">
            Continue
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Courses In Progress', value: '3', color: 'text-teal-700' },
          { label: 'Lessons Completed', value: '24', color: 'text-coral-500' },
          { label: 'Roadmap Progress', value: '42%', color: 'text-teal-700' },
          { label: 'Certifications', value: '1 Active', color: 'text-coral-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-cream-100 shadow-sm p-5">
            <p className="text-sm text-teal-400 font-body">{stat.label}</p>
            <p className={`text-2xl font-heading font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Enrolled Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-teal-900">Your Courses</h2>
          <a href="/courses" className="text-sm text-teal-700 hover:underline font-medium">View All</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Foundation Course: Canine Behavior Basics', progress: 65, status: 'In Progress', modules: 6 },
            { title: 'Advanced Reactivity Management', progress: 20, status: 'In Progress', modules: 8 },
            { title: 'Puppy Development & Early Learning', progress: 0, status: 'Not Started', modules: 5 },
          ].map((course) => (
            <div key={course.title} className="bg-white rounded-xl border border-cream-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group">
              <div className="h-36 bg-cream-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-teal-400 group-hover:text-teal-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                </svg>
              </div>
              <div className="p-5">
                <h3 className="font-heading font-bold text-teal-900 text-sm leading-snug">{course.title}</h3>
                <p className="text-xs text-teal-400 mt-1">{course.modules} modules</p>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`font-medium ${course.progress > 0 ? 'text-coral-500' : 'text-teal-400'}`}>
                      {course.status}
                    </span>
                    <span className="text-teal-400">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-cream-100 rounded-full h-1.5">
                    <div className="bg-coral-500 h-1.5 rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
                <button className="mt-4 w-full py-2 text-sm font-heading font-medium text-teal-700 border border-teal-700 rounded-lg hover:bg-teal-700 hover:text-cream-50 transition-colors duration-200">
                  {course.progress > 0 ? 'Continue' : 'Start Course'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
        <h2 className="text-lg font-heading font-bold text-teal-900 mb-4">Announcements</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-cream-50">
            <div className="w-2 h-2 mt-2 rounded-full bg-coral-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-teal-900">New Certification Program Available</p>
              <p className="text-xs text-teal-400 mt-0.5">The Practitioner Certification is now open for enrollment. Complete the foundation courses to begin.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-cream-50">
            <div className="w-2 h-2 mt-2 rounded-full bg-teal-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-teal-900">Community Q&A Session This Friday</p>
              <p className="text-xs text-teal-400 mt-0.5">Join us for a live Q&A on advanced behavior modification techniques.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
