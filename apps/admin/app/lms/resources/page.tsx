'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';

type ResourceType = 'PDF' | 'WORKSHEET' | 'TEMPLATE' | 'AUDIO' | 'CHECKLIST' | 'GUIDE' | 'EXTERNAL_LINK' | 'OTHER';

const RESOURCE_TYPES: ResourceType[] = ['PDF', 'WORKSHEET', 'TEMPLATE', 'AUDIO', 'CHECKLIST', 'GUIDE', 'EXTERNAL_LINK', 'OTHER'];

function TypeIcon({ type: resourceType }: { type: string }) {
  const sizeClass = 'w-6 h-6';
  const colorClass = 'stroke-gold';

  switch (resourceType) {
    case 'PDF':
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" className={colorClass} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="13 2 13 9 20 9" className={colorClass} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="8" y="16" fontSize="8" fill="#d4af37" fontWeight="bold">PDF</text>
        </svg>
      );
    case 'WORKSHEET':
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" className={colorClass} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" className={colorClass} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'TEMPLATE':
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" className={colorClass} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 7h6M9 11h6M9 15h2" className={colorClass} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'AUDIO':
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1v22m0-22a8 8 0 0 1 8 8v6a8 8 0 0 1-16 0V9a8 8 0 0 1 8-8z" className={colorClass} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 17v4m6-4v4" className={colorClass} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'CHECKLIST':
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 11l3 3L22 4m-15 11H3V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" className={colorClass} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'GUIDE':
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20m0 0V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v13" className={colorClass} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 11h10" className={colorClass} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'EXTERNAL_LINK':
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h6m0-2h6v6m0-6L9 15" className={colorClass} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-5-6.5 5 2-7L2 9h7l3-7z" className={colorClass} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

function LoadingSkeleton() {
  return (
    <div className="bg-card border border-slate-800 rounded-xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="w-6 h-6 bg-slate-700 rounded"></div>
        <div className="w-16 h-6 bg-slate-700 rounded"></div>
      </div>
      <div className="h-4 bg-slate-700 rounded mb-3 w-3/4"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-5 bg-slate-700 rounded w-12"></div>
        <div className="h-5 bg-slate-700 rounded w-12"></div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-8 bg-slate-700 rounded"></div>
        <div className="flex-1 h-8 bg-slate-700 rounded"></div>
      </div>
    </div>
  );
}

function CreateResourceModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'PDF' as ResourceType,
    fileUrl: '',
    fileSizeBytes: '',
    durationSeconds: '',
    tags: '',
  });
  const [error, setError] = useState('');

  const createMutation = trpc.lms.resource.adminCreate.useMutation({
    onSuccess: () => {
      setFormData({
        title: '',
        description: '',
        type: 'PDF',
        fileUrl: '',
        fileSizeBytes: '',
        durationSeconds: '',
        tags: '',
      });
      setError('');
      onSuccess();
      onClose();
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to create resource');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    const input = {
      title: formData.title,
      description: formData.description || undefined,
      type: formData.type,
      fileUrl: formData.fileUrl || undefined,
      fileSizeBytes: formData.fileSizeBytes ? parseInt(formData.fileSizeBytes) : undefined,
      durationSeconds: formData.durationSeconds ? parseInt(formData.durationSeconds) : undefined,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    createMutation.mutate(input);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-slate-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Create Resource</h2>

        {error && <div className="bg-red-900 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
              placeholder="Resource title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
              placeholder="Resource description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ResourceType })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-gold transition-colors"
            >
              {RESOURCE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">File URL</label>
            <input
              type="text"
              value={formData.fileUrl}
              onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
              placeholder="https://example.com/file.pdf"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">File Size (bytes)</label>
            <input
              type="number"
              value={formData.fileSizeBytes}
              onChange={(e) => setFormData({ ...formData, fileSizeBytes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Duration (seconds)</label>
            <input
              type="number"
              value={formData.durationSeconds}
              onChange={(e) => setFormData({ ...formData, durationSeconds: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-2 bg-gold hover:bg-yellow-400 text-black rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Resources() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<ResourceType | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = trpc.lms.resource.getResources.useQuery({
    type: selectedType || undefined,
    search: searchQuery || undefined,
    page: currentPage,
    limit: 12,
  });

  const utils = trpc.useUtils();

  const handleCreateSuccess = () => {
    utils.lms.resource.getResources.invalidate();
  };

  const getStatusColor = (status: string) => {
    return status === 'PUBLISHED' ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200';
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const resources = data?.resources || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gray-900" style={{ backgroundColor: '#0f1419' }}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Resources</h1>
            <p className="text-slate-400">Manage learning resources and materials</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors"
          >
            Upload Resource
          </button>
        </div>

        <div className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 px-4 py-2 bg-card border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
            style={{ backgroundColor: '#1a1f29' }}
          />
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value as ResourceType | '');
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-card border border-slate-800 rounded-lg text-white focus:outline-none focus:border-gold transition-colors"
            style={{ backgroundColor: '#1a1f29' }}
          >
            <option value="">All Types</option>
            {RESOURCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-800 text-red-200 p-4 rounded-lg mb-6">
            <p className="font-medium">Error loading resources</p>
            <p className="text-sm text-red-300">{error.message}</p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No resources found</p>
            <p className="text-slate-500 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {resources.map((resource: any) => (
                <div
                  key={resource.id}
                  className="bg-card border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
                  style={{ backgroundColor: '#1a1f29' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <TypeIcon type={resource.type} />
                    <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getStatusColor(resource.status)}`}>
                      {resource.status}
                    </span>
                  </div>
                  <h3 className="text-white font-medium mb-2">{resource.title}</h3>
                  {resource.description && <p className="text-slate-400 text-sm mb-2">{resource.description}</p>}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {resource.tags.map((tag: any) => (
                      <span key={tag} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                    <span>Downloads: {resource.downloadCount}</span>
                    <span>{formatDate(resource.createdAt)}</span>
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

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="text-slate-400 text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <CreateResourceModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSuccess={handleCreateSuccess} />
    </div>
  );
}
