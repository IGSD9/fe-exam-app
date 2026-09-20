import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "基本情報技術者試験 過去問アプリの個人情報の取り扱いについて。",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="safe-bottom px-4 pt-6">
      <Link href="/" className="text-sm text-slate-500">
        ← トップへ
      </Link>
      <h1 className="mt-4 text-2xl font-bold">プライバシーポリシー</h1>
      <p className="mt-2 text-xs text-slate-500">最終更新日: 2026年9月21日</p>

      <div className="mt-6 space-y-5 text-sm leading-7 text-slate-700">
        <section>
          <h2 className="font-bold text-slate-900">1. 事業者</h2>
          <p className="mt-1">本アプリは「基本情報技術者試験 過去問アプリ」として運営しています。</p>
        </section>
        <section>
          <h2 className="font-bold text-slate-900">2. 取得する情報</h2>
          <ul className="mt-1 list-disc pl-5">
            <li>匿名の学習用識別子（Cookie）</li>
            <li>解答履歴、正誤、利用日時</li>
            <li>アカウント登録時のメールアドレスとパスワード（ハッシュ化して保存）</li>
            <li>お問い合わせフォームに入力された氏名、メールアドレス、本文</li>
          </ul>
        </section>
        <section>
          <h2 className="font-bold text-slate-900">3. 利用目的</h2>
          <p className="mt-1">
            学習機能の提供、履歴の保存、お問い合わせへの回答、サービス改善、不正利用の防止のために利用します。
          </p>
        </section>
        <section>
          <h2 className="font-bold text-slate-900">4. 広告</h2>
          <p className="mt-1">
            無料プランでは広告を表示することがあります。Google AdSense 等の広告配信事業者が Cookie
            を使用し、興味に応じた広告を表示する場合があります。広告のオプトアウトは各事業者の案内に従ってください。
          </p>
        </section>
        <section>
          <h2 className="font-bold text-slate-900">5. 第三者提供</h2>
          <p className="mt-1">
            法令に基づく場合を除き、ご本人の同意なく個人情報を第三者へ提供しません。決済・認証・広告の外部サービスを利用する場合は、当該サービスのプライバシーポリシーが適用されます。
          </p>
        </section>
        <section>
          <h2 className="font-bold text-slate-900">6. 保管と安全管理</h2>
          <p className="mt-1">
            パスワードはハッシュ化して保存します。お問い合わせ内容は回答に必要な期間保管し、不要になり次第削除します。
          </p>
        </section>
        <section>
          <h2 className="font-bold text-slate-900">7. 開示・訂正・削除</h2>
          <p className="mt-1">
            個人情報の開示、訂正、削除のご請求は、
            <Link href="/contact" className="text-blue-700 underline">
              お問い合わせフォーム
            </Link>
            から受け付けます。運営のメールアドレスはサイト上に公開していません。
          </p>
        </section>
        <section>
          <h2 className="font-bold text-slate-900">8. 改定</h2>
          <p className="mt-1">本ポリシーは必要に応じて改定します。重要な変更がある場合は本ページでお知らせします。</p>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
