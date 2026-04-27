import api from './quiz-api';
import type {
  TopicStats, QuizQuestion, AttemptAnswerRequest, AttemptAnswerResponse,
  MissedQuestion, QuizProgress, SeedStatus, AttemptHistoryFilters,
} from '@/types/quiz.types';

export const quizApi = {
  getTopics: () => api.get<TopicStats[]>('/quiz/topics').then(r => r.data),

  getNextQuestion: (topics: string[], limit = 1, exclude?: number[], level?: string) =>
    api.get<QuizQuestion>('/quiz/questions/next', {
      params: { topics: topics.join(','), limit, exclude: exclude?.join(','), ...(level ? { level } : {}) },
    }).then(r => r.data),

  submitAnswer: (req: AttemptAnswerRequest) =>
    api.post<AttemptAnswerResponse>('/quiz/attempts', req).then(r => r.data),

  getMissedQuestions: () =>
    api.get<MissedQuestion[]>('/quiz/attempts/missed').then(r => r.data),

  getProgress: (topicSlug: string) =>
    api.get<QuizProgress>(`/quiz/progress/${topicSlug}`).then(r => r.data),

  getSeedStatus: () =>
    api.get<SeedStatus>('/quiz/seed/status').then(r => r.data),

  getAttemptHistory: (filters?: AttemptHistoryFilters) =>
    api.get('/quiz/attempts', { params: filters }).then(r => r.data),

  resetProgress: (topicSlug: string) =>
    api.delete(`/quiz/progress/${topicSlug}`),
};
