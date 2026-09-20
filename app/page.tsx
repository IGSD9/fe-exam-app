import type { Metadata } from "next";
import { formatYear } from "@/lib/access";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/config";
import { jsonLd, listPublicCategories, listPublicSamples } from "@/lib/seo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { StartButton } from "@/components/home/StartButton";

export const metadata: Metadata = {
  title: "無料で過去問演習",
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const samples = listPublicSamples(3);
  const categories = listPublicCategories();

  return (
    <main className="safe-bottom px-4 pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="text-xs tracking-[0.25em] text-blue-700">FE EXAM PRACTICE</p>
      <h1 className="mt-2 text-3xl font-bold leading-snug">{SITE_NAME}</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600">{SITE_DESCRIPTION}</p>

      <ul className="mt-5 grid gap-2 text-sm text-slate-700">
        <li className="rounded-2xl bg-white px-4 py-3 shadow-sm">4択の即時判定と解説</li>
        <li className="rounded-2xl bg-white px-4 py-3 shadow-sm">シラバス分野別の達成度</li>
        <li className="rounded-2xl bg-white px-4 py-3 shadow-sm">間違えた問題の弱点復習</li>
      </ul>

      <div className="mt-5">
        <StartButton />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-bold">対応分野</h2>
        <p className="mt-2 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span key={category} className="rounded-full bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
              {category}
            </span>
          ))}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold">問題の例</h2>
        <p className="mt-1 text-sm text-slate-500">ログイン前でも内容を確認できます。正解は演習画面で表示します。</p>
        <div className="mt-4 space-y-4">
          {samples.map((item) => (
            <article key={item.id} className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs text-slate-500">
                {formatYear(item.year)} / {item.category} / 問{item.questionNumber}
              </p>
              <h3 className="mt-2 text-[15px] leading-7 font-medium">{item.questionText}</h3>
              <ol className="mt-3 space-y-1 text-sm text-slate-600">
                {item.options.map((option, index) => (
                  <li key={option}>
                    {["ア", "イ", "ウ", "エ"][index]} {option}
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
