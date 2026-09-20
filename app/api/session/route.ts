import { jsonData } from "@/lib/http";
import { clearSession, ensureSession } from "@/lib/session";

export async function GET() {
  return jsonData(await ensureSession());
}

export async function POST() {
  return jsonData(await ensureSession());
}

export async function DELETE() {
  await clearSession();
  return jsonData(await ensureSession());
}
