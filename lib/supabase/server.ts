import { hasSupabaseConfig } from "../config";

export function createServerSupabaseClient() {
  if (!hasSupabaseConfig()) return null;
  return null;
}
