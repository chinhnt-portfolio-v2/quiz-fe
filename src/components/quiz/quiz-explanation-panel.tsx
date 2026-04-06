import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from 'framer-motion';

interface Props {
  isCorrect: boolean;
  correctKey: string;
  explanation: string;
  onNext: () => void;
  autoAdvanceMs?: number;
}

const LETTERS = ['A', 'B', 'C', 'D'];

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M5 13l4 4L19 7" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M6 6l12 12M18 6L6 18" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function QuizExplanationPanel({
  isCorrect,
  correctKey,
  explanation,
  onNext,
  autoAdvanceMs = 2000,
}: Props) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [countdown, setCountdown] = useState(autoAdvanceMs);
  const [stopped, setStopped] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownPct = (countdown / autoAdvanceMs) * 100;
  const correctLetter = LETTERS[parseInt(correctKey, 10) - 1] ?? correctKey;

  // Countdown timer
  useEffect(() => {
    if (reduceMotion || stopped) return;
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 100) {
          clearInterval(timerRef.current!);
          onNext();
          return 0;
        }
        return c - 100;
      });
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [reduceMotion, stopped, onNext, autoAdvanceMs]);

  const handleStop = () => {
    setStopped(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const slideUp = {
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: reduceMotion
        ? { duration: 0.2 }
        : { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: { y: '100%', opacity: 0, transition: { duration: 0.15 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        key="explanation-panel"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={slideUp}
        role="region"
        aria-label={t('quiz.explanation')}
        aria-live="polite"
        className={`
          fixed bottom-0 left-0 right-0 z-40 max-h-[320px] overflow-y-auto
          border-t bg-card p-5
          ${isCorrect ? 'border-t-2 border-t-[#22C55E]' : 'border-t-2 border-t-[#EF4444]'}
        `}
      >
        {/* Result header */}
        <div className="mb-3 flex items-center gap-2">
          <span className={isCorrect ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
            {isCorrect ? <CheckIcon /> : <XIcon />}
          </span>
          <p className={`text-base font-semibold ${isCorrect ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {isCorrect ? t('quiz.correct') : t('quiz.wrong')}
          </p>
          <span className="ml-auto text-xs text-muted-foreground">
            {t('quiz.correct') === 'Correct!' || t('quiz.correct') === 'Đúng!'
              ? `Correct answer: ${correctLetter}`
              : `Đáp án đúng: ${correctLetter}`}
          </span>
        </div>

        {/* Explanation text */}
        <p className="mb-4 text-sm leading-relaxed text-foreground">{explanation}</p>

        {/* Countdown bar */}
        {!reduceMotion && !stopped && (
          <div className="mb-3 h-0.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-brand transition-all duration-100 ease-linear"
              style={{ width: `${countdownPct}%` }}
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3">
          {!reduceMotion && !stopped && (
            <button
              onClick={handleStop}
              className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Stop auto-advance
            </button>
          )}
          <button
            onClick={onNext}
            className="ml-auto rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t('quiz.next')}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
