import { create } from 'zustand';
import type { QuizQuestion, AttemptAnswerResponse } from '@/types/quiz.types';

interface QuizSessionStore {
  questionQueue: QuizQuestion[];
  currentIndex: number;
  answeredCount: number;
  correctCount: number;
  wrongCount: number;
  completedQuestions: CompletedQuestion[];
  /** Incremented on each "Next" click — drives React Query fetch. */
  fetchCounter: number;
  totalFetched: number;
  noMoreQuestions: boolean;

  addQuestion: (q: QuizQuestion) => void;
  setNoMoreQuestions: () => void;
  recordAnswer: (response: AttemptAnswerResponse) => void;
  nextQuestion: () => void;
  isSessionComplete: () => boolean;
  resetSession: () => void;
}

interface CompletedQuestion {
  question: QuizQuestion;
  response: AttemptAnswerResponse;
}

export const useQuizSessionStore = create<QuizSessionStore>((set, get) => ({
  questionQueue: [],
  currentIndex: 0,
  answeredCount: 0,
  correctCount: 0,
  wrongCount: 0,
  completedQuestions: [],
  fetchCounter: 0,
  totalFetched: 0,
  noMoreQuestions: false,

  addQuestion: (q) => set(s => ({
    questionQueue: [...s.questionQueue, q],
    totalFetched: s.totalFetched + 1,
    noMoreQuestions: false,
  })),

  setNoMoreQuestions: () => set({ noMoreQuestions: true }),

  recordAnswer: (response) => {
    const { currentIndex, questionQueue, correctCount, wrongCount } = get();
    const question = questionQueue[currentIndex];
    if (!question) return;
    set({
      answeredCount: get().answeredCount + 1,
      correctCount: response.isCorrect ? correctCount + 1 : correctCount,
      wrongCount: response.isCorrect ? wrongCount : wrongCount + 1,
      completedQuestions: [...get().completedQuestions, { question, response }],
    });
  },

  // Bumps fetchCounter ONLY — no longer touches sessionId.
  // React Query watches fetchCounter for its query key.
  nextQuestion: () => set(s => ({ currentIndex: s.currentIndex + 1, fetchCounter: s.fetchCounter + 1 })),

  isSessionComplete: () => {
    const { noMoreQuestions, totalFetched } = get();
    return noMoreQuestions && totalFetched >= 1;
  },

  resetSession: () => set({
    questionQueue: [],
    currentIndex: 0,
    answeredCount: 0,
    correctCount: 0,
    wrongCount: 0,
    completedQuestions: [],
    fetchCounter: 0,
    totalFetched: 0,
    noMoreQuestions: false,
  }),
}));
