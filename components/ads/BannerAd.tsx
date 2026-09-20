type BannerAdProps = {
  enabled: boolean;
};

export function BannerAd({ enabled }: BannerAdProps) {
  if (!enabled) return null;

  return (
    <aside className="rounded-2xl border border-dashed border-slate-300 bg-slate-100 px-4 py-3 text-center">
      <p className="text-[11px] tracking-wide text-slate-400">AD</p>
      <p className="mt-1 text-sm text-slate-600">
        広告枠（AdMob 接続後に表示）
      </p>
    </aside>
  );
}
