'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data
const lessonData = {
  id: 'heel-command-mastery',
  title: 'Heel Command Mastery',
  module: 'Module 2',
  lessonNumber: 3,
  duration: 45,
  videoDuration: 18,
  content: `
    <p>The heel command is one of the most important foundational skills in dog training. A solid heel creates a strong working relationship between handler and dog, ensuring safety in public spaces and building the dog's focus and responsiveness.</p>

    <h2>Understanding the Heel Position</h2>
    <p>The heel position means the dog walks beside you with their shoulder aligned with your leg. The dog's head should be level with your knee, and they should maintain this position regardless of your pace or direction changes. This position requires the dog to stay aware of your movement and adjust accordingly.</p>

    <h2>Building Foundation Through Luring</h2>
    <p>Begin by luring your dog into the heel position using high-value treats. Hold the treat close to your leg at their nose height and move forward. Reward frequently during these early sessions—every few steps at first. Consistency is critical; always practice on the same side (typically the left) until the behavior is solid before introducing variation.</p>

    <h2>Introducing Distance and Duration</h2>
    <p>Once your dog understands the basic position, gradually increase the distance and time they maintain the heel. Start with 10-foot sessions and extend to full-length walks. Layer in distractions slowly—first indoors, then in quiet outdoor spaces, then busier environments. Remember that each new environment is essentially a new training scenario for your dog.</p>
  `,
  isCompleted: false,
  resources: [
    { title: 'Stress Signals Reference Card', type: 'PDF' },
    { title: 'Calming Signals Checklist', type: 'Checklist' },
  ],
};

const courseNav = {
  courseTitle: 'Advanced Obedience Training',
  courseSlug: 'advanced-obedience-training',
  modules: [
    {
      title: 'Module 1: Sit & Stay Foundation',
      lessons: [
        { id: 'sit-basics', title: 'Sit Command Basics', completed: true },
        { id: 'sit-duration', title: 'Building Sit Duration', completed: true },
        { id: 'stay-introduction', title: 'Stay Introduction', completed: true },
      ],
    },
    {
      title: 'Module 2: Leash Work & Heel',
      lessons: [
        { id: 'loose-leash', title: 'Loose Leash Walking', completed: true },
        { id: 'vocal-communication', title: 'Vocal Communication Patterns', completed: true },
        { id: 'heel-command-mastery', title: 'Heel Command Mastery', completed: false, current: true },
        { id: 'communication-worksheet', title: 'Communication Worksheet', completed: false },
      ],
    },
  ],
  prevLesson: { id: 'vocal-communication', title: 'Vocal Communication Patterns' },
  nextLesson: { id: 'communication-worksheet', title: 'Communication Worksheet' },
};

const progress = {
  completionPercent: 62,
  lessonsCompleted: 5,
  totalLessons: 8,
  timeSpent: '2h 34m',
  estimatedRemaining: '1h 45m',
};

