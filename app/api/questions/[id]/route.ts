import { canAccessYear, getLatestYear } from "@/lib/access";
import { jsonData, jsonError } from "@/lib/http";
import { getQuestion, listQuestions, toPublicQuestion } from "@/lib/questions";
import { ensureSession } from "@/lib/session";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await ensureSession();

  const { id } = await context.params;
  const question = getQuestion(id);
  if (!question) return jsonError("NOT_FOUND", "問題が見つかりません", 404);

  const latestYear = getLatestYear(
    listQuestions(question.qualificationId).map((item) => item.year),
  );
  if (!canAccessYear(session.isPro, question.year, latestYear)) {
    return jsonError("ACCESS_DENIED", "この問題は全問解放後に利用できます", 403);
  }

  return jsonData({
    ...toPublicQuestion(question),
    isPro: session.isPro,
  });
}
