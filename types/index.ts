export type QualificationId = string;

export type QuestionOption = string;

export type CorrectIndex = 0 | 1 | 2 | 3;

export type Question = {
  id: string;
  qualificationId: QualificationId;
  year: string;
  category: string;
  questionNumber: number;
  questionText: string;
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption];
  correctIndex: CorrectIndex;
  explanation: string | null;
  imageUrl: string | null;
};

export type QuestionPublic = Omit<Question, "correctIndex" | "explanation">;

export type QuestionListItem = {
  id: string;
  year: string;
  category: string;
  questionNumber: number;
  locked: boolean;
  lastCorrect: boolean | null;
  answeredCount: number;
};

export type UserAnswer = {
  id: string;
  userId: string;
  questionId: string;
  selectedIndex: CorrectIndex;
  isCorrect: boolean;
  answeredAt: string;
};

export type AppUser = {
  id: string;
  email: string | null;
  passwordHash?: string | null;
  isAnonymous: boolean;
  createdAt: string;
};

export type RecentAnswer = {
  questionId: string;
  year: string;
  category: string;
  questionNumber: number;
  isCorrect: boolean;
  answeredAt: string;
};

export type UserSubscription = {
  userId: string;
  isPro: boolean;
  purchasedAt: string | null;
};

export type CategoryStat = {
  category: string;
  answeredUnique: number;
  correctUnique: number;
  totalQuestions: number;
  achievementPercent: number;
};

export type DashboardStats = {
  qualificationTitle: string;
  totalAnswers: number;
  correctCount: number;
  accuracyPercent: number | null;
  recentWrongCount: number;
  categoryStats: CategoryStat[];
  isPro: boolean;
  continueQuestionId: string | null;
  recentAnswers: RecentAnswer[];
};

export type SessionInfo = {
  userId: string;
  email: string | null;
  isAnonymous: boolean;
  isPro: boolean;
};

export type ApiError = {
  code: string;
  message: string;
};

export type ApiResponse<T> = {
  data?: T;
  error?: ApiError;
};
