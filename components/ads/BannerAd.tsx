"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_BANNER_SLOT, ADSENSE_CLIENT } from "@/lib/config";

type BannerAdProps = {
  enabled: boolean;
};

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export function BannerAd({ enabled }: BannerAdProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!enabled || !ADSENSE_CLIENT || !ADSENSE_BANNER_SLOT || pushed.current) {
      return;
    }
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* AdSense 未読込・ブロッカー時は無視 */
    }
  }, [enabled]);

  if (!enabled || !ADSENSE_CLIENT) return null;

  if (!ADSENSE_BANNER_SLOT) {
    return (
      <aside
        className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-center"
        aria-hidden="true"
      >
        <p className="text-[11px] tracking-wide text-slate-400">AD</p>
        <p className="mt-1 text-xs text-slate-500">
          広告ユニット作成後に表示されます
        </p>
      </aside>
    );
  }

  return (
    <aside className="overflow-hidden rounded-2xl bg-slate-50 px-1 py-2 text-center">
      <p className="mb-1 text-[10px] tracking-wide text-slate-400">広告</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_BANNER_SLOT}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
