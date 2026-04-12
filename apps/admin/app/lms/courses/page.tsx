'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { trpc } from '@/lib/trpc';

type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
type Category = 'Obedience' | 'Agility' | 'Behavior' | 'Puppy Training' | 'Service Dogs' | 'Therapy Dogs';
type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

const CATEGORIES: Category[] = ['Obedience', 'Agility', 'Behavior', 'Puppy Training', 'Service Dogs', 'Therapy Dogs'];
const DIFFICULTIES: DifficultyLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS'];

interface CreateCourseForm {
  title: string;
  description: string;
  category: Category;
  difficulty: DifficultyLevel;
  price: string;
}

interface ModalErrors {
  title?: string;
  submit?: string;
}

const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getStatusColor = (status: ContentStatus): string => {
  switch (status) {
    case 'DRAFT':
      return 'bg-yellow-900 text-yellow-200';
    case 'PUBLISHED':
      return 'bg-green-900 text-green-200';
    case 'ARCHIVED':
      return 'bg-slate-700 text-slate-300';
    default:
      return 'bg-slate-700 text-slate-300';
  }
};

const getDifficultyColor = (difficulty: DifficultyLevel): string => {
  switch (difficulty) {
    case 'BEGINNER':
      return 'bg-blue-900 text-blue-200';
    case 'INTERMEDIATE':
      return 'bg-purple-900 text-purple-200';
    case 'ADVANCED':
      return 'bg-red-900 text-red-200';
    case 'ALL_LEVELS':
      return 'bg-slate-700 text-slate-300';
    default:
      return 'bg-slate-700 text-slate-300';
  }
};

const SkeletonRow = () => (
  <tr className="border-b border-slate-800">
    <td className="px-6 py-3">
      <div className="h-4 bg-slate-700 rounded w-48 animate-pulse" />
    </td>
    <td className="px-6 py-3">
      <div className="h-6 bg-slate-700 rounded w-24 animate-pulse" />
    </td>
    <td className="px-6 py-3">
      <div className="h-6 bg-slate-700 rounded w-20 animate-pulse" />
    </td>
    <td className="px-6 py-3">
      <div className="h-4 bg-slate-700 rounded w-12 animate-pulse" />
    </td>
    <td className="px-6 py-3">
      <div className="h-4 bg-slate-700 rounded w-16 animate-pulse" />
    </td>
    <td className="px-6 py-3">
      <div className="h-8 bg-slate-700 rounded w-40 animate-pulse" />
    </td>
  </tr>
);

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCourseForm) => void;
  isLoading: boolean;
  errors: ModalErrors;
}

const CreateCourseModal = ({ isOpen, onClose, onSubmit, isLoading, errors }: CreateCourseModalProps) => {
  const [form, setForm] = useState<CreateCourseForm>({
    title: '',
    description: '',
    category: 'Obedience',
    difficulty: 'BEGINNER',
    price: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      category: 'Obedience',
      difficulty: 'BEGINNER',
      price: '',
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
          <h2 className="text-xl font-semibold text-white">Create New Course</h2>
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
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
              placeholder="Course title"
              disabled={isLoading}
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors resize-none"
              placeholder="Course description"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-gold transition-colors"
              disabled={isLoading}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value as DifficultyLevel })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-gold transition-colors"
              disabled={isLoading}
            >
              {DIFFICULTIES.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Price ($)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
              placeholder="0.00"
              step="0.01"
              min="0"
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
              {isLoading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function CourseManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalErrors, setModalErrors] = useState<ModalErrors>({});

  const { data, isLoading, error } = trpc.course.list.useQuery({ limit: 50 });
  const createMutation = trpc.course.create.useMutation();
  const utils = trpc.useUtils();

  const handleCreateCourse = async (formData: CreateCourseForm) => {
    setModalErrors({});

    if (!formData.title.trim()) {
      setModalErrors({ title: 'Title is required' });
      return;
    }

    try {
      const price = formData.price ? parseFloat(formData.price) : 0;

      await createMutation.mutateAsync({
        title: formData.title,
        description: formData.description || undefined,
        category: formData.category,
        difficulty: formData.difficulty,
        price,
      });

      await utils.course.list.invalidate();
      setIsModalOpen(false);
      setModalErrors({});
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create course';
      setModalErrors({ submit: errorMessage });
    }
  };

  const courses = data?.courses || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Course Manager</h1>
          <p className="text-slate-400">Create, edit, and manage courses</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50"
          disabled={createMutation.isPending}
        >
          Create Course
        </button>
      </div>

      <CreateCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCourse}
        isLoading={createMutation.isPending}
        errors={modalErrors}
      />

      <div className="bg-[#1a1f29] border border-slate-800 rounded-xl overflow-hidden">
        {error && (
          <div className="px-6 py-4 bg-red-900 border-b border-red-700 text-red-200">
            Failed to load courses: {error.message}
          </div>
        )}

        {isLoading && !data ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900">
                  <th className="px-6 py-3 text-slate-300 font-semibold">Title</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Status</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Difficulty</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Price</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Students</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Created</th>
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
        ) : courses.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-400 mb-4">No courses yet. Create one to get started.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors inline-block"
            >
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900">
                  <th className="px-6 py-3 text-slate-300 font-semibold">Title</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Status</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Difficulty</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Price</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Students</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Created</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course: any) => (
                  <tr key={course.id} className="border-b border-slate-800 hover:bg-slate-900 transition-colors">
                    <td className="px-6 py-3 text-white font-medium">{course.title}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getStatusColor(course.status)}`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-white">${course.price.toFixed(2)}</td>
                    <td className="px-6 py-3 text-white">{course.studentCount}</td>
                    <td className="px-6 py-3 text-slate-400 text-xs">{formatDate(course.createdAt)}</td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/lms/courses/${course.id}`}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors"
                        >
                          Edit
                        </Link>
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

        {!isLoading && courses.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
            <div>Showing {courses.length} of {data?.total || 0} courses</div>
          </div>
        )}
      </div>
    </div>
  );
}
