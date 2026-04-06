import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import type { TopicStats } from '@/types/quiz.types';
import { QuizMasteryRing } from './quiz-mastery-ring';

interface Props {
  topic: TopicStats;
  selected: boolean;
  onToggle: () => void;
  className?: string;
}

export function QuizTopicChip({ topic, selected, onToggle }: Props) {
  const reduceMotion = useReducedMotion();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  const total = topic.coverage.junior + topic.coverage.middle + topic.coverage.senior;
  const coveragePct = total > 0 ? total / (total * 3) : 0; // placeholder

  return (
    <motion.button
      whileTap={reduceMotion ? {} : { scale: 0.97 }}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      aria-pressed={selected}
      className={`
        quiz-topic-chip relative flex min-h-[44px] w-full items-center gap-3 rounded-2xl border px-4 py-3
        text-left transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        ${selected
          ? 'border-brand bg-brand text-white dark:bg-brand dark:text-white'
          : 'border-border bg-card text-foreground hover:border-brand'
        }
      `}
    >
      {/* Mastery ring */}
      <QuizMasteryRing
        percent={coveragePct}
        size="sm"
        color={selected ? 'white' : undefined}
        className="shrink-0"
      />

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${selected ? 'text-white' : 'text-foreground'}`}>
          {topic.topicLabel}
        </p>
        <p className={`text-xs ${selected ? 'text-white/70' : 'text-muted-foreground'}`}>
          {topic.questionCount} Qs
        </p>
      </div>

      {/* Selected checkmark */}
      {selected && (
        <motion.span
          initial={reduceMotion ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20"
          aria-hidden="true"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      )}
    </motion.button>
  );
}
