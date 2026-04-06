import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTopics } from '@/hooks/use-quiz';
import { SPRING_GENTLE } from '@/constants/quiz-motion';

function CoverageBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
}

export default function QuizProgressPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: topics, isLoading, isError } = useTopics();

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-muted-foreground animate-pulse">Loading progress…</span>
    </div>
  );

  if (isError || !topics) return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-destructive">Failed to load progress.</span>
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
          <h1 className="text-2xl font-bold text-foreground">{t('progress.title')}</h1>
        </div>

        {/* Streak */}
        {topics[0] && (
          <div className="flex items-center gap-2 bg-card rounded-xl border p-4">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-sm font-semibold text-foreground">{t('streak')}</p>
              <p className="text-xs text-muted-foreground">
                {'currentStreak' in topics[0] ? (topics[0] as { currentStreak: number }).currentStreak : 0} days
              </p>
            </div>
          </div>
        )}

        {/* Per-topic coverage */}
        <div className="space-y-4">
          {topics.map((topic) => (
            <motion.div
              key={topic.topicSlug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING_GENTLE}
              className="bg-card rounded-xl border shadow-sm p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{topic.topicLabel}</h3>
                <span className={`
                  text-[10px] font-mono px-2 py-1 rounded
                  ${topic.userLevel === 'SENIOR' ? 'bg-emerald-100 text-emerald-700' :
                    topic.userLevel === 'MIDDLE' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-600'}
                `}>{t(`level.${topic.userLevel}`)}</span>
              </div>

              <div className="space-y-3">
                {(['junior', 'middle', 'senior'] as const).map(level => {
                  const rawCount = topic.coverage[level] as number;
                  const pct = topic.questionCount > 0
                    ? Math.min(100, Math.round((rawCount / topic.questionCount) * 100))
                    : 0;
                  return (
                    <div key={level} className="space-y-1.5">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{t(`progress.${level}`)}</span>
                        <span>{pct}%</span>
                      </div>
                      <CoverageBar
                        value={rawCount}
                        max={topic.questionCount}
                        color={
                          level === 'senior' ? 'bg-emerald-500' :
                          level === 'middle' ? 'bg-amber-500' :
                          'bg-blue-500'
                        }
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => navigate(`/quiz/practice?topics=${topic.topicSlug}`)}
                  className="btn btn-outline btn-sm text-xs"
                >
                  Practice →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
