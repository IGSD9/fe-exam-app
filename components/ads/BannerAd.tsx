"use client";

import { useEffect, useRef, useState } from "react";
import { ADSENSE_BANNER_SLOT, ADSENSE_CLIENT } from "@/lib/config";
import { ensureAdSenseScript } from "@/lib/adsense-loader";

type BannerAdProps = {
  /** 無料ユーザーなど、広告を出してよい場合 */
  enabled: boolean;
  /** 問題文・解説などパブリッシャーコンテンツが表示済みのときだけ true */
  contentReady: boolean;
};

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

/**
 * 手動配置バナー。全ページ共通スクリプトは使わず、コンテンツ表示後のみ読み込む。
 */
export function BannerAd({ enabled, contentReady }: BannerAdProps) {
  const pushed = useRef(false);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!enabled || !contentReady || !ADSENSE_CLIENT || !ADSENSE_BANNER_SLOT) {
      return;
    }
    let cancelled = false;
    ensureAdSenseScript()
      .then(() => {
        if (!cancelled) setScriptReady(true);
      })
      .catch(() => {
        /* ブロッカー等 */
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, contentReady]);

  useEffect(() => {
    if (!enabled || !contentReady || !scriptReady || !ADSENSE_BANNER_SLOT || pushed.current) {
      return;
    }
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* ignore */
    }
  }, [enabled, contentReady, scriptReady]);

  if (!enabled || !contentReady || !ADSENSE_CLIENT || !ADSENSE_BANNER_SLOT) {
    return null;
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
