import { promises as fs } from "fs";
import path from "path";
import { hashPassword, verifyPassword } from "./password";
import type { AppUser, UserAnswer, UserSubscription } from "../types";

type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

type StoreData = {
  users: Record<string, AppUser>;
  answers: UserAnswer[];
  subscriptions: Record<string, UserSubscription>;
  inquiries: ContactInquiry[];
};

const STORE_PATH = process.env.VERCEL
  ? path.join("/tmp", "fe-store.json")
  : path.join(process.cwd(), "data", "store.json");

const emptyStore = (): StoreData => ({
  users: {},
  answers: [],
  subscriptions: {},
  inquiries: [],
});

let memory: StoreData | null = null;
let writeQueue: Promise<void> = Promise.resolve();

async function readStore(): Promise<StoreData> {
  if (memory) return memory;
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    memory = JSON.parse(raw) as StoreData;
    memory.inquiries ??= [];
    return memory;
  } catch {
    memory = emptyStore();
    return memory;
  }
}

async function writeStore(next: StoreData) {
  memory = next;
  writeQueue = writeQueue.then(async () => {
    try {
      await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
      await fs.writeFile(STORE_PATH, JSON.stringify(next, null, 2), "utf8");
    } catch {
      // Vercel など書き込み不可な環境ではメモリ上だけで継続する
    }
  });
  await writeQueue;
}

export async function getOrCreateUser(userId?: string | null): Promise<AppUser> {
  const store = await readStore();
  if (userId && store.users[userId]) return store.users[userId];

  const user: AppUser = {
    id: crypto.randomUUID(),
    email: null,
    isAnonymous: true,
    createdAt: new Date().toISOString(),
  };
  store.users[user.id] = user;
  store.subscriptions[user.id] = {
    userId: user.id,
    isPro: false,
    purchasedAt: null,
  };
  await writeStore(store);
  return user;
}

export async function getUser(userId: string): Promise<AppUser | null> {
  const store = await readStore();
  return store.users[userId] ?? null;
}

export async function registerUser(userId: string, email: string, password: string): Promise<AppUser> {
  const store = await readStore();
  const user = store.users[userId];
  if (!user) throw new Error("USER_NOT_FOUND");
  const taken = Object.values(store.users).find(
    (item) => item.id !== userId && item.email?.toLowerCase() === email.toLowerCase(),
  );
  if (taken) throw new Error("EMAIL_TAKEN");
  user.email = email;
  user.passwordHash = hashPassword(password);
  user.isAnonymous = false;
  await writeStore(store);
  return user;
}

export async function loginUser(email: string, password: string): Promise<AppUser | null> {
  const store = await readStore();
  const user = Object.values(store.users).find(
    (item) => item.email?.toLowerCase() === email.toLowerCase(),
  );
  if (!user || !verifyPassword(password, user.passwordHash)) return null;
  return user;
}

export async function getSubscription(userId: string): Promise<UserSubscription> {
  const store = await readStore();
  return (
    store.subscriptions[userId] ?? {
      userId,
      isPro: false,
      purchasedAt: null,
    }
  );
}

export async function setProStatus(
  userId: string,
  isPro: boolean,
  purchasedAt?: string,
): Promise<UserSubscription> {
  const store = await readStore();
  const current = store.subscriptions[userId] ?? {
    userId,
    isPro: false,
    purchasedAt: null,
  };
  const next: UserSubscription = {
    userId,
    isPro,
    purchasedAt: isPro ? purchasedAt ?? new Date().toISOString() : current.purchasedAt,
  };
  store.subscriptions[userId] = next;
  await writeStore(store);
  return next;
}

export async function addAnswer(answer: UserAnswer): Promise<UserAnswer> {
  const store = await readStore();
  store.answers.push(answer);
  await writeStore(store);
  return answer;
}

export async function listAnswers(userId: string): Promise<UserAnswer[]> {
  const store = await readStore();
  return store.answers.filter((item) => item.userId === userId);
}

export async function clearAnswers(userId: string) {
  const store = await readStore();
  store.answers = store.answers.filter((item) => item.userId !== userId);
  await writeStore(store);
}

export async function addInquiry(input: { name: string; email: string; message: string }) {
  const store = await readStore();
  const inquiry: ContactInquiry = {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    message: input.message,
    createdAt: new Date().toISOString(),
  };
  store.inquiries.push(inquiry);
  await writeStore(store);
  return { id: inquiry.id };
}
