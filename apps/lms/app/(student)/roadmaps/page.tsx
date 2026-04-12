'use client';

import Link from 'next/link';
import React from 'react';

interface RoadmapStep {
  number: number;
  title: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'completed' | 'in-progress' | 'locked';
  progress?: number;
}

const primaryRoadmapSteps: RoadmapStep[] = [
  {
    number: 1,
    title: 'Canine Behavior Basics',
    duration: '12h',
    difficulty: 'Beginner',
    status: 'completed',
  },
  {
    number: 2,
    title: 'Learning Theory & Training Methods',
    duration: '10h',
    difficulty: 'Beginner',
    status: 'completed',
  },
  {
    number: 3,
    title: 'Puppy Development & Socialization',
    duration: '8h',
    difficulty: 'Beginner',
    status: 'completed',
  },
  {
    number: 4,
    title: 'Basic Obedience Foundations',
    duration: '14h',
    difficulty: 'Intermediate',
    status: 'completed',
  },
  {
    number: 5,
    title: 'Advanced Obedience Techniques',
    duration: '16h',
    difficulty: 'Intermediate',
    status: 'completed',
  },
  {
    number: 6,
    title: 'Reactivity & Behavior Modification',
    duration: '18h',
    difficulty: 'Advanced',
    status: 'in-progress',
    progress: 65,
  },
  {
    number: 7,
    title: 'Service Dog Foundation',
    duration: '24h',
    difficulty: 'Advanced',
    status: 'in-progress',
    progress: 20,
  },
  {
    number: 8,
    title: 'Assessment & Client Communication',
    duration: '10h',
    difficulty: 'Intermediate',
    status: 'in-progress',
    progress: 5,
  },
  {
    number: 9,
    title: 'Practical Skills Assessment',
    duration: '8h',
    difficulty: 'Advanced',
    status: 'locked',
  },
  {
    number: 10,
    title: 'Case Study Portfolio',
    duration: '20h',
    difficulty: 'Advanced',
    status: 'locked',
  },
  {
    number: 11,
    title: 'Final Certification Exam',
    duration: '4h',
    difficulty: 'Advanced',
    status: 'locked',
  },
  {
    number: 12,
    title: 'Continuing Education Plan',
    duration: '6h',
    difficulty: 'Intermediate',
    status: 'locked',
  },
];

function getDifficultyColor(
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
): string {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-teal-100 text-teal-700';
    case 'Intermediate':
      return 'bg-coral-300 text-coral-700';
    case 'Advanced':
      return 'bg-coral-500 text-cream-50';
    default:
      return 'bg-cream-100 text-teal-400';
  }
}

