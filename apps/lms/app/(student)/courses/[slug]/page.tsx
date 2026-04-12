'use client';

import { useState } from 'react';
import Link from 'next/link';

const courseData = {
  title: 'Advanced Obedience Training',
  subtitle: 'Master the fundamentals of professional dog obedience training with certified techniques',
  currentModule: 'Module 2',
  currentLesson: 'Lesson 3',
  currentLessonTitle: 'Heel Command Mastery',
  currentLessonDuration: 45,
  instructor: {
    name: 'Sarah Mitchell',
    title: 'Certified Professional Dog Trainer (CPDT-KA)',
    initials: 'SM',
    reviews: 328,
    rating: 5,
  },
  courseDescription: [
    'Advanced Obedience Training builds upon fundamental skills to develop professional-level command reliability and handler precision. This comprehensive course covers advanced techniques for teaching complex behavioral chains, distance commands, and off-leash work in distracting environments.',
    'You will learn the neuroscience behind obedience training, how to troubleshoot common behavioral issues, and how to work effectively with dogs of varying temperament and learning history. Sarah Mitchell shares decades of professional training experience, including real-world case studies and video demonstrations.',
    'By the end of this course, you will be equipped to train dogs to professional standards, manage challenging behaviors, and design customized training plans for individual dogs. This course is suitable for trainers, serious hobbyists, and professional dog handlers.',
  ],
  lessons: [
    { id: 1, title: 'Introduction to Obedience', duration: 12, status: 'completed' },
    { id: 2, title: 'Basic Sit & Stay', duration: 18, status: 'completed' },
    { id: 3, title: 'Heel Command Mastery', duration: 45, status: 'current' },
    { id: 4, title: 'Recall Training', duration: 25, status: 'locked' },
    { id: 5, title: 'Down & Place Commands', duration: 30, status: 'locked' },
    { id: 6, title: 'Distraction Proofing', duration: 35, status: 'locked' },
    { id: 7, title: 'Off-Leash Reliability', duration: 28, status: 'locked' },
    { id: 8, title: 'Certification Exam', duration: 60, status: 'locked' },
  ],
  downloads: [
    { title: 'Obedience Training Handbook', type: 'PDF', size: '2.4 MB' },
    { title: 'Heel Command Demo Video', type: 'VIDEO', size: '148 MB' },
    { title: 'Training Session Cues Audio', type: 'AUDIO', size: '16 MB' },
  ],
  progress: {
    completion: 28,
    lessonsCompleted: 2,
    totalLessons: 7,
    timeSpent: 30,
    estimatedRemaining: 200,
  },
  comments: [
    {
      id: 1,
      author: 'Jessica Chen',
      role: 'Student',
      timestamp: '2 hours ago',
      text: 'The heel command technique really clicked for me after watching the video demonstration. My dog has been doing so much better!',
      likes: 12,
      replies: [
        {
          id: 11,
          author: 'Sarah Mitchell',
          role: 'Instructor',
          timestamp: '1 hour ago',
          text: 'So glad to hear that! Consistency is key. Keep practicing in different environments to build that reliability.',
        },
      ],
    },
    {
      id: 2,
      author: 'Marcus Rodriguez',
      role: 'Certified Trainer',
      timestamp: '5 hours ago',
      text: 'Excellent breakdown of the biomechanics involved. The slow-motion footage was particularly helpful for understanding handler positioning.',
      likes: 8,
      replies: [],
    },
    {
      id: 3,
      author: 'Lisa Park',
      role: 'Student',
      timestamp: '8 hours ago',
      text: 'Does anyone have tips for dogs that lag behind during heeling? My pup seems confused about when to catch up.',
      likes: 5,
      replies: [],
    },
  ],
};

