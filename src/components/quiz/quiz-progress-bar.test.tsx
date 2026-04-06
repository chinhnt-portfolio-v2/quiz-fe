import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuizProgressBar } from './quiz-progress-bar';

describe('QuizProgressBar', () => {
  it('renders with correct aria attributes', () => {
    render(<QuizProgressBar current={3} total={10} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute('aria-valuenow', '3');
    expect(bar).toHaveAttribute('aria-valuemax', '10');
  });

  it('renders 0% width when no questions answered', () => {
    render(<QuizProgressBar current={0} total={10} />);
    const fill = document.querySelector('.h-full') as HTMLElement;
    expect(fill).toBeInTheDocument();
    expect(fill.style.width).toBe('0%');
  });

  it('renders full width when complete', () => {
    render(<QuizProgressBar current={10} total={10} />);
    const fill = document.querySelector('.h-full') as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });

  it('renders 50% when halfway', () => {
    render(<QuizProgressBar current={5} total={10} />);
    const fill = document.querySelector('.h-full') as HTMLElement;
    expect(fill.style.width).toBe('50%');
  });
});