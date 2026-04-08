import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizSession } from '@/hooks/use-quiz-session';
import { SPRING_GENTLE, SPRING_SNAPPY } from '@/constants/quiz-motion';
import type { AttemptAnswerResponse } from '@/types/quiz.types';

function QuizCardScreen() {
  const { t } = useTranslation();
  const {
    currentQuestion,
    questionIndex,
    totalQuestions,
    correctCount,
    wrongCount,
    isSubmitting,
    handleAnswer,
    nextQuestion,
    loadMore,
  } = useQuizSession();

  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<AttemptAnswerResponse | null>(null);

  // Auto-load more when queue is running low
  useEffect(() => {
    if (totalQuestions > 0 && questionIndex >= totalQuestions - 3) {
      loadMore();
    }
  }, [questionIndex, totalQuestions, loadMore]);

  const onSelect = async (key: string) => {
    if (selected !== null) return;
    setSelected(key);
    const response = await handleAnswer(key);
    if (response) setFeedback(response);
  };

  const onNext = () => {
    setSelected(null);
    setFeedback(null);
    nextQuestion();
  };

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-muted-foreground animate-pulse">Loading question…</span>
      </div>
    );
  }

  const isCorrect = feedback?.isCorrect ?? false;
  const optionStyles = (optId: string) => {
    if (!selected) {
      return 'border-border bg-card hover:border-primary/60 hover:bg-primary/5 cursor-pointer';
    }
    const isSelected = selected === optId;
    const isCorrectKey = feedback?.correctKey === optId;
    if (isCorrectKey) return 'border-emerald-500 bg-emerald-500/10 text-emerald-700';
    if (isSelected && !isCorrect) return 'border-red-500 bg-red-500/10 text-red-700';
    return 'border-border bg-muted/30 opacity-60 cursor-not-allowed';
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 flex flex-col">
      {/* Progress bar */}
      <div className="max-w-xl mx-auto w-full space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{t('quiz.progress', { current: questionIndex + 1, total: totalQuestions || '?' })}</span>
          <span className="text-emerald-600">✓ {correctCount}</span>
          <span className="text-red-500">✗ {wrongCount}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${totalQuestions > 0 ? ((questionIndex + 1) / totalQuestions) * 100 : 0}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={SPRING_GENTLE}
            className="max-w-xl w-full bg-card rounded-2xl border shadow-sm p-6 space-y-5"
          >
            {/* Level tag */}
            <div className="flex items-center justify-between">
              <span className={`
                text-[10px] font-mono font-semibold px-2 py-1 rounded
                ${currentQuestion.levelTag === 'SENIOR' ? 'bg-emerald-100 text-emerald-700' :
                  currentQuestion.levelTag === 'MIDDLE' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-600'}
              `}>
                {currentQuestion.levelTag}
              </span>
              <span className="text-xs text-muted-foreground">{currentQuestion.topicSlug}</span>
            </div>

            {/* Question text */}
            <p className="text-lg font-medium text-foreground leading-relaxed">
              {currentQuestion.questionText}
            </p>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt) => (
                <motion.button
                  key={opt.id}
                  whileTap={selected ? {} : { scale: 0.98 }}
                  transition={SPRING_SNAPPY}
                  onClick={() => onSelect(opt.id)}
                  disabled={selected !== null || isSubmitting}
                  className={`
                    w-full flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors min-h-[52px]
                    ${optionStyles(opt.id)}
                  `}
                >
                  <span className={`
                    flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-semibold
                    ${selected === opt.id ? 'border-primary bg-primary text-white' : 'border-current'}
                  `}>
                    {opt.text[0]?.toUpperCase()}
                  </span>
                  <span className="text-sm leading-snug">{opt.text}</span>
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={SPRING_GENTLE}
                  className={`
                    rounded-xl p-4 text-sm space-y-2
                    ${isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' :
                      'bg-red-50 border border-red-200 text-red-800'}
                  `}
                >
                  <p className="font-semibold">
                    {isCorrect ? t('quiz.correct') : t('quiz.wrong')} {feedback.correctKey && !isCorrect && `(Answer: ${feedback.correctKey})`}
                  </p>
                  {feedback.explanation && (
                    <p className="text-xs leading-relaxed opacity-80">
                      <span className="font-semibold">{t('quiz.explanation')}:</span> {feedback.explanation}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next / Finish */}
            {selected && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  transition={SPRING_SNAPPY}
                  onClick={onNext}
                  className="w-full btn btn-primary"
                >
                  {t('quiz.next')}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function QuizSessionCompleteScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { correctCount, wrongCount, resetSession } = useQuizSession();

  const total = correctCount + wrongCount;
  const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const onReviewMissed = () => {
    resetSession();
    navigate('/quiz/missed');
  };

  const onBackToTopics = () => {
    resetSession();
    navigate('/quiz');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={SPRING_GENTLE}
      className="min-h-screen flex items-center justify-center bg-background px-4"
    >
      <div className="max-w-sm w-full bg-card rounded-2xl border shadow-sm p-8 text-center space-y-6">
        <div className="text-5xl">
          {pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚'}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('complete.title')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {total} questions answered
          </p>
        </div>

        <div className="flex justify-center gap-8">
          <div className="space-y-1">
            <p className="text-3xl font-bold text-emerald-600">{correctCount}</p>
            <p className="text-xs text-muted-foreground">{t('complete.correct')}</p>
          </div>
          <div className="w-px bg-border" />
          <div className="space-y-1">
            <p className="text-3xl font-bold text-red-500">{wrongCount}</p>
            <p className="text-xs text-muted-foreground">{t('complete.wrong')}</p>
          </div>
          <div className="w-px bg-border" />
          <div className="space-y-1">
            <p className="text-3xl font-bold text-primary">{pct}%</p>
            <p className="text-xs text-muted-foreground">Score</p>
          </div>
        </div>

        <div className="space-y-3">
          {wrongCount > 0 && (
            <button onClick={onReviewMissed} className="w-full btn btn-outline">
              {t('complete.reviewMissed')}
            </button>
          )}
          <button onClick={onBackToTopics} className="w-full btn btn-primary">
            {t('complete.backToTopics')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function QuizCardPage() {
  const { isComplete, totalQuestions } = useQuizSession();

  // Guard: show complete screen ONLY if the queue was populated (>=1 question loaded)
  // and all questions have been answered. Prevents flash of "0/0 complete" on load.
  if (isComplete && totalQuestions > 0) {
    return <QuizSessionCompleteScreen />;
  }

  return <QuizCardScreen />;
}
