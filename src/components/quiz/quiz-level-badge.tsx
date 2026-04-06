import type { QuizLevel } from '@/types/quiz.types';

const COLORS: Record<QuizLevel, string> = {
  JUNIOR: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  MIDDLE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  SENIOR: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

interface Props {
  level: QuizLevel;
  className?: string;
}

export function QuizLevelBadge({ level, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${COLORS[level]} ${className}`}
      aria-label={`Difficulty level: ${level}`}
    >
      {level}
    </span>
  );
}
