import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SPRING_GENTLE } from '@/constants/quiz-motion';

interface Props {
  correct: number;
  wrong: number;
  total: number;
  onReviewMissed: () => void;
  onBack: () => void;
}

export function QuizSessionCompleteScreen({
  correct,
  wrong,
  total,
  onReviewMissed,
  onBack,
}: Props) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={reduceMotion ? { duration: 0.2 } : SPRING_GENTLE}
      className="flex min-h-screen items-center justify-center px-4 py-8"
    >
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        {/* Title */}
        <h1 className="mb-6 text-h2 font-bold tracking-tight text-foreground">
          {t('complete.title')}
        </h1>

        {/* Accuracy ring (decorative) */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-brand">
          <span className="text-2xl font-bold text-brand">{accuracy}%</span>
        </div>

        {/* Stats */}
        <div className="mb-8 flex justify-center gap-8">
          <div>
            <p className="text-3xl font-bold text-[#22C55E]">{correct}</p>
            <p className="text-xs text-muted-foreground">{t('complete.correct')}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#EF4444]">{wrong}</p>
            <p className="text-xs text-muted-foreground">{t('complete.wrong')}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {wrong > 0 && (
            <button
              onClick={onReviewMissed}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-[--color-bg-elevated] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t('complete.reviewMissed')}
            </button>
          )}
          <button
            onClick={onBack}
            className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t('complete.backToTopics')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
