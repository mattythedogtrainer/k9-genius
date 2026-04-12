'use client';

import { useAuth } from '@k9-genius/ui';

export default function DashboardPage() {
  const auth = useAuth();
  const userName = auth.user?.displayName || 'there';

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
        <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
          <div className="flex items-start justify-between mb-3">
            <span className="text-4xl">📚</span>
            <span className="inline-block px-2.5 py-1 bg-teal-400 text-teal-900 text-xs font-medium rounded-full">
              Active
            </span>
          </div>
          <p className="text-4xl font-heading font-bold text-teal-900">12</p>
          <p className="text-teal-400 font-body text-sm mt-1">Enrolled Courses</p>
        </div>

        {/* Card 2: Certifications */}
        <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
          <div className="flex items-start justify-between mb-3">
            <span className="text-4xl">🎓</span>
            <span className="inline-block px-2.5 py-1 bg-coral-300 text-coral-700 text-xs font-medium rounded-full">
              +2 New
            </span>
          </div>
          <p className="text-4xl font-heading font-bold text-coral-500">5</p>
          <p className="text-teal-400 font-body text-sm mt-1">Certifications</p>
        </div>

        {/* Card 3: Learning Hours */}
        <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
          <div className="flex items-start justify-between mb-3">
            <span className="text-4xl">⏱️</span>
          </div>
          <p className="text-4xl font-heading font-bold text-teal-900">48h</p>
          <p className="text-teal-400 font-body text-sm mt-1">Learning Hours</p>
        </div>

        {/* Card 4: Avg Score */}
        <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6">
          <div className="flex items-start justify-between mb-3">
            <span className="text-4xl">📊</span>
          </div>
          <p className="text-4xl font-heading font-bold text-teal-900">87%</p>
          <p className="text-teal-400 font-body text-sm mt-1">Avg. Score</p>
        </div>
      </div>

      {/* Continue Watching Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Large Course Card (2/3 width on desktop) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-cream-100 shadow-sm overflow-hidden">
          {/* Gradient Placeholder with Overlay */}
          <div className="relative h-64 bg-gradient-to-r from-teal-700 via-teal-500 to-coral-500 overflow-hidden group">
            {/* Dark overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Continue Watching Badge */}
            <div className="absolute top-4 left-4 inline-block px-3 py-1.5 bg-coral-500 text-white text-xs font-medium rounded-full">
              Continue Watching
            </div>

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 rounded-full bg-white/90 hover:bg-white transition-all flex items-center justify-center shadow-lg group-hover:scale-110 duration-200">
                <svg className="w-7 h-7 text-teal-700 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>

            {/* Content at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-heading font-bold">Advanced Obedience Training</h3>
              <p className="text-sm font-body mt-1 opacity-90">Module 4: Recall & Distance Commands</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="p-6 space-y-3">
            <div className="w-full bg-cream-100 rounded-full h-2.5">
              <div className="bg-teal-700 h-2.5 rounded-full" style={{ width: '65%' }} />
            </div>
            <p className="text-xs text-teal-400 font-body">65% Complete</p>
          </div>
        </div>

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
          <h2 className="text-2xl font-heading font-bold text-teal-900">Certification Courses</h2>
          <a href="/courses" className="text-coral-500 hover:text-coral-700 font-medium transition-colors">
            View All →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Course Card 1: Puppy Foundations */}
          <div className="bg-white rounded-xl border border-cream-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            {/* Gradient Image Placeholder */}
            <div className="h-40 bg-gradient-to-br from-coral-500 to-coral-300 relative">
              <div className="absolute top-3 left-3 inline-block px-2.5 py-1 bg-coral-500 text-white text-xs font-medium rounded-full">
                New
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 space-y-3">
              {/* Category & Difficulty */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                  Puppy Training
                </span>
                <span className="text-xs font-medium text-teal-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  Beginner
                </span>
              </div>

              {/* Title */}
              <h3 className="font-heading font-bold text-teal-900 text-sm leading-snug">
                Puppy Foundations & Socialization
              </h3>

              {/* Description */}
              <p className="text-xs text-teal-400 font-body">
                Learn essential puppy training techniques and social development
              </p>

              {/* Modules & Hours */}
              <div className="flex items-center justify-between text-xs text-teal-400 font-body pt-2">
                <span>8 Modules</span>
                <span>6.5 hrs</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 pt-2 border-t border-cream-100">
                <span className="text-sm font-heading font-bold text-teal-900">4.9</span>
                <span className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xs">★</span>
                  ))}
                </span>
              </div>

              {/* Enroll Button */}
              <button className="w-full py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-medium text-sm rounded-lg transition-colors duration-200 mt-2">
                Enroll Now
              </button>
            </div>
          </div>

          {/* Course Card 2: Agility Training */}
          <div className="bg-white rounded-xl border border-cream-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            {/* Gradient Image Placeholder */}
            <div className="h-40 bg-gradient-to-br from-teal-500 to-teal-300 relative">
              <div className="absolute top-3 left-3 inline-block px-2.5 py-1 bg-coral-500 text-white text-xs font-medium rounded-full">
                Popular
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 space-y-3">
              {/* Category & Difficulty */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                  Agility
                </span>
                <span className="text-xs font-medium text-teal-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  Intermediate
                </span>
              </div>

              {/* Title */}
              <h3 className="font-heading font-bold text-teal-900 text-sm leading-snug">
                Agility Training Certification
              </h3>

              {/* Description */}
              <p className="text-xs text-teal-400 font-body">
                Master agility obstacles and competition techniques
              </p>

              {/* Modules & Hours */}
              <div className="flex items-center justify-between text-xs text-teal-400 font-body pt-2">
                <span>12 Modules</span>
                <span>14 hrs</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 pt-2 border-t border-cream-100">
                <span className="text-sm font-heading font-bold text-teal-900">4.8</span>
                <span className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xs">★</span>
                  ))}
                </span>
              </div>

              {/* Enroll Button */}
              <button className="w-full py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-medium text-sm rounded-lg transition-colors duration-200 mt-2">
                Enroll Now
              </button>
            </div>
          </div>

          {/* Course Card 3: Canine Behavior */}
          <div className="bg-white rounded-xl border border-cream-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            {/* Gradient Image Placeholder */}
            <div className="h-40 bg-gradient-to-br from-teal-700 to-teal-500 relative">
              <div className="absolute top-3 left-3 inline-block px-2.5 py-1 bg-teal-900 text-white text-xs font-medium rounded-full">
                Advanced
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 space-y-3">
              {/* Category & Difficulty */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                  Behavior
                </span>
                <span className="text-xs font-medium text-teal-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  Advanced
                </span>
              </div>

              {/* Title */}
              <h3 className="font-heading font-bold text-teal-900 text-sm leading-snug">
                Canine Behavior & Psychology
              </h3>

              {/* Description */}
              <p className="text-xs text-teal-400 font-body">
                Deep dive into behavioral analysis and modification strategies
              </p>

              {/* Modules & Hours */}
              <div className="flex items-center justify-between text-xs text-teal-400 font-body pt-2">
                <span>16 Modules</span>
                <span>22 hrs</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 pt-2 border-t border-cream-100">
                <span className="text-sm font-heading font-bold text-teal-900">4.7</span>
                <span className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xs">★</span>
                  ))}
                </span>
              </div>

              {/* Enroll Button */}
              <button className="w-full py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-medium text-sm rounded-lg transition-colors duration-200 mt-2">
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activity + Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
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

        {/* Achievements */}
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
