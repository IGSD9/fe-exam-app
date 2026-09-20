"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/client-api";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await apiFetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, message, company }),
      });
      setDone(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信できませんでした");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className="rounded-3xl bg-emerald-50 p-5 text-sm leading-7 text-emerald-900">
        送信しました。内容を確認のうえ、必要に応じてご入力のメールアドレスへご連絡します。メールアドレスはサイト上には表示していません。
      </p>
    );
  }

  return (
    <form onSubmit={(event) => void submit(event)} className="space-y-3 rounded-3xl bg-white p-5 shadow-sm">
      <label className="block text-sm font-bold">
        お名前
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal"
        />
      </label>
      <label className="block text-sm font-bold">
        返信先メールアドレス
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal"
        />
      </label>
      <label className="block text-sm font-bold">
        お問い合わせ内容
        <textarea
          required
          minLength={10}
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal"
        />
      </label>
      <div className="hidden" aria-hidden>
        <label>
          会社名
          <input value={company} onChange={(event) => setCompany(event.target.value)} tabIndex={-1} />
        </label>
      </div>
      <p className="text-xs leading-5 text-slate-500">
        運営のメールアドレスは公開していません。このフォームから連絡できます。
      </p>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-2xl bg-blue-700 py-3.5 text-sm font-bold text-white disabled:opacity-60"
      >
        {busy ? "送信中..." : "送信する"}
      </button>
    </form>
  );
}
