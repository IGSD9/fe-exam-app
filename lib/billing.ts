import { setProStatus } from "./store";

export const PRO_ENTITLEMENT_ID = "pro";
export const PRO_PRODUCT_ID = "fe_unlock_all";

export async function applyProStatus(userId: string, purchasedAt = new Date()) {
  return setProStatus(userId, true, purchasedAt.toISOString());
}

export async function startPurchase(userId: string) {
  return applyProStatus(userId);
}

export async function restorePurchases(userId: string, isPro: boolean) {
  if (isPro) return applyProStatus(userId);
  return { userId, isPro: false, purchasedAt: null };
}
