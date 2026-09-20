import type { ApiResponse } from "../types";

export class ApiRequestError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const json = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !json?.data) {
    throw new ApiRequestError(
      json?.error?.code ?? "INTERNAL_ERROR",
      json?.error?.message ?? "通信に失敗しました。再試行してください",
      response.status,
    );
  }
  return json.data;
}
