'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data
const lessonData = {
  id: 'l7',
  title: 'Stress Signals & Calming Signals',
  type: 'VIDEO',
  videoUrl: null, // Will be Mux playback ID
  duration: 18,
  content: `
    <h2>Understanding Stress Signals</h2>
    <p>Dogs communicate their emotional state through a variety of subtle and overt body language signals. In this lesson, we'll explore the key stress indicators and calming signals that dogs use to navigate social interactions.</p>
    <h3>Key Stress Indicators</h3>
    <p>Stress signals can be divided into displacement behaviors, appeasement gestures, and distance-increasing signals. Learning to read these accurately is fundamental to the K9 Design System approach.</p>
    <h3>Calming Signals</h3>
    <p>Norwegian dog trainer Turid Rugaas identified approximately 30 calming signals that dogs use to prevent conflict, invite play, and manage social situations. We'll cover the most common and reliable indicators.</p>
  `,
  isCompleted: false,
  hasQuiz: false,
  quizId: null,
  resources: [
    { title: 'Stress Signals Reference Card', type: 'PDF' },
    { title: 'Calming Signals Checklist', type: 'Checklist' },
  ],
};

const courseNav = {
  courseTitle: 'Foundation Course: Canine Behavior Basics',
  courseSlug: 'foundation-course',
  modules: [
    {
      title: 'Module 2: Canine Communication',
      lessons: [
        { id: 'l5', title: 'Understanding Canine Body Language', completed: true },
        { id: 'l6', title: 'Vocal Communication Patterns', completed: true },
        { id: 'l7', title: 'Stress Signals & Calming Signals', completed: false, current: true },
        { id: 'l8', title: 'Communication Worksheet', completed: false },
        { id: 'l9', title: 'Module 2 Assessment', completed: false, hasQuiz: true },
      ],
    },
  ],
  prevLesson: { id: 'l6', title: 'Vocal Communication Patterns' },
  nextLesson: { id: 'l8', title: 'Communication Worksheet' },
};

export default function LessonPage() {
  const [isCompleted, setIsCompleted] = useState(lessonData.isCompleted);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="max-w-full mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-teal-400 mb-6">
        <Link href="/courses" className="hover:text-teal-700 transition-colors">Courses</Link>
        <span>/</span>
        <Link href={`/courses/${courseNav.courseSlug}`} className="hover:text-teal-700 transition-colors">
          {courseNav.courseTitle}
        </Link>
        <span>/</span>
        <span className="text-teal-700">{lessonData.title}</span>
      </nav>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Video Player or Content */}
          {lessonData.type === 'VIDEO' ? (
            <div className="aspect-video bg-teal-900 rounded-xl flex items-center justify-center mb-6">
              <div className="text-center">
                <button className="w-16 h-16 bg-coral-500 hover:bg-coral-700 rounded-full flex items-center justify-center transition-colors shadow-lg">
                  <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <p className="text-cream-50/60 text-sm mt-3">{lessonData.duration} min</p>
              </div>
            </div>
          ) : null}

          {/* Lesson Title */}
          <h1 className="text-2xl font-heading font-bold text-teal-900 mb-4">{lessonData.title}</h1>

          {/* Text Content */}
          <div
            className="prose prose-sm max-w-none text-teal-900
              prose-headings:font-heading prose-headings:text-teal-900
              prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-3
              prose-h3:text-lg prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-2
              prose-p:text-teal-700 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-teal-700 prose-a:underline"
            dangerouslySetInnerHTML={{ __html: lessonData.content }}
          />

          {/* Lesson Resources */}
          {lessonData.resources.length > 0 && (
            <div className="mt-8 bg-white rounded-xl border border-cream-100 p-5">
              <h3 className="font-heading font-bold text-teal-900 text-sm mb-3">Lesson Resources</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {lessonData.resources.map((resource) => (
                  <button
                    key={resource.title}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-cream-50 transition-colors text-left border border-cream-100"
                  >
                    <div className="w-8 h-8 bg-cream-100 rounded-lg flex items-center justify-center">
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
          )}

          {/* Bottom Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-cream-100 pt-6">
            {courseNav.prevLesson ? (
              <Link
                href={`/courses/${courseNav.courseSlug}/lessons/${courseNav.prevLesson.id}`}
                className="flex items-center gap-2 text-sm text-teal-700 hover:text-teal-900 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <span>{courseNav.prevLesson.title}</span>
              </Link>
            ) : <div />}

            <button
              onClick={() => setIsCompleted(!isCompleted)}
              className={`px-6 py-2.5 rounded-lg font-heading font-medium text-sm transition-colors ${
                isCompleted
                  ? 'bg-teal-700 text-cream-50'
                  : 'bg-coral-500 hover:bg-coral-700 text-white'
              }`}
            >
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </button>

            {courseNav.nextLesson ? (
              <Link
                href={`/courses/${courseNav.courseSlug}/lessons/${courseNav.nextLesson.id}`}
                className="flex items-center gap-2 text-sm text-teal-700 hover:text-teal-900 transition-colors"
              >
                <span>{courseNav.nextLesson.title}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ) : <div />}
          </div>
        </div>

        {/* Lesson Sidebar — Course Navigation */}
        {sidebarOpen && (
          <aside className="hidden xl:block w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-cream-100 shadow-sm sticky top-6">
              <div className="p-4 border-b border-cream-100">
                <h3 className="font-heading font-bold text-teal-900 text-sm truncate">
                  {courseNav.courseTitle}
                </h3>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {courseNav.modules.map((module) => (
                  <div key={module.title}>
                    <div className="px-4 py-3 bg-cream-50 border-b border-cream-100">
                      <p className="text-xs font-medium text-teal-700">{module.title}</p>
                    </div>
                    {module.lessons.map((lesson) => (
                      <Link
                        key={lesson.id}
                        href={`/courses/${courseNav.courseSlug}/lessons/${lesson.id}`}
                        className={`flex items-center gap-3 px-4 py-3 text-sm border-b border-cream-100 transition-colors ${
                          lesson.current
                            ? 'bg-coral-500/5 border-l-2 border-l-coral-500'
                            : 'hover:bg-cream-50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          lesson.completed
                            ? 'bg-teal-700 text-cream-50'
                            : lesson.current
                            ? 'ring-2 ring-coral-500 bg-coral-500/10'
                            : 'border border-cream-100'
                        }`}>
                          {lesson.completed && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className={`truncate ${
                          lesson.current ? 'text-coral-500 font-medium' : lesson.completed ? 'text-teal-400' : 'text-teal-900'
                        }`}>
                          {lesson.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
