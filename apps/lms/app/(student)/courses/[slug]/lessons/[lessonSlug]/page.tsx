'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc';

export default function LessonPage() {
  const params = useParams();
  const courseId = params.slug as string;
  const lessonId = params.lessonSlug as string;

  // Fetch lesson data
  const { data, isLoading, error } = trpc.lms.lesson.getLesson.useQuery({ lessonId });

  // Mark complete mutation
  const utils = trpc.useUtils();
  const markCompleteMutation = trpc.lms.lesson.markComplete.useMutation({
    onSuccess: () => {
      utils.lms.lesson.getLesson.invalidate({ lessonId });
    },
  });

  // Derive previous and next lessons from course data
  const allLessons = data?.course?.modules
    ?.flatMap((module: any) => module.lessons || [])
    .map((lesson: any, idx: any) => ({ ...lesson, index: idx })) || [];

  const currentLessonIndex = allLessons.findIndex((l: any) => l.id === lessonId);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1
    ? allLessons[currentLessonIndex + 1]
    : null;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            <div className="flex-1">
              <div className="aspect-video bg-cream-100 rounded-xl animate-pulse mb-8" />
              <div className="h-10 bg-cream-100 rounded animate-pulse mb-4" />
              <div className="h-4 bg-cream-100 rounded animate-pulse mb-8 w-1/3" />
              <div className="space-y-4">
                <div className="h-4 bg-cream-100 rounded animate-pulse" />
                <div className="h-4 bg-cream-100 rounded animate-pulse" />
                <div className="h-4 bg-cream-100 rounded animate-pulse w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data?.lesson) {
    return (
      <div className="min-h-screen bg-cream-50 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl p-8 border border-cream-100">
            <h1 className="text-2xl font-heading font-bold text-teal-900 mb-2">Lesson Not Found</h1>
            <p className="text-teal-700 mb-6">This lesson could not be loaded. Please try again or return to your courses.</p>
            <Link href="/courses" className="text-coral-500 hover:text-coral-700 font-medium transition-colors">
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const lesson = data.lesson;
  const module = data.module;
  const course = data.course;
  const resources = data.resources || [];
  const progress = data.progress;

  return (
    <div className="min-h-screen bg-cream-50 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-coral-500 hover:text-coral-700 transition-colors">Home</Link>
          <span className="text-teal-400">/</span>
          <Link href="/courses" className="text-coral-500 hover:text-coral-700 transition-colors">My Courses</Link>
          <span className="text-teal-400">/</span>
          <Link href={`/courses/${courseId}`} className="text-coral-500 hover:text-coral-700 transition-colors">
            {course?.title}
          </Link>
          <span className="text-teal-400">/</span>
          <span className="text-teal-900 font-medium">{lesson.title}</span>
        </nav>

        {/* Main Layout */}
        <div className="flex gap-8">
          {/* Left Column - Main Content (65%) */}
          <div className="flex-1">
            {/* Video Player */}
            {lesson.videoUrl ? (
              <div className="aspect-video bg-teal-900 rounded-xl overflow-hidden mb-8 shadow-lg">
                <video
                  src={lesson.videoUrl}
                  controls
                  className="w-full h-full"
                  onPlay={() => {
                    // Track video progress on play
                    const handleTimeUpdate = (e: any) => {
                      const video = e.target as HTMLVideoElement;
                      if (video.duration) {
                        const watchedPct = Math.round((video.currentTime / video.duration) * 100);
                        if (watchedPct % 10 === 0) {
                          // Update every 10%
                          markCompleteMutation.mutate({ lessonId });
                        }
                      }
                    };
                    const videoElement = document.querySelector('video');
                    if (videoElement) {
                      videoElement.addEventListener('timeupdate', handleTimeUpdate);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="aspect-video bg-teal-900 rounded-xl flex items-center justify-center mb-8 shadow-lg">
                <div className="text-center">
                  <svg className="w-16 h-16 text-cream-50/40 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-3-3m3 3l3-3M3 15h18a3 3 0 003-3V3a3 3 0 00-3-3H3a3 3 0 00-3 3v9a3 3 0 003 3z" />
                  </svg>
                  <p className="text-cream-50/70 text-sm">No video available for this lesson</p>
                </div>
              </div>
            )}

            {/* Lesson Title & Info */}
            <h1 className="text-4xl font-heading font-bold text-teal-900 mb-2">{lesson.title}</h1>
            <p className="text-teal-400 text-sm mb-8">
              {module?.title} · {lesson.duration ? `${lesson.duration} minutes` : 'Duration not specified'}
            </p>

            {/* Lesson Content */}
            {lesson.content && (
              <div
                className="prose prose-sm max-w-none text-teal-900 mb-8
                  prose-headings:font-heading prose-headings:text-teal-900
                  prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                  prose-p:text-teal-700 prose-p:leading-relaxed prose-p:mb-5
                  prose-a:text-teal-700 prose-a:underline hover:prose-a:text-teal-900"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            )}

            {/* Lesson Resources */}
            {resources.length > 0 && (
              <div className="mb-8">
                <h3 className="font-heading font-bold text-teal-900 text-lg mb-4">Lesson Resources</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {resources.map((resource: any) => (
                    <a
                      key={resource.id}
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-white border border-cream-100 hover:border-teal-400 hover:shadow-md transition-all text-left"
                    >
                      <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-teal-900 truncate">{resource.title}</p>
                        <p className="text-xs text-teal-400">
                          {resource.type}
                          {resource.fileSizeBytes && ` · ${(resource.fileSizeBytes / 1024 / 1024).toFixed(1)} MB`}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between gap-4 border-t border-cream-100 pt-8 mt-12">
              {prevLesson ? (
                <Link
                  href={`/courses/${courseId}/lessons/${prevLesson.id}`}
                  className="flex items-center gap-2 text-sm text-teal-700 hover:text-teal-900 transition-colors group"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  <span>Previous: {prevLesson.title}</span>
                </Link>
              ) : <div />}

              <button
                onClick={() => markCompleteMutation.mutate({ lessonId })}
                disabled={markCompleteMutation.isPending}
                className={`px-8 py-3 rounded-lg font-heading font-medium text-sm transition-all whitespace-nowrap ${
                  progress?.completed
                    ? 'bg-teal-700 text-cream-50 hover:bg-teal-800'
                    : 'bg-coral-500 text-white hover:bg-coral-700 shadow-md disabled:opacity-50'
                }`}
              >
                {markCompleteMutation.isPending ? 'Marking...' : progress?.completed ? 'Completed ✓' : 'Mark Complete'}
              </button>

              {nextLesson ? (
                <Link
                  href={`/courses/${courseId}/lessons/${nextLesson.id}`}
                  className="flex items-center gap-2 text-sm text-teal-700 hover:text-teal-900 transition-colors group"
                >
                  <span>Next: {nextLesson.title}</span>
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
                  {course?.title}
                </h3>
              </div>
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {course?.modules?.map((module: any) => (
                  <div key={module.id}>
                    <div className="px-5 py-3 bg-teal-50 border-b border-cream-100">
                      <p className="text-xs font-medium text-teal-700">{module.title}</p>
                    </div>
                    {module.lessons?.map((moduleLesson: any) => {
                      const isCurrentLesson = moduleLesson.id === lessonId;
                      return (
                        <Link
                          key={moduleLesson.id}
                          href={`/courses/${courseId}/lessons/${moduleLesson.id}`}
                          className={`flex items-center gap-3 px-5 py-3 text-sm border-b border-cream-100 transition-colors ${
                            isCurrentLesson
                              ? 'bg-coral-500/5 border-l-4 border-l-coral-500 pl-4'
                              : 'hover:bg-cream-50'
                          }`}
                        >
                          {/* Completion Indicator */}
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                            moduleLesson.completed
                              ? 'bg-teal-700 text-cream-50'
                              : isCurrentLesson
                              ? 'ring-2 ring-coral-500 bg-coral-500/10'
                              : 'border-2 border-cream-200'
                          }`}>
                            {moduleLesson.completed && (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className={`truncate text-xs ${
                            isCurrentLesson ? 'text-coral-500 font-semibold' : moduleLesson.completed ? 'text-teal-400' : 'text-teal-900'
                          }`}>
                            {moduleLesson.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Your Progress Card */}
            {data && (
              <div className="bg-teal-700 text-cream-50 rounded-xl p-5 sticky top-96">
                <h3 className="font-heading font-bold text-lg mb-5">Your Progress</h3>

                {/* Progress Bar */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{Math.round((data.course?.modules?.reduce((acc: any, m: any) => acc + (m.lessons?.length || 0), 0) || 0) > 0 ? (allLessons.filter((l: any) => l.completed).length / allLessons.length) * 100 : 0)}% Complete</p>
                    <p className="text-xs opacity-80">{allLessons.filter((l: any) => l.completed).length}/{allLessons.length} lessons</p>
                  </div>
                  <div className="w-full h-3 bg-teal-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-coral-500 transition-all duration-500"
                      style={{
                        width: allLessons.length > 0
                          ? `${(allLessons.filter((l: any) => l.completed).length / allLessons.length) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="opacity-90">Current lesson</span>
                    <span className="font-semibold text-xs">{progress?.completed ? 'Completed' : 'In Progress'}</span>
                  </div>
                  {progress?.completedAt && (
                    <div className="flex justify-between items-center">
                      <span className="opacity-90">Completed</span>
                      <span className="font-semibold text-xs">{new Date(progress.completedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
