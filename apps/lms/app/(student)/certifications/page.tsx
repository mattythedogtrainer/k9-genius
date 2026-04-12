'use client';

import Link from 'next/link';

export default function CertificationsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-heading font-bold text-teal-900">Certifications</h1>
        <p className="text-teal-400 mt-2 font-body text-lg">Earn professional credentials to validate your dog training expertise.</p>
      </div>

      {/* Main Content Grid: Left (2/3) + Right Sidebar (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Certification Card (Hero) */}
          <div className="bg-teal-700 rounded-xl shadow-sm p-8 text-white overflow-hidden relative">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-600/30 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-heading font-bold">K9 Professional Trainer Certification</h2>
                  </div>
                  <p className="text-white/80 text-sm font-body">Complete comprehensive training to become a certified professional dog trainer</p>
                </div>
                <span className="px-3 py-1.5 bg-coral-500 text-white text-xs font-medium rounded-full whitespace-nowrap">In Progress</span>
              </div>

              {/* Progress Section */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-body text-sm font-medium">Overall Progress</span>
                    <span className="text-2xl font-heading font-bold">42%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div className="bg-coral-500 h-3 rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>
              </div>

              {/* Requirements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/20">
                {/* Core Courses */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-body text-sm">5 Core Courses</span>
                  </div>
                  <p className="text-white/70 text-xs font-body ml-7">3 of 5 completed</p>
                </div>

                {/* Elective Courses */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-body text-sm">2 Elective Courses</span>
                  </div>
                  <p className="text-white/70 text-xs font-body ml-7">1 of 2 completed</p>
                </div>

                {/* Practical Assessment */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/20" />
                    <span className="font-body text-sm">Practical Assessment</span>
                  </div>
                  <p className="text-white/70 text-xs font-body ml-7">Not started</p>
                </div>

                {/* Final Exam */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/10" />
                    <span className="font-body text-sm opacity-60">Final Exam</span>
                  </div>
                  <p className="text-white/50 text-xs font-body ml-7">Locked</p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <button className="px-6 py-3 bg-coral-500 hover:bg-coral-700 text-white font-heading font-medium rounded-lg transition-colors duration-200">
                  Continue Learning
                </button>
              </div>
            </div>
          </div>

          {/* Available Certifications Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-teal-900">Available Certifications</h2>

            {/* Certification Cards Grid */}
            <div className="grid grid-cols-1 gap-4 space-y-0">
              {/* Card 1: K9 Behavior Specialist */}
              <div className="bg-white rounded-xl border border-cream-100 shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-coral-300 to-coral-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-heading font-bold text-teal-900">K9 Behavior Specialist</h3>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-teal-100 text-teal-700 rounded-full">Intermediate</span>
                    </div>
                    <p className="text-sm text-teal-400 font-body mb-3">Master behavioral analysis, modification techniques, and reactive dog training</p>
                    <div className="flex items-center gap-4 text-xs text-teal-400 font-body mb-4">
                      <span>6 courses</span>
                      <span>·</span>
                      <span>~80 hours</span>
                      <span>·</span>
                      <span>1,245 enrolled</span>
                    </div>
                    <button className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-heading font-medium text-sm rounded-lg transition-colors duration-200">
                      Start Pathway
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: Agility Trainer Certification */}
              <div className="bg-white rounded-xl border border-cream-100 shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-300 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-heading font-bold text-teal-900">Agility Trainer Certification</h3>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-coral-100 text-coral-700 rounded-full">Advanced</span>
                    </div>
                    <p className="text-sm text-teal-400 font-body mb-3">Teach obstacle work, competition techniques, and advanced agility training methods</p>
                    <div className="flex items-center gap-4 text-xs text-teal-400 font-body mb-4">
                      <span>5 courses</span>
                      <span>·</span>
                      <span>~60 hours</span>
                      <span>·</span>
                      <span>892 enrolled</span>
                    </div>
                    <button className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-heading font-medium text-sm rounded-lg transition-colors duration-200">
                      Start Pathway
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 3: Puppy Development Expert */}
              <div className="bg-white rounded-xl border border-cream-100 shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m0-6.75v.75m0 0h.008v.008H12v-.008zm0 0h-.008v.008H12v-.008zm0 0v-3m0 3.75A3.75 3.75 0 1115.75 9" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-heading font-bold text-teal-900">Puppy Development Expert</h3>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-teal-100 text-teal-700 rounded-full">Beginner</span>
                    </div>
                    <p className="text-sm text-teal-400 font-body mb-3">Learn puppy socialization, foundational training, and developmental milestones</p>
                    <div className="flex items-center gap-4 text-xs text-teal-400 font-body mb-4">
                      <span>4 courses</span>
                      <span>·</span>
                      <span>~40 hours</span>
                      <span>·</span>
                      <span>2,103 enrolled</span>
                    </div>
                    <button className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-heading font-medium text-sm rounded-lg transition-colors duration-200">
                      Start Pathway
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Earned Certifications Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-teal-900">Earned Certifications</h2>

            {/* Earned Certificate Card */}
            <div className="bg-white rounded-xl border-2 border-teal-700 shadow-sm p-6 relative">
              {/* Checkmark Badge */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-20 h-24 bg-gradient-to-br from-teal-100 to-teal-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-teal-200">
                  <svg className="w-10 h-10 text-teal-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26H22L17.82 12.61L20.16 18.97L12 14.62L3.84 18.97L6.18 12.61L2 8.26H8.91L12 2Z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-heading font-bold text-teal-900">Canine First Aid & Safety</h3>
                  <p className="text-sm text-teal-400 font-body mt-1">Certified on March 15, 2026</p>
                  <p className="text-xs text-teal-400 font-body mt-2">Credential ID: <span className="font-mono text-teal-700">K9CFAS-2026-4521</span></p>
                  <div className="flex gap-3 mt-4">
                    <button className="px-4 py-2 bg-teal-700 hover:bg-teal-900 text-white font-heading font-medium text-sm rounded-lg transition-colors duration-200">
                      View Certificate
                    </button>
                    <button className="px-4 py-2 border border-teal-700 text-teal-700 hover:bg-teal-50 font-heading font-medium text-sm rounded-lg transition-colors duration-200">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: Exam Schedule */}
        <div className="space-y-6">
          {/* Exam Schedule Card */}
          <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-heading font-bold text-teal-900 mb-4">Exam Schedule</h3>

            <div className="space-y-5">
              {/* Next Exam Info */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-teal-400 uppercase tracking-wide font-body">Next Available Slot</p>
                <p className="text-base font-heading font-bold text-teal-900">Apr 25, 2026</p>
                <p className="text-sm text-teal-400 font-body">2:00 PM EST</p>
              </div>

              {/* Schedule Button */}
              <button className="w-full px-4 py-3 bg-coral-500 hover:bg-coral-700 text-white font-heading font-medium text-sm rounded-lg transition-colors duration-200">
                Schedule Exam
              </button>

              {/* Requirements Checklist */}
              <div className="border-t border-cream-100 pt-5">
                <p className="text-xs font-medium text-teal-700 uppercase tracking-wide font-body mb-3">Before You Can Exam</p>
                <div className="space-y-3">
                  {/* Requirement 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-body text-teal-900">Complete all core courses</p>
                      <p className="text-xs text-teal-400 font-body">3 of 5 completed</p>
                    </div>
                  </div>

                  {/* Requirement 2 */}
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2.5 h-2.5 bg-teal-700 rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm font-body text-teal-900">Complete elective courses</p>
                      <p className="text-xs text-teal-400 font-body">1 of 2 completed</p>
                    </div>
                  </div>

                  {/* Requirement 3 */}
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2.5 h-2.5 bg-teal-400 rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm font-body text-teal-900">Pass practical assessment</p>
                      <p className="text-xs text-teal-400 font-body">Not started</p>
                    </div>
                  </div>

                  {/* Requirement 4 */}
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-teal-200 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-body text-teal-400 opacity-60">Maintain 80% avg. score</p>
                      <p className="text-xs text-teal-400 font-body">Current: 87%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-teal-50 rounded-xl border border-teal-100 p-6">
            <h4 className="text-sm font-heading font-bold text-teal-900 mb-2">Pro Tip</h4>
            <p className="text-xs text-teal-700 font-body">Complete your practical assessment at least 3 days before your scheduled exam to allow for review feedback.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
