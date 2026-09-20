"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/client-api";

export function StartButton({ label = "無料で演習を始める" }: { label?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setBusy(true);
    setError(null);
    try {
      await apiFetch("/api/session", { method: "POST" });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "開始できませんでした");
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={busy}
        onClick={() => void start()}
        className="w-full rounded-2xl bg-blue-700 px-4 py-4 text-sm font-bold text-white disabled:opacity-60"
      >
        {busy ? "準備しています..." : label}
      </button>
      {error ? <p className="mt-2 text-center text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
