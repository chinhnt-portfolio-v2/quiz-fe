import { create } from 'zustand';
import type { QuizQuestion, AttemptAnswerResponse } from '@/types/quiz.types';

interface QuizSessionStore {
  questionQueue: QuizQuestion[];
  currentIndex: number;
  answeredCount: number;
  correctCount: number;
  wrongCount: number;
  completedQuestions: CompletedQuestion[];

  setQueue: (questions: QuizQuestion[]) => void;
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

  setQueue: (questions) => set({
    questionQueue: questions,
    currentIndex: 0,
    answeredCount: 0,
    correctCount: 0,
    wrongCount: 0,
    completedQuestions: [],
  }),

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

  nextQuestion: () => set(s => ({ currentIndex: s.currentIndex + 1 })),

  isSessionComplete: () => {
    const { currentIndex, questionQueue } = get();
    return currentIndex >= questionQueue.length;
  },

  resetSession: () => set({
    questionQueue: [],
    currentIndex: 0,
    answeredCount: 0,
    correctCount: 0,
    wrongCount: 0,
    completedQuestions: [],
  }),
}));
