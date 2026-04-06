import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

export type OptionState =
  | 'default'
  | 'selected-correct'
  | 'selected-wrong'
  | 'reveal-correct'
  | 'disabled';

interface Option {
  id: string;
  text: string;
}

interface Props {
  option: Option;
  state: OptionState;
  letter: string;
  onSelect?: () => void;
  disabled?: boolean;
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M5 13l4 4L19 7" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M6 6l12 12M18 6L6 18" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

const STATE_CLASSES: Record<OptionState, string> = {
  default: 'bg-card border border-border hover:border-brand cursor-pointer hover:bg-[--color-bg-elevated]',
  'selected-correct': 'bg-[#22C55E]/15 border-2 border-[#22C55E]',
  'selected-wrong': 'bg-[#EF4444]/15 border-2 border-[#EF4444]',
  'reveal-correct': 'bg-[#22C55E]/10 border border-[#22C55E]/50',
  disabled: 'opacity-50 cursor-not-allowed bg-muted/40',
};

export function QuizOptionRow({ option, state, letter, onSelect, disabled }: Props) {
  const reduceMotion = useReducedMotion();
  const isInteractive = state === 'default' && !disabled;
  const isCorrect = state === 'selected-correct';
  const isWrong = state === 'selected-wrong';
  const isReveal = state === 'reveal-correct';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && isInteractive) {
      e.preventDefault();
      onSelect?.();
    }
  };

  return (
    <motion.button
      whileTap={reduceMotion ? {} : { scale: 0.98 }}
      animate={isCorrect || isWrong ? { scale: [1, 1.02, 1] } : undefined}
      transition={{ duration: 0.25 }}
      onClick={isInteractive ? onSelect : undefined}
      disabled={!isInteractive}
      aria-pressed={state === 'selected-correct' || state === 'selected-wrong'}
      aria-disabled={state === 'disabled'}
      onKeyDown={handleKeyDown}
      className={`
        quiz-option-row
        relative
        flex w-full min-h-[48px] items-center gap-3 rounded-lg border p-3
        text-left transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        ${STATE_CLASSES[state]}
        ${isInteractive ? 'cursor-pointer' : ''}
      `}
    >
      {/* Letter badge */}
      <span
        className={`
          flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm font-bold
          ${isCorrect ? 'bg-[#22C55E]/20 text-[#22C55E]' : ''}
          ${isWrong ? 'bg-[#EF4444]/20 text-[#EF4444]' : ''}
          ${isReveal ? 'bg-[#22C55E]/15 text-[#22C55E]' : ''}
          ${!isCorrect && !isWrong && !isReveal ? 'bg-secondary text-muted-foreground' : ''}
        `}
        aria-hidden="true"
      >
        {letter}
      </span>

      {/* Option text */}
      <span className="flex-1 text-sm leading-snug text-foreground">{option.text}</span>

      {/* State icon */}
      {isCorrect && <CheckIcon />}
      {isWrong && <XIcon />}
    </motion.button>
  );
}
