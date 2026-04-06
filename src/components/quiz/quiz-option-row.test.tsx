import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizOptionRow } from './quiz-option-row';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: 'button',
  },
  useReducedMotion: vi.fn().mockReturnValue(false),
}));

describe('QuizOptionRow', () => {
  const option = { id: 'a', text: 'O(1)' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders option text', () => {
    render(<QuizOptionRow option={option} letter="A" state="default" onSelect={() => {}} />);
    expect(screen.getByText('O(1)')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<QuizOptionRow option={option} letter="A" state="default" onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('shows check icon when selected-correct state', () => {
    render(<QuizOptionRow option={option} letter="A" state="selected-correct" onSelect={() => {}} />);
    const svg = document.querySelector('svg path[d*="M5 13l4 4L19 7"]');
    expect(svg).toBeInTheDocument();
  });

  it('shows x icon when selected-wrong state', () => {
    render(<QuizOptionRow option={option} letter="A" state="selected-wrong" onSelect={() => {}} />);
    const svg = document.querySelector('svg path[d*="M6 6l12 12M18 6L6 18"]');
    expect(svg).toBeInTheDocument();
  });

  it('is disabled when state is disabled', () => {
    render(<QuizOptionRow option={option} letter="A" state="disabled" onSelect={() => {}} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});