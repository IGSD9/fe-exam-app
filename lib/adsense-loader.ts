import { ADSENSE_CLIENT } from "@/lib/config";

const SCRIPT_ATTR = "data-fe-adsense";

/** コンテンツのあるページでのみ AdSense スクリプトを1回読み込む */
export function ensureAdSenseScript(): Promise<void> {
  if (typeof window === "undefined" || !ADSENSE_CLIENT) {
    return Promise.resolve();
  }

  const existing = document.querySelector(`script[${SCRIPT_ATTR}]`);
  if (existing) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.setAttribute(SCRIPT_ATTR, "1");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("AdSense script failed to load"));
    document.head.appendChild(script);
  });
}
