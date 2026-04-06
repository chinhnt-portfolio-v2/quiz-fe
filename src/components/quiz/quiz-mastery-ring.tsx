import { useReducedMotion } from 'framer-motion';

type Size = 'sm' | 'md' | 'lg';

interface Props {
  percent: number;
  size?: Size;
  color?: string;
  label?: string;
  className?: string;
}

const SIZE_MAP: Record<Size, { px: number; strokeWidth: number; fontSize: string }> = {
  sm: { px: 32, strokeWidth: 4, fontSize: 'text-[9px]' },
  md: { px: 48, strokeWidth: 4, fontSize: 'text-xs' },
  lg: { px: 80, strokeWidth: 5, fontSize: 'text-sm' },
};

const DEFAULT_COLOR = 'var(--color-brand)';

export function QuizMasteryRing({ percent, size = 'md', color, label }: Props) {
  const reduceMotion = useReducedMotion();

  const { px, strokeWidth, fontSize } = SIZE_MAP[size];
  const radius = (px - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Clamp percent to 0–1 range
  const clamped = Math.min(1, Math.max(0, percent));
  const dashOffset = reduceMotion ? circumference * (1 - clamped) : 0;
  const strokeDashoffset = circumference * (1 - clamped);
  const ringColor = color ?? DEFAULT_COLOR;
  const trackColor = 'oklch(0.269 0 0)';

  return (
    <svg
      width={px}
      height={px}
      viewBox={`0 0 ${px} ${px}`}
      aria-label={label ?? `${Math.round(clamped * 100)}% mastery`}
      role="img"
    >
      {/* Track */}
      <circle
        cx={px / 2}
        cy={px / 2}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      {/* Fill */}
      <circle
        cx={px / 2}
        cy={px / 2}
        r={radius}
        fill="none"
        stroke={ringColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={reduceMotion ? dashOffset : strokeDashoffset}
        style={{
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
          transition: reduceMotion ? 'none' : 'stroke-dashoffset 600ms ease-out',
          willChange: 'stroke-dashoffset',
        }}
      />
      {/* Center label */}
      {label === undefined && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className={`${fontSize} font-bold fill-foreground`}
          style={{ fontSize: px * 0.22 }}
        >
          {Math.round(clamped * 100)}%
        </text>
      )}
      {label !== undefined && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className={`${fontSize} font-bold fill-foreground`}
          style={{ fontSize: px * 0.18 }}
        >
          {label}
        </text>
      )}
    </svg>
  );
}
