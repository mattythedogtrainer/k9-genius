import React from 'react';

export default function CourseManager() {
  const courses = [
    { id: 1, title: 'Obedience Training Basics', status: 'published', modules: 5, lessons: 24, enrolledStudents: 142 },
    { id: 2, title: 'Advanced Agility', status: 'published', modules: 4, lessons: 18, enrolledStudents: 87 },
    { id: 3, title: 'Behavior Modification', status: 'draft', modules: 3, lessons: 12, enrolledStudents: 0 },
    { id: 4, title: 'Service Dog Training', status: 'published', modules: 6, lessons: 30, enrolledStudents: 56 },
    { id: 5, title: 'Puppy Socialization', status: 'archived', modules: 2, lessons: 8, enrolledStudents: 0 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-900 text-yellow-200';
      case 'published':
        return 'bg-green-900 text-green-200';
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
          <h1 className="text-3xl font-bold text-white mb-2">Course Manager</h1>
          <p className="text-slate-400">Create, edit, and manage courses</p>
        </div>
        <button className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors">
          Create Course
        </button>
      </div>

      <div className="bg-card border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900">
                <th className="px-6 py-3 text-slate-300 font-semibold">Title</th>
                <th className="px-6 py-3 text-slate-300 font-semibold">Status</th>
                <th className="px-6 py-3 text-slate-300 font-semibold">Modules</th>
                <th className="px-6 py-3 text-slate-300 font-semibold">Lessons</th>
                <th className="px-6 py-3 text-slate-300 font-semibold">Enrolled Students</th>
                <th className="px-6 py-3 text-slate-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-slate-800 hover:bg-slate-900 transition-colors">
                  <td className="px-6 py-3 text-white font-medium">{course.title}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-white">{course.modules}</td>
                  <td className="px-6 py-3 text-white">{course.lessons}</td>
                  <td className="px-6 py-3 text-white">{course.enrolledStudents}</td>
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
          <div>Showing 5 of 5 courses</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-white transition-colors">Previous</button>
            <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-white transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
