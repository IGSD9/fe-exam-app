import { DEFAULT_QUALIFICATION_ID } from "./config";
import { validateQuestionBank } from "./question-validate";
import { SEED_QUESTIONS } from "./questions-seed";
import type { Question } from "../types";

const bankErrors = validateQuestionBank(SEED_QUESTIONS);
if (bankErrors.length > 0) {
  throw new Error(`問題データの不備: ${bankErrors.join(" / ")}`);
}

export function listQuestions(qualificationId = DEFAULT_QUALIFICATION_ID): Question[] {
  return SEED_QUESTIONS.filter((item) => item.qualificationId === qualificationId).sort(
    (a, b) => a.year.localeCompare(b.year) || a.questionNumber - b.questionNumber,
  );
}

export function getQuestion(id: string): Question | null {
  return SEED_QUESTIONS.find((item) => item.id === id) ?? null;
}

export function toPublicQuestion(question: Question) {
  return {
    id: question.id,
    qualificationId: question.qualificationId,
    year: question.year,
    category: question.category,
    questionNumber: question.questionNumber,
    questionText: question.questionText,
    options: question.options,
    imageUrl: question.imageUrl,
  };
}
