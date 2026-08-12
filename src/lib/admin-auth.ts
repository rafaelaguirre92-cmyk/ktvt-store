import { createAdminSupabaseClient, createServerSupabaseClient } from "@/lib/supabase";

export async function requireAdmin() {
  const sessionClient = await createServerSupabaseClient();
  const adminClient = createAdminSupabaseClient();
  if (!sessionClient || !adminClient) throw new Error("ADMIN_NOT_CONFIGURED");

  const {
    data: { user },
  } = await sessionClient.auth.getUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const { data: admin } = await sessionClient
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!admin) throw new Error("FORBIDDEN");
  return { user, adminClient };
}
