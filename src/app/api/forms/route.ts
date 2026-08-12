import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminSupabaseClient } from "@/lib/supabase";

const schema = z.object({
  kind: z.enum([
    "newsletter",
    "contact",
    "organization",
    "event_interest",
    "event_registration",
    "product_interest",
  ]),
  name: z.string().trim().max(120).optional(),
  email: z.email().max(200),
  phone: z.string().trim().max(40).optional(),
  event_slug: z.string().trim().max(160).optional(),
  product_slug: z.string().trim().max(160).optional(),
  organization: z.string().trim().max(200).optional(),
  organization_size: z.string().trim().max(100).optional(),
  interest: z.string().trim().max(200).optional(),
  message: z.string().trim().max(3000).optional(),
  _gotcha: z.string().optional(),
});

const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const current = attempts.get(ip);
  if (current && current.resetAt > now && current.count >= 10) {
    return NextResponse.json({ error: "Demasiados intentos" }, { status: 429 });
  }
  attempts.set(ip, {
    count: current && current.resetAt > now ? current.count + 1 : 1,
    resetAt: current && current.resetAt > now ? current.resetAt : now + 60_000,
  });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Revisa los datos enviados" }, { status: 400 });
  }
  if (parsed.data._gotcha) return NextResponse.json({ ok: true });

  const { _gotcha: _, product_slug, ...lead } = parsed.data;
  void _;
  const supabase = createAdminSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from("leads").insert({
      ...lead,
      interest: product_slug ? `product:${product_slug}` : lead.interest,
    });
    if (error) {
      console.error("No se pudo guardar el formulario:", error.message);
      return NextResponse.json({ error: "No se pudo guardar" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, demo: !supabase }, { status: 201 });
}
