export default function CommunityPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-teal-900">Community</h1>
        <p className="text-teal-400 mt-1">Connect with fellow students and trainers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a href="#" className="bg-white rounded-xl border border-cream-100 shadow-sm p-6 hover:shadow-md transition-shadow group">
          <h3 className="font-heading font-bold text-teal-900 group-hover:text-teal-700">Discussion Forum</h3>
          <p className="text-sm text-teal-400 mt-1">Ask questions, share insights, and connect with the K9 Design System community.</p>
        </a>
        <a href="#" className="bg-white rounded-xl border border-cream-100 shadow-sm p-6 hover:shadow-md transition-shadow group">
          <h3 className="font-heading font-bold text-teal-900 group-hover:text-teal-700">Live Q&A Sessions</h3>
          <p className="text-sm text-teal-400 mt-1">Join weekly live sessions with certified instructors.</p>
        </a>
      </div>

      <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
        <h2 className="text-lg font-heading font-bold text-teal-900 mb-4">Latest Announcements</h2>
        <div className="space-y-4">
          <div className="pb-4 border-b border-cream-100">
            <p className="text-sm font-medium text-teal-900">New Certification Cohort Starting May 1st</p>
            <p className="text-xs text-teal-400 mt-1">Register now for the spring practitioner certification cohort.</p>
          </div>
          <div className="pb-4 border-b border-cream-100">
            <p className="text-sm font-medium text-teal-900">Advanced Workshop: Multi-Dog Households</p>
            <p className="text-xs text-teal-400 mt-1">New workshop content added to the Advanced Reactivity course.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
