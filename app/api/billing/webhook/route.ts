import { jsonData, jsonError } from "@/lib/http";
import { setProStatus } from "@/lib/store";

export async function POST(request: Request) {
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
  const headerSecret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (secret && headerSecret !== secret) {
    return jsonError("UNAUTHENTICATED", "Webhook の検証に失敗しました", 401);
  }

  const body = (await request.json().catch(() => null)) as {
    event?: { app_user_id?: string; type?: string };
  } | null;

  const userId = body?.event?.app_user_id;
  const type = body?.event?.type ?? "";
  if (!userId) return jsonError("VALIDATION_ERROR", "ユーザーが特定できません", 400);

  const granting = ["INITIAL_PURCHASE", "NON_RENEWING_PURCHASE", "PRODUCT_CHANGE"];
  if (granting.includes(type)) {
    await setProStatus(userId, true);
  }

  return jsonData({ ok: true });
}
