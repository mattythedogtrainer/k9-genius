import React from 'react';

export default function Resources() {
  const resources = [
    { id: 1, title: 'Training Guide PDF', type: 'document', tags: ['training', 'guide'], status: 'active' },
    { id: 2, title: 'Behavior Reference Video', type: 'video', tags: ['behavior', 'reference'], status: 'active' },
    { id: 3, title: 'Lesson Template', type: 'template', tags: ['template', 'lesson'], status: 'active' },
    { id: 4, title: 'Assessment Quiz', type: 'quiz', tags: ['assessment', 'quiz'], status: 'draft' },
    { id: 5, title: 'Certification Handbook', type: 'document', tags: ['certification', 'handbook'], status: 'active' },
    { id: 6, title: 'Interactive Module', type: 'interactive', tags: ['interactive', 'course'], status: 'active' },
    { id: 7, title: 'Case Study Archive', type: 'document', tags: ['case-study', 'reference'], status: 'active' },
    { id: 8, title: 'Training Checklist', type: 'template', tags: ['checklist', 'training'], status: 'draft' },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return '📄';
      case 'video':
        return '🎥';
      case 'template':
        return '📋';
      case 'quiz':
        return '❓';
      case 'interactive':
        return '🎮';
      default:
        return '📎';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Resources</h1>
          <p className="text-slate-400">Manage learning resources and materials</p>
        </div>
        <button className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors">
          Upload Resource
        </button>
      </div>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search resources..."
          className="flex-1 px-4 py-2 bg-card border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
        />
        <select className="px-4 py-2 bg-card border border-slate-800 rounded-lg text-white focus:outline-none focus:border-gold transition-colors">
          <option value="">All Types</option>
          <option value="document">Document</option>
          <option value="video">Video</option>
          <option value="template">Template</option>
          <option value="quiz">Quiz</option>
          <option value="interactive">Interactive</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <div key={resource.id} className="bg-card border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{getTypeIcon(resource.type)}</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getStatusColor(resource.status)}`}>
                {resource.status}
              </span>
            </div>
            <h3 className="text-white font-medium mb-2">{resource.title}</h3>
            <div className="flex flex-wrap gap-1 mb-4">
              {resource.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">
                Edit
              </button>
              <button className="flex-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
