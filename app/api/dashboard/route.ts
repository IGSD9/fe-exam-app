import { DEFAULT_QUALIFICATION_ID } from "@/lib/config";
import { jsonData } from "@/lib/http";
import { getQualificationTitle } from "@/lib/qualifications";
import { listQuestions } from "@/lib/questions";
import { ensureSession } from "@/lib/session";
import { listAnswers } from "@/lib/store";
import { buildDashboardStats } from "@/lib/stats";

export async function GET(request: Request) {
  const session = await ensureSession();

  const qualificationId =
    new URL(request.url).searchParams.get("qualificationId") ?? DEFAULT_QUALIFICATION_ID;
  const questions = listQuestions(qualificationId);
  const answers = (await listAnswers(session.userId)).filter((item) =>
    questions.some((question) => question.id === item.questionId),
  );

  return jsonData(
    buildDashboardStats(questions, answers, session.isPro, getQualificationTitle(qualificationId)),
  );
}
