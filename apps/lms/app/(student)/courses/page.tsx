export default function CourseLibraryPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-teal-900">Course Library</h1>
          <p className="text-teal-400 mt-1">Your enrolled courses and available programs.</p>
        </div>
        <div className="flex items-center gap-2">
          {['All', 'In Progress', 'Completed', 'Not Started'].map((filter) => (
            <button
              key={filter}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'All'
                  ? 'bg-teal-700 text-cream-50'
                  : 'bg-cream-100 text-teal-700 hover:bg-teal-700 hover:text-cream-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Foundation Course: Canine Behavior Basics', description: 'Master the core principles of canine behavior science and the K9 Design System approach.', modules: 6, lessons: 32, hours: 12, progress: 65, status: 'In Progress' },
          { title: 'Advanced Reactivity Management', description: 'Learn evidence-based protocols for managing and reducing reactivity in dogs.', modules: 8, lessons: 44, hours: 18, progress: 20, status: 'In Progress' },
          { title: 'Puppy Development & Early Learning', description: 'Comprehensive puppy training from developmental stages to foundation behaviors.', modules: 5, lessons: 28, hours: 10, progress: 0, status: 'Not Started' },
          { title: 'Resource Guarding Protocols', description: 'Assessment and modification protocols for resource guarding behaviors.', modules: 4, lessons: 20, hours: 8, progress: 100, status: 'Completed' },
          { title: 'Separation Anxiety: Assessment to Resolution', description: 'A systematic approach to diagnosing and treating separation-related behaviors.', modules: 6, lessons: 34, hours: 14, progress: 0, status: 'Not Started' },
        ].map((course) => (
          <div key={course.title} className="bg-white rounded-xl border border-cream-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group">
            <div className="h-40 bg-cream-100 flex items-center justify-center relative">
              <svg className="w-14 h-14 text-teal-400/50 group-hover:text-teal-700/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
              </svg>
              {course.status === 'Completed' && (
                <div className="absolute top-3 right-3 bg-teal-700 text-cream-50 text-xs font-medium px-2.5 py-1 rounded-full">
                  Completed
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-heading font-bold text-teal-900 leading-snug">{course.title}</h3>
              <p className="text-sm text-teal-400 mt-2 line-clamp-2">{course.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-teal-400">
                <span>{course.modules} modules</span>
                <span>{course.lessons} lessons</span>
                <span>{course.hours}h</span>
              </div>
              {course.progress > 0 && course.progress < 100 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-coral-500">{course.status}</span>
                    <span className="text-teal-400">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-cream-100 rounded-full h-1.5">
                    <div className="bg-coral-500 h-1.5 rounded-full" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              )}
              <button className="mt-4 w-full py-2.5 text-sm font-heading font-medium rounded-lg transition-colors duration-200 bg-teal-700 text-cream-50 hover:bg-teal-900">
                {course.progress > 0 && course.progress < 100 ? 'Continue' : course.progress === 100 ? 'Review' : 'Start Course'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
