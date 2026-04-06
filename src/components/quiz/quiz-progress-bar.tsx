interface Props {
  current: number;
  total: number;
  className?: string;
}

export function QuizProgressBar({ current, total, className = '' }: Props) {
  const pct = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Quiz progress: question ${current} of ${total}`}
      className={`fixed top-0 left-0 right-0 z-50 h-1 bg-muted ${className}`}
    >
      <div
        className="h-full bg-brand transition-all duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
