import { startPurchase } from "@/lib/billing";
import { jsonData } from "@/lib/http";
import { ensureSession } from "@/lib/session";

export async function POST() {
  const session = await ensureSession();
  const subscription = await startPurchase(session.userId);
  return jsonData({
    isPro: subscription.isPro,
    purchasedAt: subscription.purchasedAt,
  });
}