function getStatusIcon(status: string): React.ReactNode {
  if (status === 'completed') {
    return (
      <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-cream-50"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  }
  if (status === 'in-progress') {
    return (
      <div className="w-10 h-10 rounded-full border-4 border-coral-500 flex items-center justify-center bg-coral-50">
        <div className="w-2 h-2 rounded-full bg-coral-500" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full border-2 border-cream-100 flex items-center justify-center bg-cream-50">
      <svg
        className="w-5 h-5 text-teal-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M3 6a3 3 0 013-3h10a1 1 0 01.82 1.573l-12 8A3 3 0 003 6zm14-1h2.207l-5.25 3.5a1 1 0 01-1.414 0L8 5.414V12a3 3 0 003 3h6a3 3 0 003-3V5a3 3 0 00-3-3z" />
      </svg>
    </div>
  );
}

export default function RoadmapsPage() {
  const completedSteps = primaryRoadmapSteps.filter(
    (s) => s.status === 'completed'
  ).length;
  const inProgressSteps = primaryRoadmapSteps.filter(
    (s) => s.status === 'in-progress'
  ).length;
  const lockedSteps = primaryRoadmapSteps.filter(
    (s) => s.status === 'locked'
  ).length;
  const overallProgress = Math.round(
    (completedSteps / primaryRoadmapSteps.length) * 100
  );

  return (
    <div className="min-h-screen bg-cream-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-teal-900 mb-2">
            Training Roadmap
          </h1>
          <p className="text-lg text-teal-700">
            Your personalized learning pathway to K9 certification.
          </p>
        </div>

        {/* Active Roadmap Card */}
        <div className="bg-white rounded-xl shadow-md border border-cream-100 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-heading font-bold text-teal-900 mb-1">
                K9 Professional Certification Pathway
              </h2>
              <p className="text-teal-700">Progress toward your certification</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-3xl font-heading font-bold text-coral-500 mb-1">
                {overallProgress}%
              </div>
              <p className="text-sm text-teal-400">Complete</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-teal-900">Overall Progress</span>
              <span className="text-sm text-teal-400">
                {completedSteps} of {primaryRoadmapSteps.length} steps
              </span>
            </div>
            <div className="h-3 bg-cream-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-700 to-teal-600 transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-cream-50 rounded-lg p-4">
              <p className="text-2xl font-heading font-bold text-teal-900 mb-1">
                {primaryRoadmapSteps.length}
              </p>
              <p className="text-sm text-teal-700">Total Steps</p>
            </div>
            <div className="bg-teal-50 rounded-lg p-4">
              <p className="text-2xl font-heading font-bold text-teal-700 mb-1">
                {completedSteps}
              </p>
              <p className="text-sm text-teal-700">Completed</p>
            </div>
            <div className="bg-coral-50 rounded-lg p-4">
              <p className="text-2xl font-heading font-bold text-coral-500 mb-1">
                {inProgressSteps}
              </p>
              <p className="text-sm text-coral-700">In Progress</p>
            </div>
            <div className="bg-cream-100 rounded-lg p-4">
              <p className="text-2xl font-heading font-bold text-teal-400 mb-1">
                {lockedSteps}
              </p>
              <p className="text-sm text-teal-700">Locked</p>
            </div>
          </div>

          {/* Completion Time */}
          <div className="mt-6 pt-6 border-t border-cream-100">
            <p className="text-sm text-teal-700">
              <span className="font-medium">Estimated completion:</span> 8 weeks
              remaining
            </p>
          </div>
        </div>

        {/* Main Layout: Timeline + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline Section */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Timeline Track */}
              <div className="absolute left-5 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-700 via-coral-500 to-cream-100" />

              {/* Steps */}
              <div className="space-y-6">
                {primaryRoadmapSteps.map((step, index) => {
                  const isLast = index === primaryRoadmapSteps.length - 1;
                  return (
                    <div key={step.number} className="relative pl-24">
                      {/* Status Icon */}
                      <div className="absolute left-0 top-0">
                        {getStatusIcon(step.status)}
                      </div>

                      {/* Step Card */}
                      <div
                        className={`rounded-lg border p-5 transition-all ${
                          step.status === 'locked'
                            ? 'bg-cream-50 border-cream-100'
                            : 'bg-white border-cream-100 shadow-sm hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-heading font-bold text-teal-400 uppercase">
                                Step {step.number}
                              </span>
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded ${getDifficultyColor(
                                  step.difficulty
                                )}`}
                              >
                                {step.difficulty}
                              </span>
                            </div>
                            <h3 className="text-base font-heading font-bold text-teal-900">
                              {step.title}
                            </h3>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <p className="text-sm font-medium text-teal-700">
                              {step.duration}
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar for In-Progress Items */}
                        {step.status === 'in-progress' && step.progress !== undefined && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-teal-600">
                                Progress
                              </span>
                              <span className="text-xs font-medium text-coral-500">
                                {step.progress}%
                              </span>
                            </div>
                            <div className="h-2 bg-cream-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-coral-500 transition-all duration-300"
                                style={{ width: `${step.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Status Text */}
                        {step.status === 'locked' && (
                          <p className="text-xs text-teal-400 mt-2">
                            Locked until previous steps are completed
                          </p>
                        )}
                        {step.status === 'completed' && (
                          <p className="text-xs text-teal-600 mt-2">
                            Completed
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Progress Stats Card */}
              <div className="bg-white rounded-lg border border-cream-100 shadow-sm p-6">
                <h3 className="text-lg font-heading font-bold text-teal-900 mb-5">
                  Your Progress
                </h3>
                <div className="space-y-4">
                  <div className="pb-4 border-b border-cream-100">
                    <p className="text-sm text-teal-700 mb-1">Total Hours Completed</p>
                    <p className="text-3xl font-heading font-bold text-teal-900">
                      48<span className="text-lg text-teal-400">h</span>
                    </p>
                  </div>
                  <div className="pb-4 border-b border-cream-100">
                    <p className="text-sm text-teal-700 mb-1">Current Streak</p>
                    <p className="text-3xl font-heading font-bold text-coral-500">
                      12<span className="text-lg text-coral-300">d</span>
                    </p>
                  </div>
                  <div className="pb-4 border-b border-cream-100">
                    <p className="text-sm text-teal-700 mb-1">Certificates Earned</p>
                    <p className="text-3xl font-heading font-bold text-teal-900">
                      0
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-teal-700 mb-2">Next Milestone</p>
                    <div className="bg-coral-50 border border-coral-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-coral-700">
                        Complete Reactivity module
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Roadmap Card */}
              <div className="bg-white rounded-lg border border-cream-100 shadow-sm p-6">
                <h3 className="text-lg font-heading font-bold text-teal-900 mb-2">
                  Agility Specialist Track
                </h3>
                <p className="text-sm text-teal-400 mb-4">
                  8 steps • Not started
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 h-2 bg-cream-100 rounded-full" />
                </div>
                <button className="w-full py-2.5 text-sm font-heading font-medium rounded-lg bg-teal-700 text-cream-50 hover:bg-teal-900 transition-colors">
                  Start this Roadmap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
