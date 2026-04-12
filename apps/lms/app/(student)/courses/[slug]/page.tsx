'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.slug as string;

  const { data: course, isLoading: courseLoading, error: courseError } = trpc.course.getById.useQuery({ id: courseId });
  const { data: enrollmentData } = trpc.lms.enrollment.getEnrollment.useQuery({ courseId });


  const getLessonStatus = (lessonId: string): 'completed' | 'current' | 'locked' => {
    if (!enrollmentData?.lessonProgress) return 'locked';

    const lessonProgress = enrollmentData.lessonProgress.find((lp: any) => lp.lessonId === lessonId);
    if (!lessonProgress) return 'locked';

    if (lessonProgress.completed) return 'completed';
    if (enrollmentData.enrollment?.lastLessonId === lessonId) return 'current';

    return 'locked';
  };

  const getLessonIcon = (status: string) => {
    if (status === 'completed') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    } else if (status === 'current') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
        </svg>
      );
    }
  };


  if (courseError) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-heading font-bold text-teal-900">Course Not Found</h1>
          <p className="text-teal-700">The course you're looking for doesn't exist or you don't have access to it.</p>
          <Link href="/courses" className="inline-block px-6 py-3 bg-coral-500 hover:bg-coral-700 text-white font-medium rounded-lg transition-colors">
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <div className="bg-teal-700 text-white py-12 md:py-16 text-center">
          <div className="h-12 w-64 bg-teal-600 rounded mx-auto mb-3 animate-pulse" />
          <div className="h-6 w-96 bg-teal-600 rounded mx-auto animate-pulse" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-96 bg-cream-100 rounded-2xl animate-pulse" />
              <div className="space-y-4">
                <div className="h-8 bg-cream-100 rounded w-48 animate-pulse" />
                <div className="h-4 bg-cream-100 rounded animate-pulse" />
                <div className="h-4 bg-cream-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-cream-100 rounded-xl animate-pulse" />
              <div className="h-64 bg-cream-100 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-heading font-bold text-teal-900">Course Not Found</h1>
          <p className="text-teal-700">Unable to load course data.</p>
          <Link href="/courses" className="inline-block px-6 py-3 bg-coral-500 hover:bg-coral-700 text-white font-medium rounded-lg transition-colors">
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  const isEnrolled = enrollmentData?.enrollment;
  const overallProgress = isEnrolled ? enrollmentData.enrollment.progress : 0;
  const firstModule = course.modules?.[0];
  const firstLesson = firstModule?.lessons?.[0];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Banner */}
      <div className="bg-teal-700 text-white py-12 md:py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">{course.title}</h1>
        <p className="text-lg md:text-xl text-cream-100">{course.description || 'Master this course with expert instruction'}</p>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-cream-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-coral-500 hover:text-coral-700 transition-colors">Home</Link>
            <span className="text-teal-400">/</span>
            <Link href="/courses" className="text-coral-500 hover:text-coral-700 transition-colors">My Courses</Link>
            <span className="text-teal-400">/</span>
            <span className="text-teal-700">{course.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image Card */}
            {firstLesson && isEnrolled ? (
              <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-teal-400 to-coral-300 aspect-video flex items-center justify-center group">
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-block px-3 py-1.5 bg-coral-500 text-white text-xs font-bold rounded">
                    {firstModule?.title} — Lesson 1
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-coral-400 opacity-40" />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                  <h3 className="text-2xl font-heading font-bold mb-1">{firstLesson.title}</h3>
                  <p className="text-cream-100 text-sm">Duration: {firstLesson.duration || 0} minutes</p>
                </div>

                <Link
                  href={`/courses/${courseId}/lessons/${firstLesson.id}`}
                  className="absolute bottom-6 right-6 z-10 bg-coral-500 hover:bg-coral-700 text-white font-medium py-3 px-4 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Lesson
                </Link>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-teal-400 to-coral-300 aspect-video flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-coral-400 opacity-40" />
                <div className="text-center text-white">
                  <p className="text-lg font-medium">Enroll to view course content</p>
                </div>
              </div>
            )}

            {/* Course Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl font-heading font-bold text-teal-900">Course Overview</h2>
              <p className="text-teal-700 leading-relaxed">
                {course.description || 'No description available'}
              </p>
              {course.category && (
                <div className="flex items-center gap-2 pt-2">
                  <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full">
                    {course.category}
                  </span>
                  <span className="inline-block px-3 py-1 bg-coral-100 text-coral-700 text-xs font-semibold rounded-full">
                    {course.difficulty}
                  </span>
                </div>
              )}
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-xl border border-cream-100 p-6 shadow-sm">
              <h3 className="text-lg font-heading font-bold text-teal-900 mb-4">Course Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Category</span>
                  <span className="font-medium text-teal-900">{course.category || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Difficulty</span>
                  <span className="font-medium text-teal-900">{course.difficulty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Students Enrolled</span>
                  <span className="font-medium text-teal-900">{course.studentCount || 0}</span>
                </div>
                {course.averageRating && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-teal-600">Rating</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(course.averageRating || 0) ? 'text-yellow-400' : 'text-cream-100'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - SIDEBAR */}
          <div className="space-y-6">
            {/* Lessons in This Course */}
            <div className="bg-white rounded-xl border border-cream-100 p-6 shadow-sm">
              <h3 className="font-heading font-bold text-teal-900 mb-4">Lessons in this course</h3>
              <div className="space-y-3">
                {course.modules?.map((module: any) =>
                  module.lessons?.map((lesson: any) => {
                    const status = getLessonStatus(lesson.id);
                    return (
                      <Link
                        key={lesson.id}
                        href={`/courses/${courseId}/lessons/${lesson.id}`}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left ${
                          status === 'current'
                            ? 'bg-coral-500/10'
                            : 'hover:bg-cream-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                          status === 'completed'
                            ? 'bg-teal-700 text-white'
                            : status === 'current'
                            ? 'bg-coral-500 text-white'
                            : 'bg-cream-100 text-teal-400'
                        }`}>
                          {status === 'locked' ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                            </svg>
                          ) : (
                            getLessonIcon(status)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            status === 'completed' ? 'text-teal-600' : 'text-teal-900'
                          }`}>
                            {lesson.title}
                          </p>
                          <p className="text-xs text-teal-600">{lesson.duration || 0} min</p>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-cream-100 p-6 shadow-sm">
              <h3 className="font-heading font-bold text-teal-900 mb-4">Search Content</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search lessons..."
                  className="flex-1 px-3 py-2 border border-cream-100 rounded-lg text-teal-900 placeholder-teal-400 focus:outline-none focus:border-coral-500"
                />
                <button className="px-4 py-2 bg-coral-500 hover:bg-coral-700 text-white font-medium rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Progress or Enroll */}
            {isEnrolled ? (
              <div className="bg-teal-700 rounded-xl p-6 shadow-sm text-white">
                <h3 className="font-heading font-bold mb-4">Your Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Course Completion</span>
                      <span className="text-sm font-bold">{overallProgress || 0}%</span>
                    </div>
                    <div className="w-full bg-teal-600 rounded-full h-2">
                      <div
                        className="bg-coral-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${overallProgress || 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {enrollmentData?.enrollment?.enrolledAt && (
                      <div className="flex items-center justify-between">
                        <span>Enrolled Since</span>
                        <span className="font-bold">{new Date(enrollmentData.enrollment.enrolledAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Total Lessons</span>
                      <span className="font-bold">{course.modules?.reduce((acc: any, m: any) => acc + (m.lessons?.length || 0), 0) || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-coral-500 rounded-xl p-6 shadow-sm text-white">
                <h3 className="font-heading font-bold mb-3">Not Enrolled</h3>
                <p className="text-sm mb-4 text-coral-100">Enroll in this course to start learning and track your progress.</p>
                <button className="w-full px-4 py-3 bg-white text-coral-500 hover:bg-coral-50 font-bold rounded-lg transition-colors">
                  Enroll Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
