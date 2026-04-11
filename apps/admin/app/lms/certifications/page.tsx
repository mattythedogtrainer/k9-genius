import React from 'react';

export default function Certifications() {
  const certifications = [
    { id: 1, title: 'Certified Dog Trainer', status: 'active', requiredCourses: 4, activeCandidates: 23, passRate: '85%' },
    { id: 2, title: 'Professional Behaviorist', status: 'active', requiredCourses: 6, activeCandidates: 12, passRate: '92%' },
    { id: 3, title: 'Service Dog Specialist', status: 'active', requiredCourses: 5, activeCandidates: 8, passRate: '88%' },
    { id: 4, title: 'Agility Coach Certification', status: 'draft', requiredCourses: 3, activeCandidates: 0, passRate: '-' },
    { id: 5, title: 'Puppy Training Specialist', status: 'active', requiredCourses: 3, activeCandidates: 15, passRate: '79%' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900 text-green-200';
      case 'draft':
        return 'bg-yellow-900 text-yellow-200';
      case 'archived':
        return 'bg-slate-800 text-slate-300';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Certifications</h1>
          <p className="text-slate-400">Manage certification programs and requirements</p>
        </div>
        <button className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors">
          Create Certification
        </button>
      </div>

      <div className="bg-card border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900">
                <th className="px-6 py-3 text-slate-300 font-semibold">Title</th>
                <th className="px-6 py-3 text-slate-300 font-semibold">Status</th>
                <th className="px-6 py-3 text-slate-300 font-semibold">Required Courses</th>
                <th className="px-6 py-3 text-slate-300 font-semibold">Active Candidates</th>
                <th className="px-6 py-3 text-slate-300 font-semibold">Pass Rate</th>
                <th className="px-6 py-3 text-slate-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certifications.map((cert) => (
                <tr key={cert.id} className="border-b border-slate-800 hover:bg-slate-900 transition-colors">
                  <td className="px-6 py-3 text-white font-medium">{cert.title}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getStatusColor(cert.status)}`}>
                      {cert.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-white">{cert.requiredCourses}</td>
                  <td className="px-6 py-3 text-white">{cert.activeCandidates}</td>
                  <td className="px-6 py-3 text-white font-medium">{cert.passRate}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">
                        View
                      </button>
                      <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
          <div>Showing 5 of 5 certifications</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-white transition-colors">Previous</button>
            <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-white transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
