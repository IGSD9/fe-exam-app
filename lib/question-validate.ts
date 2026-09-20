import type { Question } from "../types";

export function validateQuestion(input: unknown): string[] {
  const errors: string[] = [];
  if (!input || typeof input !== "object") return ["問題データがオブジェクトではありません"];
  const question = input as Partial<Question>;

  if (!question.id) errors.push("id がありません");
  if (!question.qualificationId) errors.push("qualificationId がありません");
  if (!question.year || !/^\d{4}-H[12]$/.test(question.year)) {
    errors.push("year は YYYY-H1 または YYYY-H2 にしてください");
  }
  if (!question.category) errors.push("category がありません");
  if (!Number.isInteger(question.questionNumber)) errors.push("questionNumber が整数ではありません");
  if (!question.questionText) errors.push("questionText がありません");
  if (!Array.isArray(question.options) || question.options.length !== 4) {
    errors.push("options は 4 件必要です");
  }
  if (
    question.correctIndex === undefined ||
    question.correctIndex < 0 ||
    question.correctIndex > 3
  ) {
    errors.push("correctIndex は 0〜3 にしてください");
  }
  return errors;
}

export function validateQuestionBank(questions: unknown[]): string[] {
  const errors: string[] = [];
  const keys = new Set<string>();
  questions.forEach((item, index) => {
    const local = validateQuestion(item);
    if (local.length) errors.push(`#${index + 1}: ${local.join(" / ")}`);
    const question = item as Question;
    const key = `${question.qualificationId}:${question.year}:${question.questionNumber}`;
    if (keys.has(key)) errors.push(`重複: ${key}`);
    keys.add(key);
  });
  return errors;
}
