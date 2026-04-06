import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuizLevelBadge } from './quiz-level-badge';

describe('QuizLevelBadge', () => {
  it('renders JUNIOR level', () => {
    render(<QuizLevelBadge level="JUNIOR" />);
    expect(screen.getByText('JUNIOR')).toBeInTheDocument();
  });

  it('renders MIDDLE level', () => {
    render(<QuizLevelBadge level="MIDDLE" />);
    expect(screen.getByText('MIDDLE')).toBeInTheDocument();
  });

  it('renders SENIOR level', () => {
    render(<QuizLevelBadge level="SENIOR" />);
    expect(screen.getByText('SENIOR')).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    render(<QuizLevelBadge level="MIDDLE" />);
    expect(screen.getByLabelText('Difficulty level: MIDDLE')).toBeInTheDocument();
  });
});