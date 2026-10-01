"use client";

import { BannerAd } from "@/components/ads/BannerAd";

/** トップなど公開ページ向け。ログイン不要で表示 */
export function HomeAd() {
  return (
    <div className="mt-8">
      <BannerAd enabled />
    </div>
  );
}
