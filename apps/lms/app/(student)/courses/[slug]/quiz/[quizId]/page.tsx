'use client';

import { useState } from 'react';
import Link from 'next/link';
import { QuizPlayer } from '../../../../../../components/quiz/QuizPlayer';

// Mock quiz data
const quizData = {
  id: 'quiz-m2',
  title: 'Module 2 Assessment: Canine Communication',
  description: 'Test your understanding of canine body language and communication signals.',
  passingScore: 0.7,
  showFeedback: 'AFTER_EACH' as const,
  questions: [
    {
      id: 'q1',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Which of the following is considered a calming signal in dogs?',
      options: [
        { id: 'q1a', text: 'Growling with bared teeth', isCorrect: false },
        { id: 'q1b', text: 'Yawning when not tired', isCorrect: true },
        { id: 'q1c', text: 'Lunging forward on leash', isCorrect: false },
        { id: 'q1d', text: 'Tail tucked tightly between legs', isCorrect: false },
      ],
      explanation: 'Yawning when not tired is one of the most common calming signals identified by Turid Rugaas. Dogs use it to diffuse tension and signal peaceful intent.',
      points: 1,
    },
    {
      id: 'q2',
      type: 'TRUE_FALSE' as const,
      questionText: 'A wagging tail always indicates a happy, friendly dog.',
      options: [
        { id: 'q2a', text: 'True', isCorrect: false },
        { id: 'q2b', text: 'False', isCorrect: true },
      ],
      explanation: 'Tail wagging communicates arousal and emotional state, but not necessarily happiness. The speed, height, and direction of the wag all carry different meanings.',
      points: 1,
    },
    {
      id: 'q3',
      type: 'MULTI_SELECT' as const,
      questionText: 'Which of the following are displacement behaviors that may indicate stress? (Select all that apply)',
      options: [
        { id: 'q3a', text: 'Scratching when not itchy', isCorrect: true },
        { id: 'q3b', text: 'Lip licking without food present', isCorrect: true },
        { id: 'q3c', text: 'Relaxed open-mouth panting', isCorrect: false },
        { id: 'q3d', text: 'Sudden sniffing the ground', isCorrect: true },
      ],
      explanation: 'Scratching, lip licking, and sudden ground sniffing are all common displacement behaviors. Relaxed panting is typically a sign of comfort, not stress.',
      points: 1,
    },
    {
      id: 'q4',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'What does a "whale eye" (showing the whites of the eyes) typically indicate in a dog?',
      options: [
        { id: 'q4a', text: 'Curiosity and interest', isCorrect: false },
        { id: 'q4b', text: 'Relaxation and comfort', isCorrect: false },
        { id: 'q4c', text: 'Stress, anxiety, or discomfort', isCorrect: true },
        { id: 'q4d', text: 'Playfulness and excitement', isCorrect: false },
      ],
      explanation: 'Whale eye (half-moon eye) occurs when a dog turns their head but keeps their eyes fixed on something, showing the sclera. It typically indicates discomfort, anxiety, or a warning.',
      points: 1,
    },
    {
      id: 'q5',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'In the K9 Design System, what is the recommended first response when you observe multiple stress signals in a dog during a training session?',
      options: [
        { id: 'q5a', text: 'Push through the exercise to build resilience', isCorrect: false },
        { id: 'q5b', text: 'Immediately end the session', isCorrect: false },
        { id: 'q5c', text: 'Increase the distance from the stressor and reduce difficulty', isCorrect: true },
        { id: 'q5d', text: 'Offer high-value treats to counter-condition', isCorrect: false },
      ],
      explanation: 'The K9 Design System prioritizes reading the dog and adjusting the environment. The first response is to increase distance and reduce difficulty to bring the dog below threshold.',
      points: 1,
    },
  ],
};

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!started) {
    return (
      <div className="max-w-lg mx-auto py-12">
        <nav className="flex items-center gap-2 text-sm text-teal-400 mb-8">
          <Link href="/courses" className="hover:text-teal-700">Courses</Link>
          <span>/</span>
          <span className="text-teal-700">Quiz</span>
        </nav>

        <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-coral-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-coral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-xl font-heading font-bold text-teal-900">{quizData.title}</h1>
          <p className="text-sm text-teal-400 mt-2">{quizData.description}</p>

          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-teal-400">
            <div>
              <p className="font-heading font-bold text-teal-700 text-lg">{quizData.questions.length}</p>
              <p>Questions</p>
            </div>
            <div className="w-px h-8 bg-cream-100" />
            <div>
              <p className="font-heading font-bold text-teal-700 text-lg">{Math.round(quizData.passingScore * 100)}%</p>
              <p>To Pass</p>
            </div>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="mt-8 px-8 py-3 bg-coral-500 hover:bg-coral-700 text-white font-heading font-medium rounded-lg transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <QuizPlayer
        quiz={quizData}
        onComplete={(score, passed) => {
          setCompleted(true);
          console.log('Quiz complete:', { score, passed });
        }}
      />
      {completed && (
        <div className="max-w-2xl mx-auto mt-6 flex items-center justify-center gap-4">
          <Link
            href="/courses/foundation-course"
            className="px-6 py-2.5 bg-teal-700 hover:bg-teal-900 text-cream-50 font-heading font-medium text-sm rounded-lg transition-colors"
          >
            Back to Course
          </Link>
        </div>
      )}
    </div>
  );
}
