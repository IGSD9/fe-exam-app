import { ensureSession } from "@/lib/auth";
import { jsonData } from "@/lib/http";

export async function GET() {
  return jsonData(await ensureSession());
}
