export default function ResourcesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-teal-900">Training Resources</h1>
          <p className="text-teal-400 mt-1">Downloads, worksheets, templates, and reference materials.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {['All', 'PDFs', 'Worksheets', 'Templates', 'Audio', 'Checklists'].map((filter) => (
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

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Behavior Assessment Worksheet', type: 'PDF', size: '240 KB', tag: 'Foundation' },
          { title: 'CGPS Scoring Template', type: 'Worksheet', size: '120 KB', tag: 'Assessment' },
          { title: 'Session Planning Checklist', type: 'Checklist', size: '85 KB', tag: 'Practice' },
          { title: 'Body Language Reference Guide', type: 'PDF', size: '1.2 MB', tag: 'Foundation' },
          { title: 'Reactivity Protocol Audio Guide', type: 'Audio', size: '18 MB', tag: 'Reactivity' },
          { title: 'Client Intake Form Template', type: 'Template', size: '95 KB', tag: 'Business' },
        ].map((resource) => (
          <div key={resource.title} className="bg-white rounded-xl border border-cream-100 shadow-sm p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-cream-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-teal-700 transition-colors">
                <svg className="w-5 h-5 text-teal-700 group-hover:text-cream-50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0013.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-sm text-teal-900 truncate">{resource.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-teal-400">{resource.type}</span>
                  <span className="text-xs text-teal-400">•</span>
                  <span className="text-xs text-teal-400">{resource.size}</span>
                </div>
                <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-cream-100 text-teal-700 rounded-full">{resource.tag}</span>
              </div>
              <button className="p-2 rounded-lg text-teal-400 hover:text-teal-700 hover:bg-cream-100 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
