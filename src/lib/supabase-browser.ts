import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const hasSupabase = Boolean(url && publishableKey);

export function createBrowserSupabaseClient() {
  if (!url || !publishableKey) throw new Error("Supabase no está configurado");
  return createBrowserClient(url, publishableKey);
}
