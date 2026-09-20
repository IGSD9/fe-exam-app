import { jsonData, jsonError } from "@/lib/http";
import { addInquiry } from "@/lib/store";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    email?: string;
    message?: string;
    company?: string;
  } | null;

  if (body?.company) {
    return jsonData({ ok: true });
  }

  const name = body?.name?.trim() ?? "";
  const email = body?.email?.trim() ?? "";
  const message = body?.message?.trim() ?? "";

  if (name.length < 1 || name.length > 80) {
    return jsonError("VALIDATION_ERROR", "お名前を入力してください", 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonError("VALIDATION_ERROR", "メールアドレスの形式が正しくありません", 400);
  }
  if (message.length < 10 || message.length > 2000) {
    return jsonError("VALIDATION_ERROR", "お問い合わせ内容は10文字以上で入力してください", 400);
  }

  await addInquiry({ name, email, message });
  return jsonData({ ok: true });
}
