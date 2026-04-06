import { useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { QuizQuestion } from '@/types/quiz.types';
import { QuizProgressBar } from './quiz-progress-bar';
import { QuizLevelBadge } from './quiz-level-badge';
import { QuizOptionRow, type OptionState } from './quiz-option-row';
import { QuizExplanationPanel } from './quiz-explanation-panel';
import { SPRING_GENTLE } from '@/constants/quiz-motion';

interface Props {
  question: QuizQuestion;
  questionIndex: number;
  total: number;
  onComplete: (isCorrect: boolean) => void;
  correctKey: string;
  explanation: string;
}

const LETTERS = ['A', 'B', 'C', 'D'];

export function QuizCardScreen({
  question,
  questionIndex,
  total,
  onComplete,
  correctKey,
  explanation,
}: Props) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);

  const getOptionState = (optionId: string, idx: number): OptionState => {
    if (!showExplanation) {
      if (selectedId === optionId) return 'selected-correct';
      if (selectedId !== null) return 'disabled';
      return 'default';
    }
    // After explanation shown
    if (optionId === question.options[idx]?.id) {
      if (selectedId === optionId && selectedId === correctKey) return 'selected-correct';
      if (selectedId === optionId && selectedId !== correctKey) return 'selected-wrong';
      if (optionId === correctKey) return 'reveal-correct';
    }
    return 'disabled';
  };

  const handleSelect = useCallback(
    (optionId: string) => {
      if (showExplanation) return;
      setSelectedId(optionId);
      setShowExplanation(true);
      const isCorrect = optionId === correctKey;
      onComplete(isCorrect);
    },
    [showExplanation, correctKey, onComplete]
  );

  const handleNext = useCallback(() => {
    setSelectedId(null);
    setShowExplanation(false);
    setSessionEnded(true);
    // Parent will unmount this component
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: reduceMotion ? { duration: 0.15 } : SPRING_GENTLE,
    },
    exit: { opacity: 0, scale: reduceMotion ? 1 : 0.96, transition: { duration: 0.15 } },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <QuizProgressBar current={questionIndex + 1} total={total} />

      <AnimatePresence mode="wait">
        {!sessionEnded && (
          <motion.div
            key={question.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-1 flex-col items-center px-4 pt-12 pb-48"
          >
            {/* Meta row */}
            <div className="mb-6 flex w-full max-w-lg items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {t('quiz.progress', { current: questionIndex + 1, total })}
              </span>
            </div>

            {/* Question card */}
            <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-sm">
              {/* Level badge */}
              <div className="mb-4 flex items-center justify-between">
                <QuizLevelBadge level={question.levelTag} />
                <span className="text-xs text-muted-foreground">{question.topicSlug}</span>
              </div>

              {/* Question text */}
              <p className="mb-6 text-lg font-semibold leading-relaxed text-foreground">
                {question.questionText}
              </p>

              {/* Options */}
              <div
                role="radiogroup"
                aria-label="Answer options"
                className="flex flex-col gap-3"
              >
                {question.options.map((opt, idx) => (
                  <QuizOptionRow
                    key={opt.id}
                    option={opt}
                    letter={LETTERS[idx] ?? '?'}
                    state={getOptionState(opt.id, idx)}
                    onSelect={() => handleSelect(opt.id)}
                    disabled={showExplanation}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation panel */}
      <AnimatePresence>
        {showExplanation && !sessionEnded && (
          <QuizExplanationPanel
            isCorrect={selectedId === correctKey}
            correctKey={correctKey}
            explanation={explanation}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
