'use client';

import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';

interface CreateRoadmapForm {
  title: string;
  slug: string;
  description: string;
}

interface ModalErrors {
  title?: string;
  slug?: string;
  submit?: string;
}

const generateSlugFromTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

const SkeletonCard = () => (
  <div className="bg-card border border-slate-800 rounded-xl p-6 animate-pulse">
    <div className="h-6 bg-slate-700 rounded w-48 mb-3" />
    <div className="h-4 bg-slate-700 rounded w-full mb-2" />
    <div className="h-4 bg-slate-700 rounded w-3/4 mb-4" />
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="h-10 bg-slate-700 rounded" />
      <div className="h-10 bg-slate-700 rounded" />
    </div>
    <div className="h-8 bg-slate-700 rounded" />
  </div>
);

interface CreateRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoadmapForm) => void;
  isLoading: boolean;
  errors: ModalErrors;
}

const CreateRoadmapModal = ({ isOpen, onClose, onSubmit, isLoading, errors }: CreateRoadmapModalProps) => {
  const [form, setForm] = useState<CreateRoadmapForm>({
    title: '',
    slug: '',
    description: '',
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm({
      ...form,
      title,
      slug: generateSlugFromTitle(title),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      description: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1f29] border border-slate-800 rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Create Roadmap</h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && (
            <div className="p-3 bg-red-900 border border-red-700 text-red-200 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={handleTitleChange}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
              placeholder="Roadmap title"
              disabled={isLoading}
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
              placeholder="auto-generated"
              disabled={isLoading}
            />
            {errors.slug && <p className="text-red-400 text-sm mt-1">{errors.slug}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors resize-none"
              placeholder="Roadmap description"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function RoadmapsManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalErrors, setModalErrors] = useState<ModalErrors>({});

  const { data, isLoading, error } = trpc.lms.roadmap.getMyRoadmaps.useQuery();
  const createMutation = trpc.lms.roadmap.adminCreate.useMutation();
  const utils = trpc.useUtils();

  const handleCreateRoadmap = async (formData: CreateRoadmapForm) => {
    setModalErrors({});

    if (!formData.title.trim()) {
      setModalErrors({ title: 'Title is required' });
      return;
    }

    if (!formData.slug.trim()) {
      setModalErrors({ slug: 'Slug is required' });
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: formData.title,
        slug: formData.slug,
        description: formData.description || undefined,
      });

      await utils.lms.roadmap.getMyRoadmaps.invalidate();
      setIsModalOpen(false);
      setModalErrors({});
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create roadmap';
      setModalErrors({ submit: errorMessage });
    }
  };

  const roadmaps = data?.roadmaps || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Roadmaps</h1>
          <p className="text-slate-400">Learning paths and progression roadmaps</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50"
          disabled={createMutation.isPending}
        >
          Create Roadmap
        </button>
      </div>

      <CreateRoadmapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateRoadmap}
        isLoading={createMutation.isPending}
        errors={modalErrors}
      />

      {error && (
        <div className="mb-6 p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg">
          Failed to load roadmaps: {error.message}
        </div>
      )}

      {isLoading && !data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="bg-card border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-400 mb-4">No roadmaps yet. Create one to get started.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors inline-block"
          >
            Create Your First Roadmap
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((roadmap: any) => (
            <div key={roadmap.id} className="bg-card border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">{roadmap.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2">{roadmap.description || 'No description'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-slate-900 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Steps</div>
                  <div className="text-lg font-semibold text-white">{roadmap.stepCount || 0}</div>
                </div>
                <div className="bg-slate-900 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Slug</div>
                  <div className="text-xs text-slate-300 truncate">{roadmap.slug}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs transition-colors font-medium">
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs transition-colors font-medium">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && roadmaps.length > 0 && (
        <div className="mt-6 text-sm text-slate-400 text-center">
          Showing {roadmaps.length} roadmap{roadmaps.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
