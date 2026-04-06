import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuizSessionStore } from '@/stores/quiz-session-store';
import { useNextQuestion, useSubmitAnswer } from './use-quiz';

export function useQuizSession() {
  const [searchParams] = useSearchParams();
  const topics = searchParams.get('topics')?.split(',').filter(Boolean) ?? [];

  const {
    questionQueue, currentIndex, correctCount, wrongCount,
    setQueue, recordAnswer, nextQuestion, isSessionComplete, resetSession
  } = useQuizSessionStore();

  const { data: nextQuestionData } = useNextQuestion(topics);
  const submitAnswer = useSubmitAnswer();

  const currentQuestion = questionQueue[currentIndex] ?? null;
  const isComplete = isSessionComplete();
  const totalAnswered = correctCount + wrongCount;

  const loadMore = useCallback(() => {
    if (nextQuestionData) {
      // Read latest queue via get() to avoid stale closure
      const latestQueue = useQuizSessionStore.getState().questionQueue;
      setQueue([...latestQueue, nextQuestionData]);
    }
  }, [nextQuestionData, setQueue]);

  const handleAnswer = useCallback(async (givenKey: string) => {
    if (!currentQuestion) return;
    const response = await submitAnswer.mutateAsync({
      questionId: currentQuestion.id,
      givenKey,
    });
    recordAnswer(response);
    return response;
  }, [currentQuestion, submitAnswer, recordAnswer]);

  return {
    topics,
    currentQuestion,
    questionIndex: currentIndex,
    totalQuestions: questionQueue.length,
    correctCount,
    wrongCount,
    isComplete,
    totalAnswered,
    isSubmitting: submitAnswer.isPending,
    handleAnswer,
    nextQuestion,
    resetSession,
    loadMore,
  };
}
