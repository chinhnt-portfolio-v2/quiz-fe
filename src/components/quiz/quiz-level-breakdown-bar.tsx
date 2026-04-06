import type { QuizLevel } from '@/types/quiz.types';

interface Props {
  level: QuizLevel;
  mastered: number;
  total: number;
  percent: number; // 0.0–1.0
}

const LEVEL_COLORS: Record<QuizLevel, { bar: string; text: string; label: string }> = {
  JUNIOR: {
    bar: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
    label: 'Junior',
  },
  MIDDLE: {
    bar: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    label: 'Middle',
  },
  SENIOR: {
    bar: 'bg-purple-500',
    text: 'text-purple-600 dark:text-purple-400',
    label: 'Senior',
  },
};

export function QuizLevelBreakdownBar({ level, mastered, total, percent }: Props) {
  const { bar, text } = LEVEL_COLORS[level];
  const clampedPct = Math.min(1, Math.max(0, percent)) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${text}`}>{level}</span>
        <span className="text-xs text-muted-foreground">
          {mastered}/{total}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${bar} transition-all duration-500`}
          style={{ width: `${clampedPct}%` }}
          role="progressbar"
          aria-valuenow={mastered}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${level}: ${mastered} of ${total} mastered`}
        />
      </div>
    </div>
  );
}
