export default function CertificationsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-teal-900">Certifications</h1>
        <p className="text-teal-400 mt-1">Earn professional certifications in the K9 Design System method.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-cream-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-5.54 0" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-heading font-bold text-teal-900">K9 Design System Practitioner</h3>
                <span className="px-2.5 py-0.5 text-xs font-medium bg-coral-500/10 text-coral-500 rounded-full">In Progress</span>
              </div>
              <p className="text-sm text-teal-400 mt-1">Demonstrate your competency in the K9 Design System methodology through coursework and a comprehensive exam.</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-coral-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  <span className="text-teal-700">Foundation Course — Completed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                  <span className="text-teal-400">Advanced Reactivity — 20% complete</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                  <span className="text-teal-400">Certification Exam — Locked</span>
                </div>
              </div>
              <button className="mt-4 px-6 py-2.5 text-sm font-heading font-medium rounded-lg bg-teal-700 text-cream-50 hover:bg-teal-900 transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
