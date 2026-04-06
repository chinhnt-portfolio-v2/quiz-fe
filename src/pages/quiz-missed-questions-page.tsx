import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMissedQuestions } from '@/hooks/use-quiz';
import { SPRING_GENTLE } from '@/constants/quiz-motion';

export default function QuizMissedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: missed, isLoading, isError } = useMissedQuestions();

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-muted-foreground animate-pulse">Loading…</span>
    </div>
  );

  if (isError || !missed) return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-destructive">Failed to load missed questions.</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/quiz')} className="btn btn-ghost btn-sm">
            ← {t('complete.backToTopics')}
          </button>
          <h1 className="text-2xl font-bold text-foreground">{t('missed.title')}</h1>
        </div>

        {missed.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-4"
          >
            <span className="text-5xl">🎉</span>
            <p className="text-lg text-muted-foreground">{t('missed.empty')}</p>
            <button onClick={() => navigate('/quiz')} className="btn btn-primary btn-sm">
              {t('complete.backToTopics')}
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {missed.map((item) => (
              <motion.div
                key={item.questionId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={SPRING_GENTLE}
                className="bg-card rounded-xl border shadow-sm p-5 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className={`
                    text-[10px] font-mono px-2 py-1 rounded
                    ${item.levelTag === 'SENIOR' ? 'bg-emerald-100 text-emerald-700' :
                      item.levelTag === 'MIDDLE' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'}
                  `}>{item.levelTag}</span>
                  <span className="text-xs text-muted-foreground">{item.topicSlug}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    {new Date(item.attemptedAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm font-medium text-foreground">{item.questionText}</p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t('missed.yourAnswer')}</p>
                    <p className="text-red-600 font-medium">{item.userAnswer}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t('missed.correctAnswer')}</p>
                    <p className="text-emerald-600 font-medium">{item.correctKey}</p>
                  </div>
                </div>

                {item.explanation && (
                  <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                    <span className="font-semibold">{t('quiz.explanation')}:</span> {item.explanation}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
