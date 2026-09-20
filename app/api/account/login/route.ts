import { loginWithPassword } from "@/lib/auth";
import { jsonData, jsonError } from "@/lib/http";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;

  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";
  const session = await loginWithPassword(email, password);
  if (!session) {
    return jsonError("VALIDATION_ERROR", "メールアドレスまたはパスワードが正しくありません", 400);
  }
  return jsonData(session);
}
