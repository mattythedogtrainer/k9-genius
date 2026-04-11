'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data — will be replaced with tRPC queries
const courseData = {
  id: '1',
  title: 'Foundation Course: Canine Behavior Basics',
  description: 'Master the core principles of canine behavior science and the K9 Design System approach. This comprehensive course covers everything from evolutionary psychology to practical application of behavior modification techniques.',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Introduction to K9 Design System',
      lessons: [
        { id: 'l1', title: 'Welcome & Course Overview', type: 'VIDEO', duration: 12, completed: true },
        { id: 'l2', title: 'The K9 Design System Philosophy', type: 'TEXT', duration: 8, completed: true },
        { id: 'l3', title: 'Setting Up Your Training Environment', type: 'VIDEO', duration: 15, completed: true },
        { id: 'l4', title: 'Module 1 Assessment', type: 'QUIZ', duration: 10, completed: true, hasQuiz: true },
      ],
    },
    {
      id: 'm2',
      title: 'Module 2: Canine Communication',
      lessons: [
        { id: 'l5', title: 'Understanding Canine Body Language', type: 'VIDEO', duration: 20, completed: true },
        { id: 'l6', title: 'Vocal Communication Patterns', type: 'VIDEO', duration: 14, completed: true },
        { id: 'l7', title: 'Stress Signals & Calming Signals', type: 'VIDEO', duration: 18, completed: false },
        { id: 'l8', title: 'Communication Worksheet', type: 'TEXT', duration: 15, completed: false },
        { id: 'l9', title: 'Module 2 Assessment', type: 'QUIZ', duration: 10, completed: false, hasQuiz: true },
      ],
    },
    {
      id: 'm3',
      title: 'Module 3: Reading Body Language',
      lessons: [
        { id: 'l10', title: 'Posture & Movement Analysis', type: 'VIDEO', duration: 22, completed: false },
        { id: 'l11', title: 'Facial Expressions & Micro-signals', type: 'VIDEO', duration: 16, completed: false },
        { id: 'l12', title: 'Context-Dependent Interpretation', type: 'TEXT', duration: 12, completed: false },
        { id: 'l13', title: 'Practical Assessment Scenarios', type: 'VIDEO', duration: 25, completed: false },
        { id: 'l14', title: 'Module 3 Assessment', type: 'QUIZ', duration: 15, completed: false, hasQuiz: true },
      ],
    },
    {
      id: 'm4',
      title: 'Module 4: Learning Theory Foundations',
      lessons: [
        { id: 'l15', title: 'Classical & Operant Conditioning', type: 'VIDEO', duration: 20, completed: false },
        { id: 'l16', title: 'Reinforcement Schedules', type: 'VIDEO', duration: 18, completed: false },
        { id: 'l17', title: 'Applied Behavior Analysis Basics', type: 'TEXT', duration: 15, completed: false },
        { id: 'l18', title: 'Module 4 Assessment', type: 'QUIZ', duration: 10, completed: false, hasQuiz: true },
      ],
    },
  ],
  progress: 0.35,
  totalLessons: 18,
  completedLessons: 6,
  estimatedHours: 12,
  resources: [
    { title: 'Course Workbook', type: 'PDF' },
    { title: 'Body Language Reference Card', type: 'PDF' },
    { title: 'Training Log Template', type: 'Worksheet' },
  ],
};

