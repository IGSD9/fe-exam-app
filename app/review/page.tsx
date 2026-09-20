"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { PageHeader } from "@/components/ui/PageHeader";
import { apiFetch } from "@/lib/client-api";

type ReviewResponse = {
  questionIds: string[];
  count: number;
};

export default function ReviewPage() {
  const router = useRouter();
  const [data, setData] = useState<ReviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      setData(await apiFetch<ReviewResponse>("/api/review"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "読み込めませんでした");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function start() {
    if (!data?.questionIds.length) return;
    sessionStorage.setItem("reviewQuestionIds", JSON.stringify(data.questionIds));
    router.push(`/practice/${data.questionIds[0]}?mode=review`);
  }

  return (
    <main className="safe-bottom px-4 pt-6">
      <PageHeader kicker="間違えた問題" title="弱点復習" />

      {error ? (
        <ErrorBox message={error} onRetry={() => void load()} />
      ) : !data ? (
        <div className="mt-5 h-40 animate-pulse rounded-3xl bg-white" />
      ) : data.count === 0 ? (
        <section className="mt-5 rounded-3xl bg-white p-6 text-center shadow-sm">
          <p className="font-bold">まだ復習する誤答がありません</p>
          <p className="mt-2 text-sm text-slate-500">演習で間違えた問題が、ここに集まります。</p>
          <Link
            href="/practice"
            className="mt-5 inline-flex rounded-full bg-blue-700 px-5 py-3 text-sm font-bold text-white"
          >
            演習へ
          </Link>
        </section>
      ) : (
        <section className="mt-5 rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-3xl font-bold text-blue-700">{data.count}</p>
          <p className="mt-1 text-sm text-slate-500">直近で間違えた問題を新しい順に出題します。</p>
          <button
            type="button"
            onClick={start}
            className="mt-5 w-full rounded-2xl bg-blue-700 py-3.5 text-sm font-bold text-white"
          >
            復習を始める
          </button>
        </section>
      )}
    </main>
  );
}
