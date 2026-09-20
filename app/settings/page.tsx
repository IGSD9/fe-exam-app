"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { PurchaseButton } from "@/components/billing/PurchaseButton";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { PageHeader } from "@/components/ui/PageHeader";
import { apiFetch } from "@/lib/client-api";
import type { SessionInfo } from "@/types";

export default function SettingsPage() {
  return (
    <Suspense fallback={<main className="safe-bottom px-4 pt-6">読み込み中...</main>}>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const fromLock = searchParams.get("from") === "lock";
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setSession(await apiFetch<SessionInfo>("/api/session"));
  }

  useEffect(() => {
    void load().catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "読み込めませんでした");
    });
  }, []);

  async function purchase() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const result = await apiFetch<{ isPro: boolean }>("/api/billing/purchase", { method: "POST" });
      setSession((current) => (current ? { ...current, isPro: result.isPro } : current));
      setMessage("全問題を解放しました。広告も非表示になります。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "購入を完了できませんでした");
    } finally {
      setBusy(false);
    }
  }

  async function restore() {
    setBusy(true);
    setError(null);
    try {
      const result = await apiFetch<{ isPro: boolean }>("/api/billing/restore", { method: "POST" });
      setSession((current) => (current ? { ...current, isPro: result.isPro } : current));
      setMessage(result.isPro ? "購入を復元しました。" : "復元できる購入はありません。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "購入の確認に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  async function register(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await apiFetch<SessionInfo>("/api/account", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setSession(result);
      setMessage("アカウントを登録しました。学習履歴はそのまま引き継がれます。");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登録できませんでした");
    } finally {
      setBusy(false);
    }
  }

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await apiFetch<SessionInfo>("/api/account/login", {
        method: "POST",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      setSession(result);
      setMessage("ログインしました。");
      setLoginPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログインできませんでした");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    setError(null);
    try {
      const result = await apiFetch<SessionInfo>("/api/session", { method: "DELETE" });
      setSession(result);
      setMessage("ログアウトしました。新しい匿名セッションで続けます。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログアウトできませんでした");
    } finally {
      setBusy(false);
    }
  }

  async function resetAnswers() {
    if (!window.confirm("この端末の解答履歴を削除します。よろしいですか？")) return;
    setBusy(true);
    setError(null);
    try {
      await apiFetch("/api/answers", { method: "DELETE" });
      setMessage("解答履歴を削除しました。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "削除できませんでした");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="safe-bottom px-4 pt-6">
      <PageHeader kicker="アカウントとプラン" title="設定" />

      {fromLock ? (
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          この年度を解くには、全問題解放が必要です。
        </p>
      ) : null}

      {error && !session ? <ErrorBox message={error} onRetry={() => void load()} /> : null}

      {!session ? (
        <div className="mt-5 h-40 animate-pulse rounded-3xl bg-white" />
      ) : (
        <div className="mt-5 space-y-4">
          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-xs text-slate-500">アカウント</p>
            <p className="mt-1 font-bold">{session.isAnonymous ? "匿名ユーザー" : session.email}</p>
            <p className="mt-3 text-xs text-slate-500">プラン</p>
            <p className="mt-1 font-bold">{session.isPro ? "Pro（全問解放・広告なし）" : "無料（直近年度のみ）"}</p>
          </section>

          {!session.isPro ? (
            <section className="rounded-3xl bg-slate-900 p-5 text-white shadow-sm">
              <h2 className="text-lg font-bold">全問題解放＆広告非表示</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                過去年度を含む全問題を開放し、演習中の広告を消します。単発の買い切りです。
              </p>
              <p className="mt-4 text-xs text-slate-400">
                開発中はストア決済の代わりに、このボタンで Pro 状態を付与します。
              </p>
              <div className="mt-4">
                <PurchaseButton loading={busy} onClick={() => void purchase()} />
              </div>
            </section>
          ) : (
            <section className="rounded-3xl bg-emerald-50 p-5 text-emerald-900">
              すでに全問題が開放されています。
            </section>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={() => void restore()}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-bold"
          >
            購入を復元
          </button>

          {session.isAnonymous ? (
            <>
              <form onSubmit={(event) => void register(event)} className="rounded-3xl bg-white p-5 shadow-sm">
                <h2 className="font-bold">アカウント登録</h2>
                <p className="mt-1 text-sm text-slate-500">匿名の学習履歴を、このまま引き継ぎます。</p>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="メールアドレス"
                  className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
                />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="パスワード（8文字以上）"
                  className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-4 w-full rounded-2xl bg-slate-900 py-3 text-sm font-bold text-white"
                >
                  登録する
                </button>
              </form>

              <form onSubmit={(event) => void login(event)} className="rounded-3xl bg-white p-5 shadow-sm">
                <h2 className="font-bold">ログイン</h2>
                <p className="mt-1 text-sm text-slate-500">登録済みアカウントの履歴をこの端末で開きます。</p>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  placeholder="メールアドレス"
                  className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
                />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  placeholder="パスワード"
                  className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-4 w-full rounded-2xl border border-slate-200 py-3 text-sm font-bold"
                >
                  ログイン
                </button>
              </form>
            </>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => void logout()}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-bold"
            >
              ログアウト
            </button>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={() => void resetAnswers()}
            className="w-full rounded-2xl py-3 text-sm font-bold text-rose-600"
          >
            解答履歴をリセット
          </button>

          <nav className="flex justify-center gap-4 pt-2 text-xs text-slate-500">
            <Link href="/privacy" className="underline-offset-2 hover:underline">
              プライバシーポリシー
            </Link>
            <Link href="/contact" className="underline-offset-2 hover:underline">
              お問い合わせ
            </Link>
          </nav>

          {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
          {error && session ? <p className="text-sm text-rose-600">{error}</p> : null}
        </div>
      )}
    </main>
  );
}
