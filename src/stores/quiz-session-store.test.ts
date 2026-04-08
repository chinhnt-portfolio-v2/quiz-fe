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

  it('addQuestion appends to the queue', () => {
    const q = makeQuestion(1);
    useQuizSessionStore.getState().addQuestion(q);
    expect(useQuizSessionStore.getState().questionQueue).toHaveLength(1);
    expect(useQuizSessionStore.getState().questionQueue[0]?.id).toBe(1);
  });

  it('nextQuestion bumps fetchCounter, not question addition', () => {
    // fetchCounter is 0 at start
    expect(useQuizSessionStore.getState().fetchCounter).toBe(0);
    // addQuestion does NOT change fetchCounter (only appends to queue)
    useQuizSessionStore.getState().addQuestion(makeQuestion(1));
    expect(useQuizSessionStore.getState().fetchCounter).toBe(0);
    // nextQuestion increments fetchCounter → triggers React Query fetch
    useQuizSessionStore.getState().nextQuestion();
    expect(useQuizSessionStore.getState().fetchCounter).toBe(1);
    useQuizSessionStore.getState().nextQuestion();
    expect(useQuizSessionStore.getState().fetchCounter).toBe(2);
  });

  it('recordAnswer increments correctCount when correct', () => {
    const q = makeQuestion(1);
    const store = useQuizSessionStore.getState();
    store.addQuestion(q);
    store.recordAnswer(correctRes);
    expect(useQuizSessionStore.getState().correctCount).toBe(1);
    expect(useQuizSessionStore.getState().wrongCount).toBe(0);
  });

  it('recordAnswer increments wrongCount when incorrect', () => {
    const q = makeQuestion(1);
    const store = useQuizSessionStore.getState();
    store.addQuestion(q);
    store.recordAnswer(wrongRes);
    expect(useQuizSessionStore.getState().wrongCount).toBe(1);
    expect(useQuizSessionStore.getState().correctCount).toBe(0);
  });

  it('resetSession clears everything', () => {
    const store = useQuizSessionStore.getState();
    store.addQuestion(makeQuestion(1));
    store.recordAnswer(correctRes);
    store.resetSession();
    const s = useQuizSessionStore.getState();
    expect(s.questionQueue).toHaveLength(0);
    expect(s.correctCount).toBe(0);
    expect(s.wrongCount).toBe(0);
    expect(s.fetchCounter).toBe(0);
  });

  it('nextQuestion advances the index', () => {
    const store = useQuizSessionStore.getState();
    store.addQuestion(makeQuestion(1));
    store.addQuestion(makeQuestion(2));
    expect(useQuizSessionStore.getState().currentIndex).toBe(0);
    store.nextQuestion();
    expect(useQuizSessionStore.getState().currentIndex).toBe(1);
  });

  it('addQuestion increments totalFetched', () => {
    expect(useQuizSessionStore.getState().totalFetched).toBe(0);
    useQuizSessionStore.getState().addQuestion(makeQuestion(1));
    expect(useQuizSessionStore.getState().totalFetched).toBe(1);
    useQuizSessionStore.getState().addQuestion(makeQuestion(2));
    expect(useQuizSessionStore.getState().totalFetched).toBe(2);
  });

  it('resetSession resets totalFetched', () => {
    const store = useQuizSessionStore.getState();
    store.addQuestion(makeQuestion(1));
    store.resetSession();
    expect(useQuizSessionStore.getState().totalFetched).toBe(0);
  });

  it('isSessionComplete is false when session just started (0 answered, no signal)', () => {
    const store = useQuizSessionStore.getState();
    store.addQuestion(makeQuestion(1));
    // noMoreQuestions = false → not complete
    expect(store.isSessionComplete()).toBe(false);
  });

  it('isSessionComplete returns true when backend says no more questions', () => {
    const store = useQuizSessionStore.getState();
    store.addQuestion(makeQuestion(1));
    store.recordAnswer(correctRes);
    store.setNoMoreQuestions();
    // noMoreQuestions = true, totalFetched >= 1 → complete
    expect(store.isSessionComplete()).toBe(true);
  });

  it('isSessionComplete is false when noMoreQuestions is true but no questions fetched', () => {
    const store = useQuizSessionStore.getState();
    store.setNoMoreQuestions();
    // totalFetched = 0 → guard prevents premature complete
    expect(store.isSessionComplete()).toBe(false);
  });
});
