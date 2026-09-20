import { canAccessYear, getLatestYear } from "@/lib/access";
import { jsonData, jsonError } from "@/lib/http";
import { getQuestion, listQuestions } from "@/lib/questions";
import { ensureSession } from "@/lib/session";
import { addAnswer, clearAnswers } from "@/lib/store";
import type { CorrectIndex } from "@/types";

export async function POST(request: Request) {
  const session = await ensureSession();

  const body = (await request.json().catch(() => null)) as {
    questionId?: string;
    selectedIndex?: number;
  } | null;

  const selectedIndex = body?.selectedIndex;
  if (
    !body?.questionId ||
    selectedIndex === undefined ||
    selectedIndex < 0 ||
    selectedIndex > 3
  ) {
    return jsonError("VALIDATION_ERROR", "入力内容を確認してください", 400);
  }

  const question = getQuestion(body.questionId);
  if (!question) return jsonError("NOT_FOUND", "問題が見つかりません", 404);

  const latestYear = getLatestYear(
    listQuestions(question.qualificationId).map((item) => item.year),
  );
  if (!canAccessYear(session.isPro, question.year, latestYear)) {
    return jsonError("ACCESS_DENIED", "この問題は全問解放後に利用できます", 403);
  }

  const isCorrect = selectedIndex === question.correctIndex;
  await addAnswer({
    id: crypto.randomUUID(),
    userId: session.userId,
    questionId: question.id,
    selectedIndex: selectedIndex as CorrectIndex,
    isCorrect,
    answeredAt: new Date().toISOString(),
  });

  return jsonData({
    isCorrect,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    selectedIndex,
  });
}

export async function DELETE() {
  const session = await ensureSession();
  await clearAnswers(session.userId);
  return jsonData({ cleared: true });
}
