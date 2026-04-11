'use client';

import { useState } from 'react';

type QuestionOption = {
  id: string;
  text: string;
  isCorrect?: boolean;
};

type Question = {
  id: string;
  type: 'MULTIPLE_CHOICE' | 'MULTI_SELECT' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  questionText: string;
  options?: QuestionOption[];
  explanation?: string;
  points: number;
};

type QuizConfig = {
  id: string;
  title: string;
  description?: string;
  passingScore: number;
  showFeedback: 'AFTER_EACH' | 'AFTER_SUBMIT' | 'NONE';
  questions: Question[];
  timeLimitMinutes?: number;
};

type Answer = {
  questionId: string;
  selectedOptionIds?: string[];
  textAnswer?: string;
  isCorrect?: boolean;
};

export function QuizPlayer({
  quiz,
  onComplete,
}: {
  quiz: QuizConfig;
  onComplete?: (score: number, passed: boolean, answers: Answer[]) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textAnswer, setTextAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quiz.questions[currentIndex];
  const progress = (currentIndex + 1) / quiz.questions.length;
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);

  const handleSelectOption = (optionId: string) => {
    if (showFeedback || isSubmitted) return;

    if (currentQuestion.type === 'MULTI_SELECT') {
      setSelectedOptions(prev =>
        prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleConfirmAnswer = () => {
    const answer: Answer = {
      questionId: currentQuestion.id,
      selectedOptionIds: currentQuestion.type !== 'SHORT_ANSWER' ? selectedOptions : undefined,
      textAnswer: currentQuestion.type === 'SHORT_ANSWER' ? textAnswer : undefined,
    };

    // Check correctness
    if (currentQuestion.options) {
      const correctIds = currentQuestion.options.filter(o => o.isCorrect).map(o => o.id);
      answer.isCorrect =
        correctIds.length === selectedOptions.length &&
        correctIds.every(id => selectedOptions.includes(id));
    }

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (quiz.showFeedback === 'AFTER_EACH') {
      setShowFeedback(true);
    } else {
      goToNext(newAnswers);
    }
  };

  const goToNext = (currentAnswers: Answer[]) => {
    setShowFeedback(false);
    setSelectedOptions([]);
    setTextAnswer('');

    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Quiz complete
      const correctCount = currentAnswers.filter(a => a.isCorrect).length;
      const finalScore = correctCount / quiz.questions.length;
      const passed = finalScore >= quiz.passingScore;
      setScore(finalScore);
      setIsSubmitted(true);
      onComplete?.(finalScore, passed, currentAnswers);
    }
  };

  // Results screen
  if (isSubmitted) {
    const passed = score >= quiz.passingScore;
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
          passed ? 'bg-teal-700' : 'bg-coral-500'
        }`}>
          {passed ? (
            <svg className="w-10 h-10 text-cream-50" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <h2 className="text-2xl font-heading font-bold text-teal-900">
          {passed ? 'Great work!' : 'Keep practicing'}
        </h2>
        <p className="text-teal-400 mt-2">
          You scored {Math.round(score * 100)}% — {passed ? 'You passed!' : `${Math.round(quiz.passingScore * 100)}% needed to pass.`}
        </p>
        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          <div className="bg-cream-100 rounded-lg px-4 py-2">
            <span className="text-teal-400">Correct</span>
            <p className="font-heading font-bold text-teal-700">{answers.filter(a => a.isCorrect).length}/{quiz.questions.length}</p>
          </div>
          <div className="bg-cream-100 rounded-lg px-4 py-2">
            <span className="text-teal-400">Score</span>
            <p className="font-heading font-bold text-coral-500">{Math.round(score * 100)}%</p>
          </div>
        </div>

        {/* Answer Review */}
        {quiz.showFeedback !== 'NONE' && (
          <div className="mt-8 text-left space-y-3">
            <h3 className="font-heading font-bold text-teal-900 text-sm">Review</h3>
            {quiz.questions.map((q, i) => {
              const ans = answers.find(a => a.questionId === q.id);
              return (
                <div key={q.id} className={`p-4 rounded-lg border ${
                  ans?.isCorrect ? 'border-teal-700/20 bg-teal-700/5' : 'border-coral-500/20 bg-coral-500/5'
                }`}>
                  <p className="text-sm font-medium text-teal-900">
                    {i + 1}. {q.questionText}
                  </p>
                  {q.explanation && (
                    <p className="text-xs text-teal-400 mt-1">{q.explanation}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-teal-400 mb-2">
          <span>Question {currentIndex + 1} of {quiz.questions.length}</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="w-full bg-cream-100 rounded-full h-2">
          <div
            className="bg-coral-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl border border-cream-100 shadow-sm p-8">
        <h3 className="text-lg font-heading font-bold text-teal-900 mb-6">
          {currentQuestion.questionText}
        </h3>

        {/* Options */}
        {(currentQuestion.type === 'MULTIPLE_CHOICE' || currentQuestion.type === 'MULTI_SELECT' || currentQuestion.type === 'TRUE_FALSE') && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptions.includes(option.id);
              const showCorrect = showFeedback && option.isCorrect;
              const showIncorrect = showFeedback && isSelected && !option.isCorrect;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  disabled={showFeedback}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
                    showCorrect
                      ? 'border-teal-700 bg-teal-700/5'
                      : showIncorrect
                      ? 'border-coral-500 bg-coral-500/5'
                      : isSelected
                      ? 'border-teal-700 bg-teal-700/5'
                      : 'border-cream-100 hover:border-teal-400 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      showCorrect
                        ? 'border-teal-700 bg-teal-700'
                        : showIncorrect
                        ? 'border-coral-500 bg-coral-500'
                        : isSelected
                        ? 'border-teal-700 bg-teal-700'
                        : 'border-cream-100'
                    }`}>
                      {(isSelected || showCorrect) && (
                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {showIncorrect && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      showCorrect ? 'text-teal-700' : showIncorrect ? 'text-coral-500' : 'text-teal-900'
                    }`}>
                      {option.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Short answer */}
        {currentQuestion.type === 'SHORT_ANSWER' && (
          <input
            type="text"
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            placeholder="Type your answer..."
            disabled={showFeedback}
            className="w-full px-5 py-4 rounded-xl border-2 border-cream-100 bg-cream-50 text-teal-900 placeholder-teal-400 focus:outline-none focus:border-teal-700 transition text-sm"
          />
        )}

        {/* Feedback */}
        {showFeedback && currentQuestion.explanation && (
          <div className="mt-4 p-4 rounded-lg bg-cream-50 border border-cream-100">
            <p className="text-sm text-teal-700">
              <span className="font-medium">Explanation:</span> {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          {showFeedback ? (
            <button
              onClick={() => goToNext(answers)}
              className="px-8 py-3 bg-teal-700 hover:bg-teal-900 text-cream-50 font-heading font-medium rounded-lg transition-colors"
            >
              {currentIndex < quiz.questions.length - 1 ? 'Next Question' : 'See Results'}
            </button>
          ) : (
            <button
              onClick={handleConfirmAnswer}
              disabled={selectedOptions.length === 0 && !textAnswer}
              className="px-8 py-3 bg-coral-500 hover:bg-coral-700 text-white font-heading font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirm
            </button>
          )}
        </div>
      </div>

      {/* Multi-select hint */}
      {currentQuestion.type === 'MULTI_SELECT' && !showFeedback && (
        <p className="text-xs text-teal-400 text-center mt-3">Select all that apply</p>
      )}
    </div>
  );
}
