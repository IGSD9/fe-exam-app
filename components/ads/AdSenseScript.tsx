import Script from "next/script";
import { ADSENSE_CLIENT } from "@/lib/config";

/**
 * AdSense 所有権確認用 — <head> に同等のスクリプトを置く。
 * strategy=beforeInteractive で早期に読み込み、確認クローラが拾いやすくする。
 */
export function AdSenseScript() {
  if (!ADSENSE_CLIENT) return null;

  return (
    <Script
      id="adsense-client"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="beforeInteractive"
    />
  );
}
