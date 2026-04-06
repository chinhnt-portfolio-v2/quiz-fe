import { useTranslation } from 'react-i18next';

interface Props {
  streak: number;
  className?: string;
}

function FlameIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 2C12 2 8 6 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 8 14.5 6.5 14.5 6.5C14.5 6.5 18 8 18 12C18 16.42 15.42 20 12 20C8.58 20 6 17.42 6 14C6 11.58 7 9.5 7 9.5C7 9.5 5 12 5 14C5 18.42 8.58 22 12 22C15.42 22 18 18.42 18 14C18 10 15 7 15 7C15 7 17 4 12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function QuizStreakBadge({ streak, className = '' }: Props) {
  const { t } = useTranslation();

  if (streak <= 0) return null;

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 dark:bg-amber-900/40 ${className}`}
      aria-label={`${streak} ${t('streak')}`}
    >
      <span className="text-amber-500">
        <FlameIcon />
      </span>
      <span className="text-xs font-bold text-amber-600 dark:text-amber-300">
        {streak}
      </span>
      <span className="text-[11px] text-amber-600 dark:text-amber-400">
        {t('streak')}
      </span>
    </div>
  );
}
