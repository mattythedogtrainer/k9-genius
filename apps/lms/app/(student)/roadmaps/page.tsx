export default function RoadmapsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-teal-900">Learning Roadmaps</h1>
        <p className="text-teal-400 mt-1">Follow guided pathways to achieve your training goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'New Student Roadmap', description: 'Your starting point. Build a solid foundation in the K9 Design System methodology.', steps: 8, completed: 5, status: 'In Progress' },
          { title: 'Practitioner Certification Pathway', description: 'Complete all requirements to earn your K9 Design System Practitioner Certification.', steps: 12, completed: 2, status: 'In Progress' },
        ].map((roadmap) => (
          <div key={roadmap.title} className="bg-white rounded-xl border border-cream-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-heading font-bold text-teal-900">{roadmap.title}</h3>
                <p className="text-sm text-teal-400 mt-1">{roadmap.description}</p>
              </div>
              <div className="flex-shrink-0 w-14 h-14 rounded-full border-4 border-coral-500 flex items-center justify-center">
                <span className="text-sm font-bold text-coral-500">
                  {Math.round((roadmap.completed / roadmap.steps) * 100)}%
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {Array.from({ length: roadmap.steps }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full ${
                    i < roadmap.completed ? 'bg-coral-500' : 'bg-cream-100'
                  }`}
                />
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-teal-400">
              <span>{roadmap.completed} of {roadmap.steps} steps complete</span>
              <span>{roadmap.status}</span>
            </div>
            <button className="mt-4 w-full py-2.5 text-sm font-heading font-medium rounded-lg bg-teal-700 text-cream-50 hover:bg-teal-900 transition-colors">
              Continue Roadmap
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
