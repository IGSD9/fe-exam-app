import { registerCurrentUser } from "@/lib/auth";
import { jsonData, jsonError } from "@/lib/http";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;

  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonError("VALIDATION_ERROR", "メールアドレスの形式が正しくありません", 400);
  }
  if (password.length < 8) {
    return jsonError("VALIDATION_ERROR", "パスワードは8文字以上にしてください", 400);
  }

  try {
    return jsonData(await registerCurrentUser(email, password));
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_TAKEN") {
      return jsonError("VALIDATION_ERROR", "このメールアドレスは既に登録されています", 400);
    }
    return jsonError("INTERNAL_ERROR", "登録できませんでした", 500);
  }
}
