import { NextResponse } from "next/server";
import type { ApiError } from "../types";

export function jsonData<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function jsonError(code: string, message: string, status: number) {
  const error: ApiError = { code, message };
  return NextResponse.json({ error }, { status });
}
