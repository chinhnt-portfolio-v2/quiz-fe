import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizApi } from '@/api/quiz';
import type { AttemptAnswerRequest } from '@/types/quiz.types';

export const QUIZ_KEYS = {
  topics: ['quiz', 'topics'] as const,
  nextQuestion: (topics: string[]) => ['quiz', 'next', topics] as const,
  missed: ['quiz', 'missed'] as const,
  progress: (slug: string) => ['quiz', 'progress', slug] as const,
};

export function useTopics() {
  return useQuery({ queryKey: QUIZ_KEYS.topics, queryFn: quizApi.getTopics });
}

export function useNextQuestion(topics: string[]) {
  return useQuery({
    queryKey: QUIZ_KEYS.nextQuestion(topics),
    queryFn: () => quizApi.getNextQuestion(topics, 1),
    enabled: topics.length > 0,
  });
}

export function useSubmitAnswer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: AttemptAnswerRequest) => quizApi.submitAnswer(req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUIZ_KEYS.topics });
      qc.invalidateQueries({ queryKey: QUIZ_KEYS.missed });
    },
  });
}

export function useMissedQuestions() {
  return useQuery({ queryKey: QUIZ_KEYS.missed, queryFn: quizApi.getMissedQuestions });
}

export function useProgress(topicSlug: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.progress(topicSlug),
    queryFn: () => quizApi.getProgress(topicSlug),
  });
}
