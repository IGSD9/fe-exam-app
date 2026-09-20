import { canAccessYear, getLatestYear } from "@/lib/access";
import { DEFAULT_QUALIFICATION_ID } from "@/lib/config";
import { jsonData } from "@/lib/http";
import { listQuestions } from "@/lib/questions";
import { ensureSession } from "@/lib/session";
import { listAnswers } from "@/lib/store";
import { annotateQuestionList } from "@/lib/stats";

export async function GET(request: Request) {
  const session = await ensureSession();

  const params = new URL(request.url).searchParams;
  const qualificationId = params.get("qualificationId") ?? DEFAULT_QUALIFICATION_ID;
  const year = params.get("year");
  const category = params.get("category");

  const all = listQuestions(qualificationId);
  const questions = all.filter((item) => {
    if (year && item.year !== year) return false;
    if (category && item.category !== category) return false;
    return true;
  });
  const latestYear = getLatestYear(all.map((item) => item.year));
  const answers = await listAnswers(session.userId);
  const annotations = annotateQuestionList(questions, answers);

  return jsonData({
    latestYear,
    isPro: session.isPro,
    items: questions.map((item, index) => ({
      id: item.id,
      year: item.year,
      category: item.category,
      questionNumber: item.questionNumber,
      locked: !canAccessYear(session.isPro, item.year, latestYear),
      lastCorrect: annotations[index]?.lastCorrect ?? null,
      answeredCount: annotations[index]?.answeredCount ?? 0,
    })),
  });
}
