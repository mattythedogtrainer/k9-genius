import React from 'react';

export default function Roadmaps() {
  const roadmaps = [
    { id: 1, title: 'Complete Dog Training Path', status: 'published', steps: 8, assignedUsers: 45 },
    { id: 2, title: 'Professional Trainer Certification', status: 'published', steps: 12, assignedUsers: 28 },
    { id: 3, title: 'Behavioral Specialist Track', status: 'draft', steps: 6, assignedUsers: 0 },
    { id: 4, title: 'Service Dog Program', status: 'published', steps: 10, assignedUsers: 15 },
    { id: 5, title: 'Competitive Agility Path', status: 'published', steps: 7, assignedUsers: 32 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-900 text-yellow-200';
      case 'published':
        return 'bg-green-900 text-green-200';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Roadmaps</h1>
          <p className="text-slate-400">Learning paths and progression roadmaps</p>
        </div>
        <button className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors">
          Create Roadmap
        </button>
      </div>

      <div className="bg-card border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900">
                <th className="px-6 py-3 text-slate-300 font-semibold">Title</th>
                <th className="px-6 py-3 text-slate-300 font-semibold">Status</th>
                <th className="px-6 py-3 text-slate-300 font-semibold">Steps</th>
                <th className="px-6 py-3 text-slate-300 font-semibold">Assigned Users</th>
                <th className="px-6 py-3 text-slate-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roadmaps.map((roadmap) => (
                <tr key={roadmap.id} className="border-b border-slate-800 hover:bg-slate-900 transition-colors">
                  <td className="px-6 py-3 text-white font-medium">{roadmap.title}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getStatusColor(roadmap.status)}`}>
                      {roadmap.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-white">{roadmap.steps}</td>
                  <td className="px-6 py-3 text-white">{roadmap.assignedUsers}</td>
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
          <div>Showing 5 of 5 roadmaps</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-white transition-colors">Previous</button>
            <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-white transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
