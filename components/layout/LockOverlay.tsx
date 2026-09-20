import Link from "next/link";

export function LockOverlay() {
  return (
    <section className="rounded-3xl bg-white p-6 text-center shadow-sm">
      <p className="text-lg font-bold">この年度は Pro で開放されます</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        全問題解放＆広告非表示を購入すると、過去年度も演習できます。
      </p>
      <Link
        href="/settings?from=lock"
        className="mt-5 inline-flex rounded-full bg-blue-700 px-5 py-3 text-sm font-bold text-white"
      >
        全問解放を見る
      </Link>
    </section>
  );
}
