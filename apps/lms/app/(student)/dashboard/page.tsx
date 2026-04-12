'use client';

import { useAuth } from '@k9-genius/ui';
import { trpc } from '@/lib/trpc';
import Link from 'next/link';

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <span className="text-4xl opacity-40">📊</span>
        <div className="h-6 w-20 bg-cream-100 rounded-full" />
      </div>
      <div className="h-10 w-16 bg-cream-100 rounded mb-2" />
      <div className="h-4 w-32 bg-cream-100 rounded" />
    </div>
  );
}

function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-cream-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-40 bg-cream-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-24 bg-cream-100 rounded" />
        <div className="h-5 w-full bg-cream-100 rounded" />
        <div className="h-3 w-3/4 bg-cream-100 rounded" />
        <div className="h-4 w-full bg-cream-100 rounded" />
        <div className="h-8 w-full bg-cream-100 rounded" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const auth = useAuth();
  const userName = auth.user?.displayName || auth.user?.firstName || 'there';

  // Fetch real tRPC data
  const enrollmentsQuery = trpc.lms.enrollment.getMyEnrollments.useQuery();
  const certificationsQuery = trpc.lms.certification.getMyCertifications.useQuery();
  const userQuery = trpc.user.me.useQuery();

  const enrollments = enrollmentsQuery.data || [];
  const certifications = certificationsQuery.data || [];
  const isLoading = enrollmentsQuery.isLoading || certificationsQuery.isLoading;

  // Calculate stats from real data
  const enrolledCoursesCount = enrollments.length;
  const certificationsCount = certifications.length;

  // Get the most recently accessed enrollment for "Continue Watching"
  const latestEnrollment = enrollments
    .filter((e: any) => e.lastAccessedAt)
    .sort((a: any, b: any) => new Date(b.lastAccessedAt!).getTime() - new Date(a.lastAccessedAt!).getTime())[0];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-4xl font-heading font-bold text-teal-900">
          Welcome back, {userName}! 🐾
        </h1>
        <p className="text-teal-400 mt-2 font-body text-lg">
          Continue your dog training certification journey
        </p>
      </div>

      {/* Stats Row - 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Enrolled Courses */}
        {isLoading ? (
          <StatCardSkeleton />
        ) : (
          <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <span className="text-4xl">📚</span>
              {enrolledCoursesCount > 0 && (
                <span className="inline-block px-2.5 py-1 bg-teal-400 text-teal-900 text-xs font-medium rounded-full">
                  Active
                </span>
              )}
            </div>
            <p className="text-4xl font-heading font-bold text-teal-900">{enrolledCoursesCount}</p>
            <p className="text-teal-400 font-body text-sm mt-1">Enrolled Courses</p>
          </div>
        )}

        {/* Card 2: Certifications */}
        {isLoading ? (
          <StatCardSkeleton />
        ) : (
          <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <span className="text-4xl">🎓</span>
              {certificationsCount > 0 && (
                <span className="inline-block px-2.5 py-1 bg-coral-300 text-coral-700 text-xs font-medium rounded-full">
                  {certificationsCount} Earned
                </span>
              )}
            </div>
            <p className="text-4xl font-heading font-bold text-coral-500">{certificationsCount}</p>
            <p className="text-teal-400 font-body text-sm mt-1">Certifications</p>
          </div>
        )}

        {/* Card 3: Learning Hours - Placeholder (no data source yet) */}
        {isLoading ? (
          <StatCardSkeleton />
        ) : (
          <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <span className="text-4xl">⏱️</span>
            </div>
            <p className="text-4xl font-heading font-bold text-teal-900">—</p>
            <p className="text-teal-400 font-body text-sm mt-1">Learning Hours</p>
          </div>
        )}

        {/* Card 4: Avg Score - Placeholder (no data source yet) */}
        {isLoading ? (
          <StatCardSkeleton />
        ) : (
          <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <span className="text-4xl">📊</span>
            </div>
            <p className="text-4xl font-heading font-bold text-teal-900">—</p>
            <p className="text-teal-400 font-body text-sm mt-1">Avg. Score</p>
          </div>
        )}
      </div>

      {/* Continue Watching Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Large Course Card (2/3 width on desktop) */}
        {isLoading ? (
          <div className="lg:col-span-2 bg-white rounded-xl border border-cream-100 shadow-sm overflow-hidden animate-pulse">
            <div className="h-64 bg-cream-100" />
            <div className="p-6 space-y-3">
              <div className="h-2.5 bg-cream-100 rounded-full w-2/3" />
              <div className="h-4 bg-cream-100 rounded w-1/3" />
            </div>
          </div>
        ) : latestEnrollment ? (
          <Link
            href={`/courses/${latestEnrollment.courseId}`}
            className="lg:col-span-2 bg-white rounded-xl border border-cream-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow block group"
          >
            {/* Gradient Placeholder with Overlay */}
            <div className="relative h-64 bg-gradient-to-r from-teal-700 via-teal-500 to-coral-500 overflow-hidden">
              {/* Dark overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Continue Watching Badge */}
              <div className="absolute top-4 left-4 inline-block px-3 py-1.5 bg-coral-500 text-white text-xs font-medium rounded-full">
                Continue Watching
              </div>

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white transition-all flex items-center justify-center shadow-lg group-hover:scale-110 duration-200">
                  <svg className="w-7 h-7 text-teal-700 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Content at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-heading font-bold">{latestEnrollment.course.title}</h3>
                <p className="text-sm font-body mt-1 opacity-90">
                  {latestEnrollment.course.modules?.length > 0 ? `${latestEnrollment.course.modules.length} Modules` : 'Course content'}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="p-6 space-y-3">
              <div className="w-full bg-cream-100 rounded-full h-2.5">
                <div className="bg-teal-700 h-2.5 rounded-full" style={{ width: `${latestEnrollment.progress || 0}%` }} />
              </div>
              <p className="text-xs text-teal-400 font-body">{Math.round(latestEnrollment.progress || 0)}% Complete</p>
            </div>
          </Link>
        ) : (
          <div className="lg:col-span-2 bg-white rounded-xl border border-cream-100 shadow-sm p-6 flex items-center justify-center min-h-80">
            <div className="text-center">
              <p className="text-teal-400 font-body">No courses started yet</p>
            </div>
          </div>
        )}

        {/* Right Column: 2 Stacked Cards (1/3 width on desktop) */}
        <div className="space-y-6">
          {/* Weekly Progress Card */}
          <div className="bg-teal-700 rounded-xl shadow-sm p-6 text-white">
            <h3 className="text-lg font-heading font-bold mb-4">Weekly Progress</h3>

            {/* 7-Day Bar Chart */}
            <div className="flex items-end justify-between gap-1.5 mb-6 h-20">
              {[40, 65, 50, 75, 60, 85, 55].map((height, i) => (
                <div key={i} className="flex-1 bg-white/30 rounded-t-sm hover:bg-white/50 transition-colors" style={{ height: `${(height / 100) * 100}%` }} />
              ))}
            </div>

            <div className="space-y-1 border-t border-white/20 pt-4">
              <p className="font-medium text-sm font-body">17.9 hours this week</p>
              <p className="text-xs opacity-90 font-body">+12% from last week</p>
            </div>
          </div>

          {/* Next Exam Card */}
          <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
            <h3 className="text-lg font-heading font-bold text-teal-900 mb-4">Next Exam</h3>
            <div className="space-y-3">
              <div>
                <p className="font-heading font-bold text-teal-900">Canine Behavior</p>
                <p className="text-sm text-teal-400 font-body mt-1">Dec 15, 2024 · 2:00 PM</p>
              </div>
              <button className="w-full py-2.5 bg-teal-700 hover:bg-teal-900 text-white font-heading font-medium text-sm rounded-lg transition-colors duration-200">
                Prepare Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Certification Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold text-teal-900">Enrolled Courses</h2>
          <Link href="/courses" className="text-coral-500 hover:text-coral-700 font-medium transition-colors">
            View All →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        ) : enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {enrollments.slice(0, 3).map((enrollment: any) => {
              const difficultyColors: Record<string, string> = {
                Beginner: 'teal',
                Intermediate: 'coral',
                Advanced: 'teal',
              };
              const difficulty = enrollment.course.difficulty || 'Beginner';
              const diffColor = difficultyColors[difficulty] || 'teal';

              return (
                <Link
                  key={enrollment.id}
                  href={`/courses/${enrollment.courseId}`}
                  className="bg-white rounded-xl border border-cream-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group block"
                >
                  {/* Gradient Image Placeholder */}
                  <div className="h-40 bg-gradient-to-br from-teal-500 to-teal-300 relative overflow-hidden">
                    {enrollment.completedAt && (
                      <div className="absolute top-3 left-3 inline-block px-2.5 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                        Completed
                      </div>
                    )}
                    {!enrollment.completedAt && enrollment.progress > 0 && (
                      <div className="absolute top-3 left-3 inline-block px-2.5 py-1 bg-coral-500 text-white text-xs font-medium rounded-full">
                        In Progress
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    {/* Category & Difficulty */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                        {enrollment.course.category || 'Training'}
                      </span>
                      <span className={`text-xs font-medium text-${diffColor}-400 flex items-center gap-1`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-${diffColor}-400`} />
                        {difficulty}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading font-bold text-teal-900 text-sm leading-snug line-clamp-2">
                      {enrollment.course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-teal-400 font-body line-clamp-2">
                      {enrollment.course.description || 'Course content'}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="w-full bg-cream-100 rounded-full h-2">
                        <div
                          className="bg-teal-700 h-2 rounded-full transition-all"
                          style={{ width: `${enrollment.progress || 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-teal-400 font-body">
                        {Math.round(enrollment.progress || 0)}% Complete
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-12 text-center">
            <p className="text-teal-400 font-body mb-4">No courses enrolled yet</p>
            <Link href="/courses" className="inline-block px-6 py-2 bg-teal-700 hover:bg-teal-900 text-white font-medium rounded-lg transition-colors">
              Browse Courses
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Row: Recent Activity + Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity - Placeholder (no real data source yet) */}
        <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold text-teal-900">Recent Activity</h2>
            <a href="#" className="text-teal-700 hover:text-teal-900 text-sm font-medium transition-colors">
              See All
            </a>
          </div>

          <div className="space-y-4">
            {/* Activity Item 1: Completed */}
            <div className="flex gap-4 pb-4 border-b border-cream-100 last:border-b-0 last:pb-0">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm">
                  ✓
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-teal-900 text-sm">
                  Completed: Leash Training Basics
                </p>
                <p className="text-xs text-teal-400 font-body mt-1">Module 3 · Score: 92%</p>
              </div>
              <span className="text-xs text-teal-400 font-body whitespace-nowrap">2h ago</span>
            </div>

            {/* Activity Item 2: Certificate */}
            <div className="flex gap-4 pb-4 border-b border-cream-100 last:border-b-0 last:pb-0">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center text-coral-600 text-sm">
                  🎓
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-teal-900 text-sm">
                  Earned: Basic Obedience Certificate
                </p>
                <p className="text-xs text-teal-400 font-body mt-1">Certification Achieved</p>
              </div>
              <span className="text-xs text-teal-400 font-body whitespace-nowrap">Yesterday</span>
            </div>

            {/* Activity Item 3: Discussion */}
            <div className="flex gap-4 pb-4 border-b border-cream-100 last:border-b-0 last:pb-0">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm">
                  💬
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-teal-900 text-sm">
                  New reply in: Reactive Dog Discussion
                </p>
                <p className="text-xs text-teal-400 font-body mt-1">Community Forum</p>
              </div>
              <span className="text-xs text-teal-400 font-body whitespace-nowrap">2 days ago</span>
            </div>
          </div>
        </div>

        {/* Achievements - Placeholder (no real data source yet) */}
        <div className="bg-teal-700 rounded-xl shadow-sm p-6 text-white">
          <h2 className="text-xl font-heading font-bold mb-6">Achievements</h2>

          <div className="space-y-4">
            {/* Achievement 1: Fast Learner */}
            <div className="flex gap-4 pb-4 border-b border-teal-600 last:border-b-0 last:pb-0">
              <div className="flex-shrink-0 text-2xl">🏆</div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-sm">Fast Learner</p>
                <p className="text-xs opacity-90 font-body mt-1">Complete 5 modules in a week</p>
              </div>
            </div>

            {/* Achievement 2: 7-Day Streak */}
            <div className="flex gap-4 pb-4 border-b border-teal-600 last:border-b-0 last:pb-0">
              <div className="flex-shrink-0 text-2xl">🔥</div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-sm">7-Day Streak</p>
                <p className="text-xs opacity-90 font-body mt-1">Study every day for a week</p>
              </div>
            </div>

            {/* Achievement 3: Certified Pro */}
            <div className="flex gap-4 pb-4 border-b border-teal-600 last:border-b-0 last:pb-0">
              <div className="flex-shrink-0 text-2xl">🥇</div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-sm">Certified Pro</p>
                <p className="text-xs opacity-90 font-body mt-1">Earn 3 certifications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
