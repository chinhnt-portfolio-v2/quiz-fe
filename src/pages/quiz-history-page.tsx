import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { quizApi } from '@/api/quiz';
import { SPRING_GENTLE } from '@/constants/quiz-motion';

export default function QuizHistoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    topic: '',
    isCorrect: undefined as boolean | undefined,
    from: '',
    to: '',
    page: 0,
    size: 20,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['attempts', filters],
    queryFn: () => quizApi.getAttemptHistory(filters),
  });

  const applyFilters = () => {
    setFilters(f => ({ ...f, page: 0 }));
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (isError) return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-destructive">Failed to load history.</span>
    </div>
  );

  const page = data ?? { content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/quiz/progress')} className="btn btn-ghost btn-sm">
            ← {t('progress.title')}
          </button>
          <h1 className="text-2xl font-bold text-foreground">{t('history.title')}</h1>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING_GENTLE}
          className="bg-card rounded-xl border p-4 space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t('history.filter.topic')}</label>
              <input
                type="text"
                value={filters.topic}
                onChange={e => setFilters(f => ({ ...f, topic: e.target.value }))}
                placeholder="e.g. java-core"
                className="input input-bordered input-sm w-full"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t('history.filter.result')}</label>
              <select
                value={filters.isCorrect === undefined ? '' : String(filters.isCorrect)}
                onChange={e => setFilters(f => ({
                  ...f,
                  isCorrect: e.target.value === '' ? undefined : e.target.value === 'true',
                }))}
                className="select select-bordered select-sm w-full"
              >
                <option value="">All</option>
                <option value="true">Correct</option>
                <option value="false">Incorrect</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t('history.filter.from')}</label>
              <input
                type="date"
                value={filters.from}
                onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
                className="input input-bordered input-sm w-full"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t('history.filter.to')}</label>
              <input
                type="date"
                value={filters.to}
                onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
                className="input input-bordered input-sm w-full"
              />
            </div>
          </div>
          <button onClick={applyFilters} className="btn btn-primary btn-sm w-full">
            {t('history.filter.apply')}
          </button>
        </motion.div>

        {/* Stats */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{page.totalElements} attempts</span>
          <span>Page {page.number + 1} / {page.totalPages || 1}</span>
        </div>

        {/* Attempt list */}
        {page.content.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">📚</p>
            <p>{t('history.empty')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {page.content.map((attempt: import('@/types/quiz.types').AttemptHistoryItem, idx: number) => (
              <motion.div
                key={`${attempt.questionId}-${attempt.attemptedAt}-${idx}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_GENTLE, delay: idx * 0.02 }}
                className={`bg-card rounded-xl border p-4 space-y-2 ${
                  attempt.isCorrect ? 'border-emerald-200' : 'border-red-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                        attempt.levelTag === 'SENIOR' ? 'bg-emerald-100 text-emerald-700' :
                        attempt.levelTag === 'MIDDLE' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>{attempt.levelTag}</span>
                      <span className="text-xs text-muted-foreground">{attempt.topicSlug}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(attempt.attemptedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground leading-snug">
                      {attempt.questionText.length > 120
                        ? attempt.questionText.slice(0, 120) + '…'
                        : attempt.questionText}
                    </p>
                  </div>
                  <span className={`text-lg flex-shrink-0 ${attempt.isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                    {attempt.isCorrect ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>You answered: <strong>{attempt.givenKey.toUpperCase()}</strong></span>
                  {!attempt.isCorrect && (
                    <span>Correct: <strong>{attempt.correctKey.toUpperCase()}</strong></span>
                  )}
                  <span>{attempt.responseMs}ms</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {page.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
              disabled={page.number === 0}
              className="btn btn-outline btn-sm"
            >
              ← Prev
            </button>
            <span className="btn btn-sm btn-ghost pointer-events-none">
              {page.number + 1} / {page.totalPages}
            </span>
            <button
              onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
              disabled={page.number >= page.totalPages - 1}
              className="btn btn-outline btn-sm"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}