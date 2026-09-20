"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatYear } from "@/lib/access";
import { apiFetch } from "@/lib/client-api";
import type { QuestionListItem } from "@/types";

type ListResponse = {
  latestYear: string | null;
  isPro: boolean;
  items: QuestionListItem[];
};

export default function PracticeSelectPage() {
  const [data, setData] = useState<ListResponse | null>(null);
  const [year, setYear] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const result = await apiFetch<ListResponse>("/api/questions");
      setData(result);
      setYear((current) => current || result.latestYear || result.items[0]?.year || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "読み込めませんでした");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const years = useMemo(
    () => [...new Set(data?.items.map((item) => item.year) ?? [])].sort().reverse(),
    [data],
  );
  const categories = useMemo(
    () =>
      [...new Set(data?.items.filter((item) => item.year === year).map((item) => item.category) ?? [])].sort(
        (a, b) => a.localeCompare(b, "ja"),
      ),
    [data, year],
  );
  const items =
    data?.items.filter(
      (item) => item.year === year && (category === "all" || item.category === category),
    ) ?? [];

  return (
    <main className="safe-bottom px-4 pt-6">
      <PageHeader kicker="問題を選ぶ" title="演習" />

      {error ? (
        <ErrorBox message={error} onRetry={() => void load()} />
      ) : !data ? (
        <div className="mt-5 h-48 animate-pulse rounded-3xl bg-white" />
      ) : (
        <>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {years.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setYear(item);
                  setCategory("all");
                }}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
                  year === item ? "bg-blue-700 text-white" : "bg-white text-slate-600"
                }`}
              >
                {formatYear(item)}
                {data.latestYear === item ? " ・無料" : data.isPro ? "" : " ・ロック"}
              </button>
            ))}
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                category === "all" ? "bg-slate-900 text-white" : "bg-white text-slate-600"
              }`}
            >
              すべての分野
            </button>
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                  category === item ? "bg-slate-900 text-white" : "bg-white text-slate-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <ul className="mt-4 space-y-3">
            {items.map((item) =>
              item.locked ? (
                <li key={item.id}>
                  <Link
                    href="/settings?from=lock"
                    className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 opacity-70 shadow-sm"
                  >
                    <div>
                      <p className="text-sm font-bold">
                        問{item.questionNumber} {item.category}
                      </p>
                      <p className="text-xs text-slate-500">全問解放後に利用できます</p>
                    </div>
                    <span className="text-lg" aria-hidden>
                      🔒
                    </span>
                  </Link>
                </li>
              ) : (
                <li key={item.id}>
                  <Link
                    href={`/practice/${item.id}`}
                    className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm"
                  >
                    <div>
                      <p className="text-sm font-bold">
                        問{item.questionNumber} {item.category}
                      </p>
                      <p className="text-xs text-slate-500">{formatYear(item.year)}</p>
                    </div>
                    <StatusBadge lastCorrect={item.lastCorrect} />
                  </Link>
                </li>
              ),
            )}
          </ul>
        </>
      )}
    </main>
  );
}

function StatusBadge({ lastCorrect }: { lastCorrect: boolean | null }) {
  if (lastCorrect === true) {
    return <span className="text-xs font-bold text-emerald-700">正解済み</span>;
  }
  if (lastCorrect === false) {
    return <span className="text-xs font-bold text-rose-600">要復習</span>;
  }
  return <span className="text-slate-400">›</span>;
}
