import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const schema = z.object({
  id: z.uuid(),
  priceCents: z.number().int().min(0),
  active: z.boolean(),
});

export async function PATCH(request: Request) {
  try {
    const input = schema.safeParse(await request.json().catch(() => null));
    if (!input.success) return NextResponse.json({ error: "Configuración inválida." }, { status: 400 });
    const { adminClient } = await requireAdmin();
    const { data, error } = await adminClient
      .from("shipping_methods")
      .update({ price_cents: input.data.priceCents, is_active: input.data.active })
      .eq("id", input.data.id)
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json({ method: data });
  } catch (error) {
    console.error("Admin shipping:", error);
    return NextResponse.json({ error: "No se pudo actualizar el envío." }, { status: 503 });
  }
}
