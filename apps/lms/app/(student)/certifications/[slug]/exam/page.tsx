'use client';

import { useState, useEffect } from 'react';
import { QuizPlayer } from '../../../../../components/quiz/QuizPlayer';

// Mock exam data
const examData = {
  id: 'cert-exam-1',
  title: 'K9 Design System Practitioner Certification Exam',
  description: 'Comprehensive assessment of your knowledge of the K9 Design System methodology.',
  passingScore: 0.8,
  showFeedback: 'AFTER_SUBMIT' as const,
  timeLimitMinutes: 60,
  questions: [
    {
      id: 'e1', type: 'MULTIPLE_CHOICE' as const, questionText: 'What are the four components of the CGPS scoring system?', points: 1,
      options: [
        { id: 'e1a', text: 'Confidence, Guidance, Practice, Skill', isCorrect: false },
        { id: 'e1b', text: 'Performance, Regulation, Environment, Consistency', isCorrect: true },
        { id: 'e1c', text: 'Communication, Goals, Progress, Success', isCorrect: false },
        { id: 'e1d', text: 'Control, Growth, Patience, Structure', isCorrect: false },
      ],
      explanation: 'CGPS stands for the four assessment dimensions: Performance, Regulation, Environment, and Consistency.',
    },
    {
      id: 'e2', type: 'TRUE_FALSE' as const, questionText: 'In the K9 Design System, regression in training always indicates a problem with the training approach.', points: 1,
      options: [
        { id: 'e2a', text: 'True', isCorrect: false },
        { id: 'e2b', text: 'False', isCorrect: true },
      ],
      explanation: 'Regression can be a natural part of the learning process. The K9 Design System recognizes that dogs may regress due to environmental changes, developmental stages, or other factors.',
    },
    {
      id: 'e3', type: 'MULTIPLE_CHOICE' as const, questionText: 'When a dog shows whale eye during a training exercise, what is the K9 Design System recommended response?', points: 1,
      options: [
        { id: 'e3a', text: 'Continue the exercise with encouragement', isCorrect: false },
        { id: 'e3b', text: 'Mark the behavior and redirect', isCorrect: false },
        { id: 'e3c', text: 'Increase distance and reduce criteria', isCorrect: true },
        { id: 'e3d', text: 'End the session immediately', isCorrect: false },
      ],
      explanation: 'The K9 Design System prioritizes the dog\'s emotional state. Whale eye indicates stress, so the appropriate response is to increase distance from the trigger and lower the difficulty.',
    },
  ],
};

export default function ExamRoomPage() {
  const [started, setStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(examData.timeLimitMinutes * 60);
  const [completed, setCompleted] = useState(false);

  // Timer
  useEffect(() => {
    if (!started || completed) return;
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, completed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-lms-bg flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-teal-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-cream-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228m0 0a6.003 6.003 0 015.54 0m0 0V4.5c0 2.108-.966 3.99-2.48 5.228M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-5.54 0" />
              </svg>
            </div>
            <h1 className="text-xl font-heading font-bold text-teal-900">{examData.title}</h1>
            <p className="text-sm text-teal-400 mt-2">{examData.description}</p>

            <div className="bg-cream-50 rounded-lg p-4 mt-6 text-left space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-teal-400">Questions</span>
                <span className="font-medium text-teal-900">{examData.questions.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-teal-400">Time Limit</span>
                <span className="font-medium text-teal-900">{examData.timeLimitMinutes} minutes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-teal-400">Passing Score</span>
                <span className="font-medium text-teal-900">{Math.round(examData.passingScore * 100)}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-teal-400">Feedback</span>
                <span className="font-medium text-teal-900">After submission</span>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-lg bg-coral-500/5 border border-coral-500/20">
              <p className="text-xs text-coral-500">
                Once you start, the timer begins and cannot be paused. Make sure you have a stable internet connection and a quiet environment.
              </p>
            </div>

            <button
              onClick={() => setStarted(true)}
              className="mt-6 w-full py-3 bg-teal-700 hover:bg-teal-900 text-cream-50 font-heading font-bold rounded-lg transition-colors"
            >
              Begin Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lms-bg">
      {/* Exam Header - Minimal, focused */}
      <header className="bg-teal-900 text-cream-50 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-cream-50 rounded flex items-center justify-center">
            <span className="text-teal-900 font-heading font-bold text-xs">K9</span>
          </div>
          <span className="text-sm font-heading font-medium">Certification Exam</span>
        </div>
        {!completed && (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
            timeRemaining < 300 ? 'bg-coral-500/20 text-coral-300' : 'bg-teal-700'
          }`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-mono text-sm font-medium">{formatTime(timeRemaining)}</span>
          </div>
        )}
      </header>

      {/* Exam Content */}
      <div className="p-6 md:p-12">
        <QuizPlayer
          quiz={examData}
          onComplete={(score, passed) => {
            setCompleted(true);
          }}
        />
        {completed && (
          <div className="max-w-2xl mx-auto mt-6 flex items-center justify-center gap-4">
            <a
              href="/certifications"
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-900 text-cream-50 font-heading font-medium text-sm rounded-lg transition-colors"
            >
              Back to Certifications
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
