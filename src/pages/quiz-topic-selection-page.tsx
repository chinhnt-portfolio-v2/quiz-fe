import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useTopics } from '@/hooks/use-quiz';
import { SPRING_SNAPPY } from '@/constants/quiz-motion';

export default function QuizTopicSelectionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: topics, isLoading, isError } = useTopics();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleTopic = (slug: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(topics?.map(t => t.topicSlug) ?? []));
  const clearAll = () => setSelected(new Set());

  const startQuiz = () => {
    if (selected.size === 0) return;
    navigate(`/quiz/practice?topics=${[...selected].join(',')}`);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-muted-foreground animate-pulse">Loading topics…</span>
    </div>
  );

  if (isError || !topics) return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-destructive">Failed to load topics.</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-foreground">{t('topics.title')}</h1>

        {/* Controls */}
        <div className="flex gap-3">
          <button onClick={selectAll} className="btn btn-outline btn-sm">{t('topics.selectAll')}</button>
          <button onClick={clearAll} className="btn btn-outline btn-sm">{t('topics.clear')}</button>
          <span className="ml-auto self-center text-sm text-muted-foreground">
            {selected.size} {t('topics.selected')}
          </span>
        </div>

        {/* Topic grid */}
        <div className="grid grid-cols-2 gap-3">
          {topics.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-muted-foreground">No topics found.</p>
            </div>
          ) : topics.map(topic => (
            <motion.button
              key={topic.topicSlug}
              whileTap={{ scale: 0.97 }}
              transition={SPRING_SNAPPY}
              onClick={() => toggleTopic(topic.topicSlug)}
              className={`
                relative flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-colors
                min-h-[80px]
                ${selected.has(topic.topicSlug)
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-card text-foreground hover:border-primary/50'}
              `}
            >
              <span className="font-semibold text-sm leading-tight">{topic.topicLabel}</span>
              <span className="text-xs text-muted-foreground">
                {topic.questionCount} questions
              </span>
              {/* Level badge */}
              <span className={`
                absolute right-2 top-2 text-[10px] font-mono px-1.5 py-0.5 rounded
                ${topic.userLevel === 'SENIOR' ? 'bg-emerald-100 text-emerald-700' :
                  topic.userLevel === 'MIDDLE' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-600'}
              `}>
                {topic.userLevel}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Streak */}
        {topics[0] && (
          <p className="text-sm text-muted-foreground text-center">
            🔥 {t('streak')}: {topics[0] && 'currentStreak' in topics[0] ? (topics[0] as { currentStreak?: number }).currentStreak ?? 0 : 0} days
          </p>
        )}

        {/* Start button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          transition={SPRING_SNAPPY}
          onClick={startQuiz}
          disabled={selected.size === 0}
          className="w-full btn btn-primary btn-lg disabled:opacity-40"
        >
          {t('topics.startQuiz')}
        </motion.button>
      </div>
    </div>
  );
}
