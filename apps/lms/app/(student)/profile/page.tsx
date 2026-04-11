export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-heading font-bold text-teal-900">Profile & Account</h1>

      <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-coral-500 flex items-center justify-center text-white text-xl font-bold">
            M
          </div>
          <div>
            <h2 className="font-heading font-bold text-teal-900">Matty Couperthwaite</h2>
            <p className="text-sm text-teal-400">salesfunnelmatty@gmail.com</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1">First Name</label>
            <input type="text" defaultValue="Matty" className="w-full px-4 py-2.5 rounded-lg border border-cream-100 bg-cream-50 text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-700/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1">Last Name</label>
            <input type="text" defaultValue="Couperthwaite" className="w-full px-4 py-2.5 rounded-lg border border-cream-100 bg-cream-50 text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-700/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1">Email</label>
            <input type="email" defaultValue="salesfunnelmatty@gmail.com" className="w-full px-4 py-2.5 rounded-lg border border-cream-100 bg-cream-50 text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-700/20" disabled />
          </div>
          <button className="px-6 py-2.5 bg-teal-700 hover:bg-teal-900 text-cream-50 font-heading font-medium text-sm rounded-lg transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
        <h2 className="text-lg font-heading font-bold text-teal-900 mb-4">Earned Certificates</h2>
        <p className="text-sm text-teal-400">No certificates earned yet. Complete a certification program to earn your first certificate.</p>
      </div>
    </div>
  );
}
