import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./config";
import { getOrCreateUser, getSubscription, getUser } from "./store";
import type { SessionInfo } from "../types";

export async function readUserIdFromCookie() {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value ?? null;
}

export async function requireUserId() {
  const userId = await readUserIdFromCookie();
  if (!userId) return null;
  const user = await getUser(userId);
  return user?.id ?? null;
}

export async function ensureSession(): Promise<SessionInfo> {
  const existingId = await readUserIdFromCookie();
  const user = await getOrCreateUser(existingId);
  const subscription = await getSubscription(user.id);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return {
    userId: user.id,
    email: user.email,
    isAnonymous: user.isAnonymous,
    isPro: subscription.isPro,
  };
}

export async function switchSessionUser(userId: string): Promise<void> {
  const user = await getUser(userId);
  if (!user) throw new Error("USER_NOT_FOUND");
  const jar = await cookies();
  jar.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSessionInfo(): Promise<SessionInfo | null> {
  const userId = await requireUserId();
  if (!userId) return null;
  const user = await getUser(userId);
  if (!user) return null;
  const subscription = await getSubscription(user.id);
  return {
    userId: user.id,
    email: user.email,
    isAnonymous: user.isAnonymous,
    isPro: subscription.isPro,
  };
}
