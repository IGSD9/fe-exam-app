"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { PageHeader } from "@/components/ui/PageHeader";
import { Toast } from "@/components/ui/Toast";
import { formatYear } from "@/lib/access";
import { apiFetch } from "@/lib/client-api";
import type { DashboardStats } from "@/types";

export default function DashboardPage() {
  return (
    <Suspense fallback={<main className="safe-bottom px-4 pt-6">読み込み中...</main>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const reviewed = searchParams.get("reviewed") === "1";
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      setStats(await apiFetch<DashboardStats>("/api/dashboard"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "読み込めませんでした");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <main className="safe-bottom px-4 pt-6">
      <PageHeader
        kicker={stats?.qualificationTitle ?? "学習状況"}
        title="ダッシュボード"
        action={
          stats?.isPro ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              Pro
            </span>
          ) : null
        }
      />
      {reviewed ? <Toast message="弱点復習が完了しました。" /> : null}

      {error ? (
        <ErrorBox message={error} onRetry={() => void load()} />
      ) : !stats ? (
        <div className="mt-5 h-48 animate-pulse rounded-3xl bg-white" />
      ) : (
        <>
          <section className="mt-5 grid grid-cols-3 gap-3">
            <StatCard label="総解答数" value={`${stats.totalAnswers}`} />
            <StatCard
              label="正答率"
              value={stats.accuracyPercent === null ? "未解答" : `${stats.accuracyPercent}%`}
            />
            <StatCard label="直近誤答" value={`${stats.recentWrongCount}`} />
          </section>

          <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="font-bold">分野別の達成度</h2>
            {stats.totalAnswers === 0 ? (
              <p className="mt-3 text-sm leading-6 text-slate-500">
                まずは 1 問解いてみましょう。分野ごとの達成度がここに表示されます。
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {stats.categoryStats.map((item) => (
                  <li key={item.category}>
                    <div className="mb-1 flex justify-between text-xs text-slate-500">
                      <span>{item.category}</span>
                      <span>
                        {item.correctUnique}/{item.totalQuestions}問
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${Math.min(item.achievementPercent, 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {stats.recentAnswers.length > 0 ? (
            <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="font-bold">最近の解答</h2>
              <ul className="mt-3 space-y-2">
                {stats.recentAnswers.map((item) => (
                  <li key={`${item.questionId}-${item.answeredAt}`}>
                    <Link
                      href={`/practice/${item.questionId}`}
                      className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm"
                    >
                      <span>
                        {formatYear(item.year)} 問{item.questionNumber} {item.category}
                      </span>
                      <span className={item.isCorrect ? "text-emerald-700" : "text-rose-600"}>
                        {item.isCorrect ? "正解" : "不正解"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mt-4 grid gap-3">
            {stats.continueQuestionId ? (
              <Link
                href={`/practice/${stats.continueQuestionId}`}
                className="rounded-2xl bg-blue-700 px-4 py-4 text-center text-sm font-bold text-white"
              >
                {stats.totalAnswers === 0 ? "演習を始める" : "続きから解く"}
              </Link>
            ) : (
              <Link
                href="/practice"
                className="rounded-2xl bg-blue-700 px-4 py-4 text-center text-sm font-bold text-white"
              >
                演習を始める
              </Link>
            )}
            <Link
              href="/review"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-sm font-bold text-slate-800"
            >
              弱点を復習する（{stats.recentWrongCount}件）
            </Link>
          </div>
        </>
      )}
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-3 py-4 text-center shadow-sm">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}
