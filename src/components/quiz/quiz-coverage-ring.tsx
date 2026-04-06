import { useTranslation } from 'react-i18next';
import { QuizMasteryRing } from './quiz-mastery-ring';

interface Props {
  label: string;
  percent: number;
  level?: string;
}

export function QuizCoverageRing({ label, percent, level }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-2">
      <QuizMasteryRing percent={percent} size="lg" label={`${Math.round(percent * 100)}%`} />
      <div className="text-center">
        <p className="text-xs font-semibold text-foreground">{label}</p>
        {level && (
          <p className="text-[11px] text-muted-foreground">
            {t(`level.${level.toUpperCase()}` as const)}
          </p>
        )}
      </div>
    </div>
  );
}
