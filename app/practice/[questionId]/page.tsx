"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { BannerAd } from "@/components/ads/BannerAd";
import { LockOverlay } from "@/components/layout/LockOverlay";
import { ExplanationPanel } from "@/components/quiz/ExplanationPanel";
import { OptionButton, type OptionState } from "@/components/quiz/OptionButton";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { formatYear } from "@/lib/access";
import { ApiRequestError, apiFetch } from "@/lib/client-api";
import { pickNextQuestionId } from "@/lib/stats";
import type { CorrectIndex, QuestionListItem, QuestionPublic } from "@/types";

type QuestionResponse = QuestionPublic & { isPro: boolean };
type AnswerResponse = {
  isCorrect: boolean;
  correctIndex: CorrectIndex;
  explanation: string | null;
  selectedIndex: number;
};
type ListResponse = {
  items: QuestionListItem[];
};

const REVIEW_KEY = "reviewQuestionIds";

export default function QuizPage() {
  return (
    <Suspense fallback={<main className="safe-bottom px-4 pt-6">読み込み中...</main>}>
      <QuizContent />
    </Suspense>
  );
}

function QuizContent() {
  const params = useParams<{ questionId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const questionId = params.questionId;
  const isReview = searchParams.get("mode") === "review";

  const [question, setQuestion] = useState<QuestionResponse | null>(null);
  const [list, setList] = useState<QuestionListItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "answered" | "locked" | "error">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reviewIds = useMemo(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(sessionStorage.getItem(REVIEW_KEY) ?? "[]") as string[];
    } catch {
      return [];
    }
  }, [questionId, isReview]);

  async function load() {
    setStatus("loading");
    setSelectedIndex(null);
    setResult(null);
    setError(null);
    try {
      const [detail, catalog] = await Promise.all([
        apiFetch<QuestionResponse>(`/api/questions/${questionId}`),
        apiFetch<ListResponse>("/api/questions"),
      ]);
      setQuestion(detail);
      setList(catalog.items);
      setStatus("ready");
    } catch (err) {
      if (err instanceof ApiRequestError && err.code === "ACCESS_DENIED") {
        setStatus("locked");
        return;
      }
      setError(err instanceof Error ? err.message : "読み込めませんでした");
      setStatus("error");
    }
  }

  useEffect(() => {
    void load();
  }, [questionId]);

  const nextId = useMemo(() => {
    if (isReview) {
      const index = reviewIds.indexOf(questionId);
      return index >= 0 ? reviewIds[index + 1] : undefined;
    }
    if (!question) return undefined;
    return pickNextQuestionId(list, question);
  }, [isReview, reviewIds, questionId, question, list]);

  const progress = useMemo(() => {
    if (isReview) {
      const index = reviewIds.indexOf(questionId);
      return { current: index + 1, total: reviewIds.length };
    }
    if (!question) return undefined;
    const siblings = list
      .filter((item) => item.year === question.year)
      .sort((a, b) => a.questionNumber - b.questionNumber);
    const index = siblings.findIndex((item) => item.id === question.id);
    return { current: index + 1, total: siblings.length };
  }, [isReview, reviewIds, questionId, question, list]);

  async function handleSelect(index: number) {
    if (status !== "ready" || submitting) return;
    setSubmitting(true);
    setSelectedIndex(index);
    try {
      const data = await apiFetch<AnswerResponse>("/api/answers", {
        method: "POST",
        body: JSON.stringify({ questionId, selectedIndex: index }),
      });
      setResult(data);
      setStatus("answered");
    } catch (err) {
      setSelectedIndex(null);
      setError(err instanceof Error ? err.message : "保存に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  function optionState(index: number): OptionState {
    if (status === "ready") return "idle";
    if (!result) return "disabled";
    if (index === result.selectedIndex && result.isCorrect) return "selected-correct";
    if (index === result.selectedIndex && !result.isCorrect) return "selected-wrong";
    if (index === result.correctIndex) return "reveal-correct";
    return "disabled";
  }

  function goNext() {
    if (nextId) {
      router.push(`/practice/${nextId}${isReview ? "?mode=review" : ""}`);
      return;
    }
    if (isReview) {
      router.push("/dashboard?reviewed=1");
      return;
    }
    router.push("/practice");
  }

  return (
    <main className="safe-bottom px-4 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <Link href={isReview ? "/review" : "/practice"} className="text-sm text-slate-500">
          ← 戻る
        </Link>
        <h1 className="text-sm font-bold">{isReview ? "弱点復習" : "問題演習"}</h1>
        <span className="w-10" />
      </div>

      {status === "loading" ? <div className="h-64 animate-pulse rounded-3xl bg-white" /> : null}
      {status === "error" ? (
        <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
          {error}
          <button type="button" onClick={() => void load()} className="ml-2 font-bold underline">
            再試行
          </button>
        </div>
      ) : null}
      {status === "locked" ? <LockOverlay /> : null}

      {question && (status === "ready" || status === "answered") ? (
        <div className="space-y-4">
          <QuestionCard
            yearLabel={formatYear(question.year)}
            category={question.category}
            questionNumber={question.questionNumber}
            questionText={question.questionText}
            imageUrl={question.imageUrl}
            progress={progress}
          />
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <OptionButton
                key={`${index}-${option}`}
                index={index}
                label={option}
                state={optionState(index)}
                onSelect={handleSelect}
              />
            ))}
          </div>
          {error && status === "ready" ? (
            <p className="text-sm text-rose-600">{error}</p>
          ) : null}
          {result ? <ExplanationPanel explanation={result.explanation} correctIndex={result.correctIndex} /> : null}
          {status === "answered" ? (
            <button
              type="button"
              onClick={goNext}
              className="w-full rounded-2xl bg-blue-700 py-3.5 text-sm font-bold text-white"
            >
              {nextId ? "次の問題" : isReview ? "復習完了" : "一覧へ戻る"}
            </button>
          ) : null}
          <BannerAd enabled={!question.isPro} />
        </div>
      ) : null}
    </main>
  );
}
