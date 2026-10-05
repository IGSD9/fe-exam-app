import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/config";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "利用規約",
  description: `${SITE_NAME}の利用規約です。`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="safe-bottom px-4 pt-6">
      <Link href="/" className="text-sm text-slate-500">
        ← トップへ
      </Link>
      <h1 className="mt-4 text-2xl font-bold">利用規約</h1>

      <section className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
        <p>本規約は、{SITE_NAME}（以下「本サービス」）の利用条件を定めるものです。</p>
        <h2 className="text-lg font-bold text-slate-900">1. 利用</h2>
        <p>
          利用者は、本サービスを自己の学習目的の範囲で利用するものとします。
          不正アクセス、過度な自動アクセス、他者への迷惑行為は禁止します。
        </p>
        <h2 className="text-lg font-bold text-slate-900">2. 免責</h2>
        <p>
          本サービスの内容の正確性・完全性は保証しません。試験結果を保証するものではありません。
          サービスの中断・変更・終了により生じた損害について、法令で認められる範囲を超えて
          運営者は責任を負いません。
        </p>
        <h2 className="text-lg font-bold text-slate-900">3. 有料機能</h2>
        <p>
          Pro 等の有料機能の条件・返金は、購入画面および関連法令に従います。
          決済は外部サービス（アプリストア等）を利用する場合があります。
        </p>
        <h2 className="text-lg font-bold text-slate-900">4. お問い合わせ</h2>
        <p>
          本規約に関するお問い合わせは
          <Link href="/contact" className="text-blue-700 underline-offset-2 hover:underline">
            お問い合わせページ
          </Link>
          からご連絡ください。
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
