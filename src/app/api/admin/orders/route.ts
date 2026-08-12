import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const schema = z.object({
  id: z.uuid(),
  status: z.enum(["pending", "confirmed", "preparing", "shipped", "completed", "cancelled"]),
});

export async function PATCH(request: Request) {
  try {
    const input = schema.safeParse(await request.json().catch(() => null));
    if (!input.success) return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
    const { adminClient } = await requireAdmin();
    if (input.data.status === "cancelled") {
      const { data, error } = await adminClient.rpc("cancel_order_and_release_inventory", {
        order_id: input.data.id,
      });
      if (error) throw error;
      return NextResponse.json({ order: Array.isArray(data) ? data[0] : data });
    }
    const { data, error } = await adminClient
      .from("orders")
      .update({ status: input.data.status })
      .eq("id", input.data.id)
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json({ order: data });
  } catch (error) {
    console.error("Admin orders:", error);
    return NextResponse.json({ error: "No se pudo actualizar el pedido." }, { status: 503 });
  }
}
