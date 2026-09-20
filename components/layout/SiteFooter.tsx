import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-slate-200 px-4 py-6 text-center text-xs leading-6 text-slate-500">
      <nav className="flex justify-center gap-4">
        <Link href="/privacy" className="underline-offset-2 hover:underline">
          プライバシーポリシー
        </Link>
        <Link href="/contact" className="underline-offset-2 hover:underline">
          お問い合わせ
        </Link>
      </nav>
      <p className="mt-2">運営: 基本情報技術者試験 過去問アプリ</p>
    </footer>
  );
}
