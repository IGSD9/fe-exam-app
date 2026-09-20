import { ensureSession, getSessionInfo, switchSessionUser, clearSession } from "./session";
import { getSubscription, loginUser, registerUser } from "./store";
import type { SessionInfo } from "../types";

export async function toSessionInfo(userId: string, email: string | null, isAnonymous: boolean): Promise<SessionInfo> {
  const subscription = await getSubscription(userId);
  return {
    userId,
    email,
    isAnonymous,
    isPro: subscription.isPro,
  };
}

export async function registerCurrentUser(email: string, password: string) {
  const session = await ensureSession();
  const user = await registerUser(session.userId, email, password);
  return toSessionInfo(user.id, user.email, user.isAnonymous);
}

export async function loginWithPassword(email: string, password: string) {
  const user = await loginUser(email, password);
  if (!user) return null;
  await switchSessionUser(user.id);
  return toSessionInfo(user.id, user.email, user.isAnonymous);
}

export async function logoutCurrentUser() {
  await clearSession();
  return ensureSession();
}

export { getSessionInfo, ensureSession };
