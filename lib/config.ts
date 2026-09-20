export const DEFAULT_QUALIFICATION_ID =
  process.env.NEXT_PUBLIC_DEFAULT_QUALIFICATION_ID ?? "fe";

export const SESSION_COOKIE = "fe_uid";

export const SITE_NAME = "基本情報技術者試験 過去問アプリ";
export const SITE_DESCRIPTION =
  "基本情報技術者試験の過去問を無料で演習できる学習アプリ。4択の即時判定、分野別の達成度、弱点復習に対応しています。";
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://127.0.0.1:3001";
}

export const SITE_URL = resolveSiteUrl();

export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-6139503169440528990";

export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