export default function CourseDetailPage() {
  const [expandedModules, setExpandedModules] = useState<string[]>(['m2']);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
          </svg>
        );
      case 'TEXT':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        );
      case 'QUIZ':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-teal-400">
        <Link href="/courses" className="hover:text-teal-700 transition-colors">Courses</Link>
        <span>/</span>
        <span className="text-teal-700">{courseData.title}</span>
      </nav>

      {/* Course Header */}
      <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-heading font-bold text-teal-900">{courseData.title}</h1>
            <p className="text-teal-400 mt-2 leading-relaxed">{courseData.description}</p>
            <div className="flex items-center gap-6 mt-4 text-sm text-teal-400">
              <span>{courseData.modules.length} modules</span>
              <span>{courseData.totalLessons} lessons</span>
              <span>{courseData.estimatedHours}h estimated</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-teal-700">
              {courseData.completedLessons} of {courseData.totalLessons} lessons complete
            </span>
            <span className="font-medium text-coral-500">{Math.round(courseData.progress * 100)}%</span>
          </div>
          <div className="w-full bg-cream-100 rounded-full h-2.5">
            <div
              className="bg-coral-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${courseData.progress * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Module List */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-lg font-heading font-bold text-teal-900">Course Content</h2>
          {courseData.modules.map((module) => {
            const isExpanded = expandedModules.includes(module.id);
            const completedInModule = module.lessons.filter((l) => l.completed).length;
            const moduleProgress = completedInModule / module.lessons.length;

            return (
              <div key={module.id} className="bg-white rounded-xl border border-cream-100 shadow-sm overflow-hidden">
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-cream-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      moduleProgress === 1
                        ? 'bg-teal-700 text-cream-50'
                        : moduleProgress > 0
                        ? 'bg-coral-500/10 text-coral-500 ring-2 ring-coral-500'
                        : 'bg-cream-100 text-teal-400'
                    }`}>
                      {moduleProgress === 1 ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        `${completedInModule}/${module.lessons.length}`
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-teal-900 text-sm">{module.title}</h3>
                      <p className="text-xs text-teal-400 mt-0.5">
                        {module.lessons.length} lessons &middot; {module.lessons.reduce((acc, l) => acc + l.duration, 0)} min
                      </p>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-teal-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* Lesson List */}
                {isExpanded && (
                  <div className="border-t border-cream-100">
                    {module.lessons.map((lesson, index) => (
                      <Link
                        key={lesson.id}
                        href={`/courses/foundation-course/lessons/${lesson.id}`}
                        className="flex items-center gap-4 px-5 py-3.5 hover:bg-cream-50 transition-colors border-b border-cream-100 last:border-b-0"
                      >
                        {/* Completion indicator */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          lesson.completed
                            ? 'bg-teal-700 text-cream-50'
                            : 'border-2 border-cream-100'
                        }`}>
                          {lesson.completed && (
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>

                        {/* Type icon */}
                        <span className={lesson.completed ? 'text-teal-400' : 'text-teal-700'}>
                          {getTypeIcon(lesson.type)}
                        </span>

                        {/* Lesson info */}
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${lesson.completed ? 'text-teal-400' : 'text-teal-900'}`}>
                            {lesson.title}
                          </p>
                        </div>

                        {/* Duration */}
                        <span className="text-xs text-teal-400">{lesson.duration} min</span>

                        {/* Quiz badge */}
                        {lesson.hasQuiz && (
                          <span className="px-2 py-0.5 text-xs bg-coral-500/10 text-coral-500 rounded-full font-medium">
                            Quiz
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Continue Button */}
          <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-5">
            <button className="w-full py-3 bg-teal-700 hover:bg-teal-900 text-cream-50 font-heading font-medium rounded-lg transition-colors">
              Continue Learning
            </button>
            <p className="text-xs text-teal-400 text-center mt-2">
              Next: Stress Signals & Calming Signals
            </p>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-5">
            <h3 className="font-heading font-bold text-teal-900 text-sm mb-3">Course Resources</h3>
            <div className="space-y-2">
              {courseData.resources.map((resource) => (
                <button
                  key={resource.title}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-cream-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-cream-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-teal-900">{resource.title}</p>
                    <p className="text-xs text-teal-400">{resource.type}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Certificate Eligibility */}
          <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-5">
            <h3 className="font-heading font-bold text-teal-900 text-sm mb-2">Certificate</h3>
            <p className="text-xs text-teal-400">Complete all modules and quizzes to earn your course completion certificate.</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-teal-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span>Locked — 65% remaining</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
