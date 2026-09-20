import { hasSupabaseConfig } from "../config";

export function createBrowserSupabaseClient() {
  if (!hasSupabaseConfig()) return null;
  return null;
}
