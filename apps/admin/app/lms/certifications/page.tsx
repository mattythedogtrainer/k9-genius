'use client';

import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';

interface CreateCertificationForm {
  title: string;
  slug: string;
  description: string;
  validityMonths: string;
}

interface ModalErrors {
  title?: string;
  slug?: string;
  submit?: string;
}

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const generateSlugFromTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

const SkeletonRow = () => (
  <tr className="border-b border-slate-800">
    <td className="px-6 py-3">
      <div className="h-4 bg-slate-700 rounded w-48 animate-pulse" />
    </td>
    <td className="px-6 py-3">
      <div className="h-4 bg-slate-700 rounded w-32 animate-pulse" />
    </td>
    <td className="px-6 py-3">
      <div className="h-4 bg-slate-700 rounded w-16 animate-pulse" />
    </td>
    <td className="px-6 py-3">
      <div className="h-6 bg-slate-700 rounded w-32 animate-pulse" />
    </td>
    <td className="px-6 py-3">
      <div className="h-8 bg-slate-700 rounded w-40 animate-pulse" />
    </td>
  </tr>
);

interface CreateCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCertificationForm) => void;
  isLoading: boolean;
  errors: ModalErrors;
}

const CreateCertificationModal = ({ isOpen, onClose, onSubmit, isLoading, errors }: CreateCertificationModalProps) => {
  const [form, setForm] = useState<CreateCertificationForm>({
    title: '',
    slug: '',
    description: '',
    validityMonths: '12',
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
      validityMonths: '12',
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
          <h2 className="text-xl font-semibold text-white">Create Certification</h2>
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
              placeholder="Certification title"
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
              placeholder="Certification description"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Validity (months)</label>
            <input
              type="number"
              value={form.validityMonths}
              onChange={(e) => setForm({ ...form, validityMonths: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
              placeholder="12"
              min="1"
              step="1"
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

export default function CertificationsManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalErrors, setModalErrors] = useState<ModalErrors>({});

  const { data, isLoading, error } = trpc.lms.certification.getMyCertifications.useQuery();
  const createMutation = trpc.lms.certification.adminCreate.useMutation();
  const utils = trpc.useUtils();

  const handleCreateCertification = async (formData: CreateCertificationForm) => {
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
      const validityMonths = formData.validityMonths ? parseInt(formData.validityMonths) : undefined;

      await createMutation.mutateAsync({
        title: formData.title,
        slug: formData.slug,
        description: formData.description || undefined,
        validityMonths: validityMonths,
      });

      await utils.lms.certification.getMyCertifications.invalidate();
      setIsModalOpen(false);
      setModalErrors({});
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create certification';
      setModalErrors({ submit: errorMessage });
    }
  };

  const certifications = data?.certifications || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Certifications</h1>
          <p className="text-slate-400">Manage certification programs and requirements</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50"
          disabled={createMutation.isPending}
        >
          Create Certification
        </button>
      </div>

      <CreateCertificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCertification}
        isLoading={createMutation.isPending}
        errors={modalErrors}
      />

      <div className="bg-card border border-slate-800 rounded-xl overflow-hidden">
        {error && (
          <div className="px-6 py-4 bg-red-900 border-b border-red-700 text-red-200">
            Failed to load certifications: {error.message}
          </div>
        )}

        {isLoading && !data ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900">
                  <th className="px-6 py-3 text-slate-300 font-semibold">Title</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Slug</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Courses</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Validity</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        ) : certifications.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-400 mb-4">No certifications yet. Create one to get started.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors inline-block"
            >
              Create Your First Certification
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900">
                  <th className="px-6 py-3 text-slate-300 font-semibold">Title</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Slug</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Courses</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Validity</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certifications.map((cert: any) => (
                  <tr key={cert.id} className="border-b border-slate-800 hover:bg-slate-900 transition-colors">
                    <td className="px-6 py-3 text-white font-medium">{cert.title}</td>
                    <td className="px-6 py-3 text-slate-400 text-xs">{cert.slug}</td>
                    <td className="px-6 py-3 text-white">{cert.courseCount || 0}</td>
                    <td className="px-6 py-3 text-slate-400 text-xs">
                      {cert.validityMonths ? `${cert.validityMonths} mo` : 'Lifetime'}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">
                          Edit
                        </button>
                        <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && certifications.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
            <div>Showing {certifications.length} certifications</div>
          </div>
        )}
      </div>
    </div>
  );
}
