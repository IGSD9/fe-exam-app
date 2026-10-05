import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/config";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "このサイトについて",
  description: `${SITE_NAME}の目的、機能、運営方針について説明します。`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="safe-bottom px-4 pt-6">
      <Link href="/" className="text-sm text-slate-500">
        ← トップへ
      </Link>
      <h1 className="mt-4 text-2xl font-bold">このサイトについて</h1>

      <section className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
        <p>
          {SITE_NAME}は、基本情報技術者試験（FE）の過去問を Web ブラウザで演習できる学習サービスです。
          受験者が短い時間でも繰り返し学習できるよう、4 択問題の即時判定、解説表示、分野別の進捗確認、
          間違えた問題の復習機能を提供しています。
        </p>
        <h2 className="text-lg font-bold text-slate-900">提供している主な機能</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>年度・分野を選んで 1 問ずつ演習（正誤判定と解説）</li>
          <li>学習ダッシュボードでの達成度の可視化</li>
          <li>弱点復習モード（誤答した問題の再出題）</li>
          <li>プライバシーポリシー・お問い合わせフォームによる運営窓口</li>
        </ul>
        <h2 className="text-lg font-bold text-slate-900">無料プランと Pro</h2>
        <p>
          無料プランでは直近年度の問題を中心に利用できます。Pro（有料）では全年度の問題が開放され、
          演習画面の広告表示がオフになります。詳細はアプリ内の設定画面をご確認ください。
        </p>
        <h2 className="text-lg font-bold text-slate-900">コンテンツについて</h2>
        <p>
          本サイトに掲載する問題・解説は、学習目的で整理したオリジナルのデータセットに基づいています。
          試験問題の著作権は各権利者に帰属します。本サービスは独立した学習支援ツールであり、
          IPA や試験実施団体との公式な提携を示すものではありません。
        </p>
        <h2 className="text-lg font-bold text-slate-900">広告について</h2>
        <p>
          無料プランでは、問題文と解説が表示された演習画面の一部にのみ Google AdSense 等の広告を
          表示することがあります。ダッシュボード、設定、読み込み中の画面、コンテンツのないページには
          広告を表示しません。
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