export default function CourseDetailPage() {
  const [comments, setComments] = useState(courseData.comments);
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: 'You',
        role: 'Student',
        timestamp: 'just now',
        text: newComment,
        likes: 0,
        replies: [],
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
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

  const getDownloadIcon = (type: string) => {
    if (type === 'PDF') {
      return 'bg-red-100 text-red-600';
    } else if (type === 'VIDEO') {
      return 'bg-teal-100 text-teal-700';
    } else {
      return 'bg-coral-100 text-coral-500';
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Banner */}
      <div className="bg-teal-700 text-white py-12 md:py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">{courseData.title}</h1>
        <p className="text-lg md:text-xl text-cream-100">{courseData.subtitle}</p>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-cream-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-coral-500 hover:text-coral-700 transition-colors">Home</Link>
            <span className="text-teal-400">/</span>
            <Link href="/courses" className="text-coral-500 hover:text-coral-700 transition-colors">My Courses</Link>
            <span className="text-teal-400">/</span>
            <span className="text-teal-700">{courseData.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-teal-400 to-coral-300 aspect-video flex items-center justify-center group">
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-block px-3 py-1.5 bg-coral-500 text-white text-xs font-bold rounded">
                  {courseData.currentModule} — {courseData.currentLesson}
                </span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-coral-400 opacity-40" />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                <h3 className="text-2xl font-heading font-bold mb-1">{courseData.currentLessonTitle}</h3>
                <p className="text-cream-100 text-sm">Duration: {courseData.currentLessonDuration} minutes</p>
              </div>

              <button className="absolute bottom-6 right-6 z-10 bg-coral-500 hover:bg-coral-700 text-white font-medium py-3 px-4 rounded-lg flex items-center gap-2 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play Lesson
              </button>
            </div>

            {/* Course Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl font-heading font-bold text-teal-900">Course Overview</h2>
              {courseData.courseDescription.map((para, idx) => (
                <p key={idx} className="text-teal-700 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-xl border border-cream-100 p-6 shadow-sm">
              <h3 className="text-lg font-heading font-bold text-teal-900 mb-4">Instructor</h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-teal-700 text-white flex items-center justify-center flex-shrink-0 text-xl font-bold">
                  {courseData.instructor.initials}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-teal-900">{courseData.instructor.name}</h4>
                  <p className="text-sm text-teal-600 mb-3">{courseData.instructor.title}</p>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-teal-600 ml-2">({courseData.instructor.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments & Questions */}
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-heading font-bold text-teal-900">Comments & Questions</h3>
                  <span className="inline-block px-2.5 py-0.5 bg-teal-100 text-teal-700 text-xs font-bold rounded-full">
                    {courseData.comments.length}
                  </span>
                </div>
                <Link href="#" className="text-coral-500 hover:text-coral-700 text-sm font-medium">
                  View in Community
                </Link>
              </div>

              {/* Comment Input */}
              <form onSubmit={handleCommentSubmit} className="bg-white rounded-xl border border-cream-100 p-5 shadow-sm">
                <input
                  type="text"
                  placeholder="Ask a question or leave a comment about this lesson..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-4 py-3 border border-cream-100 rounded-lg text-teal-900 placeholder-teal-400 focus:outline-none focus:border-coral-500"
                />
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-teal-600">Be respectful and constructive in your comments</p>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-coral-500 hover:bg-coral-700 text-white font-medium rounded-lg transition-colors text-sm"
                  >
                    Post
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white rounded-xl border border-cream-100 p-5 shadow-sm">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm ${
                        comment.author === 'You'
                          ? 'bg-teal-700'
                          : comment.role === 'Instructor'
                          ? 'bg-coral-500'
                          : 'bg-teal-400'
                      }`}>
                        {comment.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-teal-900">{comment.author}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            comment.role === 'Instructor'
                              ? 'bg-coral-100 text-coral-700'
                              : comment.role === 'Certified Trainer'
                              ? 'bg-teal-100 text-teal-700'
                              : 'bg-coral-100 text-coral-700'
                          }`}>
                            {comment.role}
                          </span>
                          <span className="text-xs text-teal-600">{comment.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-teal-700 text-sm mb-3">{comment.text}</p>

                    <div className="flex items-center gap-4 text-xs text-teal-600">
                      <button className="hover:text-coral-500 transition-colors flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.646 7.23a2 2 0 01-1.789 1.106H9m0 0H7.08a2 2 0 01-1.986-2.304l1.547-9.592A2 2 0 017.08 2h.5m0 0H4a2 2 0 00-2 2v12a2 2 0 002 2h4.5" />
                        </svg>
                        {comment.likes}
                      </button>
                      <button className="hover:text-coral-500 transition-colors">Reply</button>
                    </div>

                    {/* Nested Reply */}
                    {comment.replies.length > 0 && (
                      <div className="mt-4 ml-4 pt-4 border-l-2 border-cream-100 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-coral-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                              {reply.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-teal-900 text-sm">{reply.author}</span>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-coral-100 text-coral-700">
                                  {reply.role}
                                </span>
                                <span className="text-xs text-teal-600">{reply.timestamp}</span>
                              </div>
                              <p className="text-teal-700 text-sm mt-1">{reply.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - SIDEBAR */}
          <div className="space-y-6">
            {/* Lessons in This Course */}
            <div className="bg-white rounded-xl border border-cream-100 p-6 shadow-sm">
              <h3 className="font-heading font-bold text-teal-900 mb-4">Lessons in this course</h3>
              <div className="space-y-3">
                {courseData.lessons.map((lesson, idx) => (
                  <button
                    key={lesson.id}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left ${
                      lesson.status === 'current'
                        ? 'bg-coral-500/10'
                        : 'hover:bg-cream-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                      lesson.status === 'completed'
                        ? 'bg-teal-700 text-white'
                        : lesson.status === 'current'
                        ? 'bg-coral-500 text-white'
                        : 'bg-cream-100 text-teal-400'
                    }`}>
                      {lesson.status === 'locked' ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                        </svg>
                      ) : (
                        getLessonIcon(lesson.status)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        lesson.status === 'completed' ? 'text-teal-600' : 'text-teal-900'
                      }`}>
                        {lesson.title}
                      </p>
                      <p className="text-xs text-teal-600">{lesson.duration} min</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Downloads */}
            <div className="bg-white rounded-xl border border-cream-100 p-6 shadow-sm">
              <h3 className="font-heading font-bold text-teal-900 mb-4">Downloads for this course</h3>
              <div className="space-y-2">
                {courseData.downloads.map((download) => (
                  <button
                    key={download.title}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-cream-50 transition-colors text-left"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getDownloadIcon(download.type)}`}>
                      {download.type === 'PDF' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-8-6z" />
                        </svg>
                      )}
                      {download.type === 'VIDEO' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M5 3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5zm6 10l6-4v8l-6-4z" />
                        </svg>
                      )}
                      {download.type === 'AUDIO' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 3C6.48 3 2 6.24 2 10.25c0 2.12 1.12 3.95 2.76 5.15.2 1.68.92 3.15 1.96 4.32C5.44 23.16 7 24 9 24c1.27 0 2.5-.34 3.54-1.01 1.04.67 2.27 1.01 3.54 1.01 2 0 3.56-.84 4.32-2.28 1.04-1.17 1.76-2.64 1.96-4.32C20.88 14.2 22 12.37 22 10.25 22 6.24 17.52 3 12 3z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-teal-900">{download.title}</p>
                      <p className="text-xs text-teal-600">{download.size}</p>
                    </div>
                    <svg className="w-4 h-4 text-teal-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                ))}
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

            {/* Progress */}
            <div className="bg-teal-700 rounded-xl p-6 shadow-sm text-white">
              <h3 className="font-heading font-bold mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Course Completion</span>
                    <span className="text-sm font-bold">{courseData.progress.completion}%</span>
                  </div>
                  <div className="w-full bg-teal-600 rounded-full h-2">
                    <div
                      className="bg-coral-500 h-2 rounded-full"
                      style={{ width: `${courseData.progress.completion}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Lessons Completed</span>
                    <span className="font-bold">{courseData.progress.lessonsCompleted} / {courseData.progress.totalLessons}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Time Spent</span>
                    <span className="font-bold">{courseData.progress.timeSpent} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Est. Remaining</span>
                    <span className="font-bold">{Math.floor(courseData.progress.estimatedRemaining / 60)}h {courseData.progress.estimatedRemaining % 60}m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