export default function LessonPage() {
  const [isCompleted, setIsCompleted] = useState(lessonData.isCompleted);

  return (
    <div className="min-h-screen bg-cream-50 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-coral-500 hover:text-coral-700 transition-colors">Home</Link>
          <span className="text-teal-400">/</span>
          <Link href="/courses" className="text-coral-500 hover:text-coral-700 transition-colors">My Courses</Link>
          <span className="text-teal-400">/</span>
          <Link href={`/courses/${courseNav.courseSlug}`} className="text-coral-500 hover:text-coral-700 transition-colors">
            {courseNav.courseTitle}
          </Link>
          <span className="text-teal-400">/</span>
          <span className="text-teal-900 font-medium">{lessonData.title}</span>
        </nav>

        {/* Main Layout */}
        <div className="flex gap-8">
          {/* Left Column - Main Content (65%) */}
          <div className="flex-1">
            {/* Video Player */}
            <div className="aspect-video bg-teal-900 rounded-xl flex items-center justify-center mb-8 shadow-lg">
              <div className="text-center">
                <button className="w-20 h-20 bg-coral-500 hover:bg-coral-700 rounded-full flex items-center justify-center transition-colors shadow-xl">
                  <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <p className="text-cream-50/70 text-sm mt-4">{lessonData.videoDuration} min</p>
              </div>
            </div>

            {/* Lesson Title & Info */}
            <h1 className="text-4xl font-heading font-bold text-teal-900 mb-2">{lessonData.title}</h1>
            <p className="text-teal-400 text-sm mb-8">{lessonData.module} · Lesson {lessonData.lessonNumber} · {lessonData.duration} minutes</p>

            {/* Lesson Content */}
            <div
              className="prose prose-sm max-w-none text-teal-900 mb-8
                prose-headings:font-heading prose-headings:text-teal-900
                prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                prose-p:text-teal-700 prose-p:leading-relaxed prose-p:mb-5
                prose-a:text-teal-700 prose-a:underline hover:prose-a:text-teal-900"
              dangerouslySetInnerHTML={{ __html: lessonData.content }}
            />

            {/* Lesson Resources */}
            {lessonData.resources.length > 0 && (
              <div className="mb-8">
                <h3 className="font-heading font-bold text-teal-900 text-lg mb-4">Lesson Resources</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {lessonData.resources.map((resource) => (
                    <button
                      key={resource.title}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white border border-cream-100 hover:border-teal-400 hover:shadow-md transition-all text-left"
                    >
                      <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-teal-900 truncate">{resource.title}</p>
                        <p className="text-xs text-teal-400">{resource.type}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between gap-4 border-t border-cream-100 pt-8 mt-12">
              {courseNav.prevLesson ? (
                <Link
                  href={`/courses/${courseNav.courseSlug}/lessons/${courseNav.prevLesson.id}`}
                  className="flex items-center gap-2 text-sm text-teal-700 hover:text-teal-900 transition-colors group"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  <span>Previous: {courseNav.prevLesson.title}</span>
                </Link>
              ) : <div />}

              <button
                onClick={() => setIsCompleted(!isCompleted)}
                className={`px-8 py-3 rounded-lg font-heading font-medium text-sm transition-all whitespace-nowrap ${
                  isCompleted
                    ? 'bg-teal-700 text-cream-50 hover:bg-teal-800'
                    : 'bg-coral-500 text-white hover:bg-coral-700 shadow-md'
                }`}
              >
                {isCompleted ? 'Completed ✓' : 'Mark Complete'}
              </button>

              {courseNav.nextLesson ? (
                <Link
                  href={`/courses/${courseNav.courseSlug}/lessons/${courseNav.nextLesson.id}`}
                  className="flex items-center gap-2 text-sm text-teal-700 hover:text-teal-900 transition-colors group"
                >
                  <span>Next: {courseNav.nextLesson.title}</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              ) : <div />}
            </div>
          </div>

          {/* Right Column - Sidebar (35%) */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            {/* Course Navigation */}
            <div className="bg-white rounded-xl border border-cream-100 shadow-sm sticky top-8 mb-6">
              <div className="p-5 border-b border-cream-100">
                <h3 className="font-heading font-bold text-teal-900 text-sm truncate">
                  {courseNav.courseTitle}
                </h3>
              </div>
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {courseNav.modules.map((module, moduleIdx) => (
                  <div key={module.title}>
                    <div className="px-5 py-3 bg-teal-50 border-b border-cream-100">
                      <p className="text-xs font-medium text-teal-700">{module.title}</p>
                    </div>
                    {module.lessons.map((lesson) => (
                      <Link
                        key={lesson.id}
                        href={`/courses/${courseNav.courseSlug}/lessons/${lesson.id}`}
                        className={`flex items-center gap-3 px-5 py-3 text-sm border-b border-cream-100 transition-colors ${
                          lesson.current
                            ? 'bg-coral-500/5 border-l-4 border-l-coral-500 pl-4'
                            : 'hover:bg-cream-50'
                        }`}
                      >
                        {/* Completion Indicator */}
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                          lesson.completed
                            ? 'bg-teal-700 text-cream-50'
                            : lesson.current
                            ? 'ring-2 ring-coral-500 bg-coral-500/10'
                            : 'border-2 border-cream-200'
                        }`}>
                          {lesson.completed && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className={`truncate text-xs ${
                          lesson.current ? 'text-coral-500 font-semibold' : lesson.completed ? 'text-teal-400' : 'text-teal-900'
                        }`}>
                          {lesson.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Your Progress Card */}
            <div className="bg-teal-700 text-cream-50 rounded-xl p-5 sticky top-96">
              <h3 className="font-heading font-bold text-lg mb-5">Your Progress</h3>

              {/* Progress Bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">{progress.completionPercent}% Complete</p>
                  <p className="text-xs opacity-80">{progress.lessonsCompleted}/{progress.totalLessons} lessons</p>
                </div>
                <div className="w-full h-3 bg-teal-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-coral-500 transition-all duration-500"
                    style={{ width: `${progress.completionPercent}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="opacity-90">Time spent</span>
                  <span className="font-semibold">{progress.timeSpent}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-90">Est. remaining</span>
                  <span className="font-semibold">{progress.estimatedRemaining}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
