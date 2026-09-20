import { DEFAULT_QUALIFICATION_ID } from "@/lib/config";
import { jsonData } from "@/lib/http";
import { listQuestions } from "@/lib/questions";
import { ensureSession } from "@/lib/session";
import { listAnswers } from "@/lib/store";
import { pickReviewQuestionIds } from "@/lib/stats";

export async function GET(request: Request) {
  const session = await ensureSession();

  const params = new URL(request.url).searchParams;
  const qualificationId = params.get("qualificationId") ?? DEFAULT_QUALIFICATION_ID;
  const rawLimit = Number(params.get("limit") ?? 20);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 50) : 20;

  const questions = listQuestions(qualificationId);
  const answers = (await listAnswers(session.userId)).filter((item) =>
    questions.some((question) => question.id === item.questionId),
  );
  const questionIds = pickReviewQuestionIds(questions, answers, session.isPro, limit);

  return jsonData({ questionIds, count: questionIds.length });
}
