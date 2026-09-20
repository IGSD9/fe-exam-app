import { jsonData } from "@/lib/http";
import { ensureSession } from "@/lib/session";
import { getSubscription } from "@/lib/store";

export async function POST() {
  const session = await ensureSession();

  const subscription = await getSubscription(session.userId);
  return jsonData({ isPro: subscription.isPro });
}
