'use client';

import React, { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';

function getInitials(firstName?: string, lastName?: string, displayName?: string): string {
  const name = displayName || `${firstName || ''} ${lastName || ''}`.trim();
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getRoleBadgeColors(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'bg-red-900 text-red-200';
    case 'TRAINER':
      return 'bg-blue-900 text-blue-200';
    case 'CONSUMER':
    default:
      return 'bg-slate-800 text-slate-300';
  }
}

function EnrollmentModal({ user, onClose }: { user: any; onClose: () => void }) {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const coursesQuery = trpc.course.list.useQuery({});
  const enrollMutation = trpc.lms.enrollment.adminEnroll.useMutation();

  const handleEnroll = async () => {
    if (!selectedCourseId) {
      setError('Please select a course');
      return;
    }

    setIsEnrolling(true);
    setError('');
    setSuccess(false);

    try {
      await enrollMutation.mutateAsync({
        userId: user.id,
        courseId: selectedCourseId,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enrollment failed');
      setIsEnrolling(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-slate-700 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">Enroll {user.displayName || user.firstName || 'User'}</h2>

        {coursesQuery.isLoading && (
          <div className="text-slate-300 py-4">Loading courses...</div>
        )}

        {coursesQuery.data && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Select Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-gold transition-colors"
            >
              <option value="">Choose a course...</option>
              {coursesQuery.data.courses.map((course: any) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded text-red-300 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-900/20 border border-green-800 rounded text-green-300 text-sm">
            User enrolled successfully!
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleEnroll}
            disabled={isEnrolling || success}
            className="px-4 py-2 bg-gold hover:bg-yellow-500 text-black rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {isEnrolling ? 'Enrolling...' : success ? 'Enrolled!' : 'Enroll'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-800">
      <td className="px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-800 rounded-full animate-pulse" />
          <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
        </div>
      </td>
      <td className="px-6 py-3">
        <div className="h-4 w-32 bg-slate-800 rounded animate-pulse" />
      </td>
      <td className="px-6 py-3">
        <div className="h-4 w-16 bg-slate-800 rounded animate-pulse" />
      </td>
      <td className="px-6 py-3">
        <div className="h-4 w-12 bg-slate-800 rounded animate-pulse" />
      </td>
      <td className="px-6 py-3">
        <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
      </td>
      <td className="px-6 py-3">
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-slate-800 rounded animate-pulse" />
          <div className="h-8 w-20 bg-slate-800 rounded animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

export default function UsersEnrollments() {
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'CONSUMER' | 'TRAINER' | 'ADMIN'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const queryRole = roleFilter === 'ALL' ? undefined : roleFilter;
  const usersQuery = trpc.user.list.useQuery({ role: queryRole });

  const filteredUsers = useMemo(() => {
    if (!usersQuery.data?.users) return [];

    return usersQuery.data.users.filter((user: any) => {
      const searchLower = searchQuery.toLowerCase();
      const displayName = user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim();
      return (
        displayName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    });
  }, [usersQuery.data?.users, searchQuery]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Users & Enrollments</h1>
          <p className="text-slate-400">Manage users and their course enrollments</p>
        </div>
      </div>

      <div className="bg-card border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'ALL' | 'CONSUMER' | 'TRAINER' | 'ADMIN')}
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-gold transition-colors"
            >
              <option value="ALL">All Roles</option>
              <option value="CONSUMER">Consumer</option>
              <option value="TRAINER">Trainer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        {usersQuery.error && (
          <div className="p-6 text-center">
            <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-300">
              Error loading users: {usersQuery.error.message}
            </div>
          </div>
        )}

        {!usersQuery.error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900">
                  <th className="px-6 py-3 text-slate-300 font-semibold">Name</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Email</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Role</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">XP</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Joined</th>
                  <th className="px-6 py-3 text-slate-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersQuery.isLoading && (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <SkeletonRow key={i} />
                    ))}
                  </>
                )}

                {!usersQuery.isLoading && filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      {searchQuery || roleFilter !== 'ALL'
                        ? 'No users found matching your filters'
                        : 'No users available'}
                    </td>
                  </tr>
                )}

                {filteredUsers.map((user: any) => {
                  const displayName = user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
                  const initials = getInitials(user.firstName, user.lastName, user.displayName);

                  return (
                    <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-900 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={displayName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-xs font-semibold text-gold">
                              {initials}
                            </div>
                          )}
                          <span className="text-white">{displayName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-slate-300">{user.email}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getRoleBadgeColors(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-white">{user.totalXP || 0}</td>
                      <td className="px-6 py-3 text-slate-300">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">
                            View
                          </button>
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="px-3 py-1 bg-gold/20 hover:bg-gold/30 text-gold rounded text-xs font-semibold transition-colors"
                          >
                            Grant Access
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!usersQuery.error && (
          <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
            <div>
              Showing {filteredUsers.length} of {usersQuery.data?.total || 0} users
            </div>
          </div>
        )}
      </div>

      {selectedUser && <EnrollmentModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
}
