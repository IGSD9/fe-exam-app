import { canAccessYear, getLatestYear } from "./access";
import type { DashboardStats, Question, QuestionListItem, UserAnswer } from "../types";

export function buildDashboardStats(
  questions: Question[],
  answers: UserAnswer[],
  isPro: boolean,
  qualificationTitle: string,
): DashboardStats {
  const totalAnswers = answers.length;
  const correctCount = answers.filter((item) => item.isCorrect).length;
  const accuracyPercent =
    totalAnswers === 0 ? null : Math.round((correctCount / totalAnswers) * 1000) / 10;

  const latestWrongByQuestion = new Map<string, UserAnswer>();
  for (const answer of answers) {
    if (!answer.isCorrect) {
      const current = latestWrongByQuestion.get(answer.questionId);
      if (!current || current.answeredAt < answer.answeredAt) {
        latestWrongByQuestion.set(answer.questionId, answer);
      }
    }
  }
  const recentWrongCount = [...latestWrongByQuestion.values()]
    .sort((a, b) => (a.answeredAt < b.answeredAt ? 1 : -1))
    .slice(0, 20).length;

  const byCategory = new Map<string, Question[]>();
  for (const question of questions) {
    const list = byCategory.get(question.category) ?? [];
    list.push(question);
    byCategory.set(question.category, list);
  }

  const categoryStats = [...byCategory.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "ja"))
    .map(([category, items]) => {
      const ids = new Set(items.map((item) => item.id));
      const related = answers.filter((item) => ids.has(item.questionId));
      const answeredUnique = new Set(related.map((item) => item.questionId)).size;
      const correctUnique = new Set(
        related.filter((item) => item.isCorrect).map((item) => item.questionId),
      ).size;
      const totalQuestions = items.length;
      const achievementPercent =
        totalQuestions === 0
          ? 0
          : Math.round((correctUnique / totalQuestions) * 1000) / 10;
      return {
        category,
        answeredUnique,
        correctUnique,
        totalQuestions,
        achievementPercent,
      };
    });

  const questionMap = new Map(questions.map((item) => [item.id, item]));
  const recentAnswers = [...answers]
    .sort((a, b) => (a.answeredAt < b.answeredAt ? 1 : -1))
    .slice(0, 5)
    .flatMap((answer) => {
      const question = questionMap.get(answer.questionId);
      if (!question) return [];
      return [
        {
          questionId: question.id,
          year: question.year,
          category: question.category,
          questionNumber: question.questionNumber,
          isCorrect: answer.isCorrect,
          answeredAt: answer.answeredAt,
        },
      ];
    });

  return {
    qualificationTitle,
    totalAnswers,
    correctCount,
    accuracyPercent,
    recentWrongCount,
    categoryStats,
    isPro,
    continueQuestionId: pickContinueQuestionId(questions, answers, isPro),
    recentAnswers,
  };
}

export function pickContinueQuestionId(
  questions: Question[],
  answers: UserAnswer[],
  isPro: boolean,
): string | null {
  const latestYear = getLatestYear(questions.map((item) => item.year));
  const unlocked = questions
    .filter((item) => canAccessYear(isPro, item.year, latestYear))
    .sort((a, b) => a.year.localeCompare(b.year) || a.questionNumber - b.questionNumber);

  const correctIds = new Set(
    answers.filter((item) => item.isCorrect).map((item) => item.questionId),
  );
  const unanswered = unlocked.find((item) => !correctIds.has(item.id));
  return unanswered?.id ?? unlocked[0]?.id ?? null;
}

export function pickNextQuestionId(
  items: QuestionListItem[],
  current: Pick<QuestionListItem, "id" | "year" | "questionNumber">,
): string | undefined {
  return items
    .filter(
      (item) =>
        item.year === current.year &&
        !item.locked &&
        item.questionNumber > current.questionNumber,
    )
    .sort((a, b) => a.questionNumber - b.questionNumber)[0]?.id;
}

export function annotateQuestionList(questions: Question[], answers: UserAnswer[]) {
  return questions.map((item) => {
    const related = answers
      .filter((answer) => answer.questionId === item.id)
      .sort((a, b) => (a.answeredAt < b.answeredAt ? 1 : -1));
    return {
      lastCorrect: related[0]?.isCorrect ?? null,
      answeredCount: related.length,
    };
  });
}

export function pickReviewQuestionIds(
  questions: Question[],
  answers: UserAnswer[],
  isPro: boolean,
  limit: number,
): string[] {
  const latestYear = getLatestYear(questions.map((item) => item.year));
  const questionMap = new Map(questions.map((item) => [item.id, item]));
  const latestWrong = new Map<string, UserAnswer>();

  for (const answer of answers) {
    if (!answer.isCorrect) {
      const current = latestWrong.get(answer.questionId);
      if (!current || current.answeredAt < answer.answeredAt) {
        latestWrong.set(answer.questionId, answer);
      }
    }
  }

  return [...latestWrong.values()]
    .sort((a, b) => (a.answeredAt < b.answeredAt ? 1 : -1))
    .map((item) => item.questionId)
    .filter((questionId) => {
      const question = questionMap.get(questionId);
      if (!question) return false;
      return canAccessYear(isPro, question.year, latestYear);
    })
    .slice(0, limit);
}
