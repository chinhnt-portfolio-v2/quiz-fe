import { describe, it, expect, beforeEach } from 'vitest';
import { useQuizSessionStore } from './quiz-session-store';
import type { QuizQuestion } from '@/types/quiz.types';

describe('QuizSessionStore', () => {
  const makeQuestion = (id: number): QuizQuestion => ({
    id,
    topicSlug: 'java-core',
    levelTag: 'JUNIOR',
    questionText: 'Test?',
    questionType: 'MULTIPLE_CHOICE',
    options: [],
  });

  const correctRes = {
    isCorrect: true,
    correctKey: 'a',
    explanation: '',
    srState: {
      easeFactor: 2.5,
      intervalDays: 1,
      repetitions: 1,
      consecutiveCorrect: 1,
      consecutiveWrong: 0,
      isRelearning: false,
      nextReviewAt: '',
    },
    streakDays: 1,
  };

  const wrongRes = {
    isCorrect: false,
    correctKey: 'a',
    explanation: '',
    srState: {
      easeFactor: 2.5,
      intervalDays: 0,
      repetitions: 0,
      consecutiveCorrect: 0,
      consecutiveWrong: 1,
      isRelearning: false,
      nextReviewAt: '',
    },
    streakDays: 0,
  };

  beforeEach(() => {
    useQuizSessionStore.getState().resetSession();
  });

  it('starts empty', () => {
    const s = useQuizSessionStore.getState();
    expect(s.questionQueue).toHaveLength(0);
    expect(s.correctCount).toBe(0);
    expect(s.wrongCount).toBe(0);
    expect(s.currentIndex).toBe(0);
  });

  it('setQueue populates the queue', () => {
    const q = makeQuestion(1);
    useQuizSessionStore.getState().setQueue([q]);
    expect(useQuizSessionStore.getState().questionQueue).toHaveLength(1);
  });

  it('recordAnswer increments correctCount when correct', () => {
    const q = makeQuestion(1);
    const store = useQuizSessionStore.getState();
    store.setQueue([q]);
    store.recordAnswer(correctRes);
    expect(useQuizSessionStore.getState().correctCount).toBe(1);
    expect(useQuizSessionStore.getState().wrongCount).toBe(0);
  });

  it('recordAnswer increments wrongCount when incorrect', () => {
    const q = makeQuestion(1);
    const store = useQuizSessionStore.getState();
    store.setQueue([q]);
    store.recordAnswer(wrongRes);
    expect(useQuizSessionStore.getState().wrongCount).toBe(1);
    expect(useQuizSessionStore.getState().correctCount).toBe(0);
  });

  it('resetSession clears everything', () => {
    const q = makeQuestion(1);
    const store = useQuizSessionStore.getState();
    store.setQueue([q]);
    store.recordAnswer(correctRes);
    store.resetSession();
    const s = useQuizSessionStore.getState();
    expect(s.questionQueue).toHaveLength(0);
    expect(s.correctCount).toBe(0);
    expect(s.wrongCount).toBe(0);
  });

  it('nextQuestion advances the index', () => {
    const q1 = makeQuestion(1);
    const q2 = makeQuestion(2);
    const store = useQuizSessionStore.getState();
    store.setQueue([q1, q2]);
    expect(useQuizSessionStore.getState().currentIndex).toBe(0);
    store.nextQuestion();
    expect(useQuizSessionStore.getState().currentIndex).toBe(1);
  });

  it('isSessionComplete returns true when no more questions', () => {
    const q = makeQuestion(1);
    const store = useQuizSessionStore.getState();
    store.setQueue([q]);
    store.nextQuestion();
    expect(store.isSessionComplete()).toBe(true);
  });

  it('isSessionComplete returns false when questions remain', () => {
    const q1 = makeQuestion(1);
    const q2 = makeQuestion(2);
    const store = useQuizSessionStore.getState();
    store.setQueue([q1, q2]);
    store.nextQuestion();
    expect(store.isSessionComplete()).toBe(false);
  });
});