export type QuizLevel = 'JUNIOR' | 'MIDDLE' | 'SENIOR';
export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'MULTIPLE_ANSWER';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: number;
  topicSlug: string;
  levelTag: QuizLevel;
  questionText: string;
  questionType: QuestionType;
  options: QuizOption[];
}

export interface SRSessionState {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  isRelearning: boolean;
  nextReviewAt: string;
}

export interface TopicStats {
  topicSlug: string;
  topicLabel: string;
  questionCount: number;
  coverage: { junior: number; middle: number; senior: number };
  userLevel: QuizLevel;
  currentStreak: number;
}

export interface AttemptAnswerRequest {
  questionId: number;
  givenKey: string;
  responseMs?: number;
}

export interface AttemptAnswerResponse {
  isCorrect: boolean;
  correctKey: string;
  explanation: string;
  srState: SRSessionState;
  streakDays: number;
}

export interface MissedQuestion {
  questionId: number;
  topicSlug: string;
  levelTag: QuizLevel;
  questionText: string;
  userAnswer: string;
  correctKey: string;
  explanation: string;
  attemptedAt: string;
}

export interface CoverageBreakdown {
  mastered: number;
  total: number;
  percent: number;
}

export interface QuizProgress {
  topicSlug: string;
  userLevel: QuizLevel;
  coverage: {
    junior: CoverageBreakdown;
    middle: CoverageBreakdown;
    senior: CoverageBreakdown;
  };
}

export interface SeedStatus {
  seeded: boolean;
  topicCount: number;
  questionCount: number;
}