import Script from "next/script";
import { ADSENSE_CLIENT } from "@/lib/config";

/**
 * AdSense スクリプト（サイト認証・自動広告・手動ユニット共通）。
 * 自動広告は AdSense 管理画面の「広告」→ サイト →「自動広告を編集」で ON にする。
 */
export function AdSenseScript() {
  if (!ADSENSE_CLIENT) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
