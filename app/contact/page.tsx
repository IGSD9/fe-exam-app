import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "基本情報技術者試験 過去問アプリへのお問い合わせフォームです。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="safe-bottom px-4 pt-6">
      <Link href="/" className="text-sm text-slate-500">
        ← トップへ
      </Link>
      <h1 className="mt-4 text-2xl font-bold">お問い合わせ</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        運営への連絡は、メールアドレスの公開ではなく、このフォームからお願いします。返信が必要な場合は、返信先メールアドレスをご入力ください。
      </p>
      <div className="mt-5">
        <ContactForm />
      </div>
      <SiteFooter />
    </main>
  );
}
