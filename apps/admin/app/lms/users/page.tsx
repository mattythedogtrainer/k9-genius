import React from 'react';

export default function UsersEnrollments() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Student', enrolledCourses: 3, lastActive: '2 hours ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Instructor', enrolledCourses: 1, lastActive: '1 day ago' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Student', enrolledCourses: 5, lastActive: '30 minutes ago' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Student', enrolledCourses: 2, lastActive: '3 days ago' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'Admin', enrolledCourses: 0, lastActive: 'Just now' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Users & Enrollments</h1>
          <p className="text-slate-400">Manage users and their course enrollments</p>
        </div>
      </div>

      <div className="bg-card border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900">
                <th className="px-6 py-3 text-slate-300 font-semibold">Name</th>
                <th className="px-6 py-3 text-slate-300 font-semibold">Email</th>
                <th className="px-6 py-3 text-slate-300 font-semibold">Role</th>
                <th className="px-6 py-3 text-slate-300 font-semibold">Enrolled Courses</th>
                <th className="px-6 py-3 text-slate-300 font-semibold">Last Active</th>
                <th className="px-6 py-3 text-slate-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-900 transition-colors">
                  <td className="px-6 py-3 text-white">{user.name}</td>
                  <td className="px-6 py-3 text-slate-300">{user.email}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.role === 'Admin' ? 'bg-red-900 text-red-200' :
                      user.role === 'Instructor' ? 'bg-blue-900 text-blue-200' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-white">{user.enrolledCourses}</td>
                  <td className="px-6 py-3 text-slate-300">{user.lastActive}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">
                        View Profile
                      </button>
                      <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">
                        Grant Access
                      </button>
                      <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">
                        Edit Role
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
          <div>Showing 5 of 5 users</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-white transition-colors">Previous</button>
            <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-white transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
