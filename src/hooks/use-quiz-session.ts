import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuizSessionStore } from '@/stores/quiz-session-store';
import { useNextQuestion, useSubmitAnswer } from './use-quiz';

export function useQuizSession() {
  const [searchParams] = useSearchParams();
  const topics = searchParams.get('topics')?.split(',').filter(Boolean) ?? [];

  const {
    questionQueue, currentIndex, correctCount, wrongCount,
    addQuestion, recordAnswer, nextQuestion, isSessionComplete, resetSession,
    fetchCounter, totalFetched, setNoMoreQuestions,
  } = useQuizSessionStore();

  // fetchCounter increments on "Next" → React Query fires a new fetch.
  // Pass answered question IDs so BE can exclude them (avoids tx-timing duplicate).
  const answeredIds = questionQueue.map(q => q.id);
  const { data: nextQuestionData, error: nextQuestionError, isError } = useNextQuestion(topics, fetchCounter, answeredIds);
  const submitAnswer = useSubmitAnswer();

  const currentQuestion = questionQueue[currentIndex] ?? null;
  const isComplete = isSessionComplete();

  // Add newly arrived question to the queue.
  useEffect(() => {
    if (!nextQuestionData) return;
    const queue = useQuizSessionStore.getState().questionQueue;
    if (!queue.some(q => q.id === nextQuestionData.id)) {
      addQuestion(nextQuestionData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextQuestionData]);

  // Backend returned 404 = no more questions for this topic → end session.
  useEffect(() => {
    if (!isError || !nextQuestionError) return;
    const err = nextQuestionError as { response?: { status?: number } };
    if (err?.response?.status === 404) {
      setNoMoreQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, nextQuestionError]);

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
    totalQuestions: totalFetched,
    correctCount,
    wrongCount,
    isComplete,
    totalAnswered: correctCount + wrongCount,
    isSubmitting: submitAnswer.isPending,
    handleAnswer,
    nextQuestion,
    resetSession,
  };
}
