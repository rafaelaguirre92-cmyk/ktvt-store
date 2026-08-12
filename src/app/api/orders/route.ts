import { NextResponse } from "next/server";
import { z } from "zod";
import { products } from "@/lib/catalog";
import { sendOrderReceivedEmail } from "@/lib/email";
import { createAdminSupabaseClient } from "@/lib/supabase";

const orderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.email().max(200),
    phone: z.string().trim().min(8).max(40),
  }),
  shipping: z.object({
    address1: z.string().trim().min(5).max(250),
    address2: z.string().trim().max(250).optional().or(z.literal("")),
    city: z.string().trim().min(2).max(120),
    state: z.string().trim().min(2).max(120),
    postalCode: z.string().trim().min(4).max(10),
    country: z.literal("MX"),
  }),
  shippingCode: z.string().trim().max(80),
  paymentMethod: z.enum(["stripe", "mercadopago", "paypal", "transfer"]),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  lines: z
    .array(
      z.object({
        productId: z.uuid(),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1)
    .max(50),
});

export async function POST(request: Request) {
  const parsed = orderSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Revisa los datos de contacto, entrega y productos." },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const supabase = createAdminSupabaseClient();

  if (supabase) {
    const { data: shippingMethod, error: shippingError } = await supabase
      .from("shipping_methods")
      .select("id")
      .eq("code", input.shippingCode)
      .eq("is_active", true)
      .single();
    if (shippingError || !shippingMethod) {
      return NextResponse.json({ error: "El método de entrega no está disponible." }, { status: 409 });
    }

    const { data, error } = await supabase.rpc("create_guest_order", {
      customer: input.customer,
      shipping_address: input.shipping,
      payment_method: input.paymentMethod,
      shipping_method: shippingMethod.id,
      lines: input.lines.map((line) => ({
        product_id: line.productId,
        quantity: line.quantity,
      })),
      notes: input.notes || null,
    });

    if (error || !data) {
      console.error("No se pudo crear el pedido:", error?.message);
      const conflict = error?.message.includes("Inventario") || error?.message.includes("disponible");
      return NextResponse.json(
        { error: conflict ? error?.message : "No se pudo crear el pedido." },
        { status: conflict ? 409 : 500 },
      );
    }

    const order = Array.isArray(data) ? data[0] : data;
    await sendOrderReceivedEmail({
      email: input.customer.email,
      name: input.customer.name,
      orderNumber: order.order_number,
      totalCents: order.total_cents,
      paymentMethod: order.payment_method,
    }).catch((emailError) => console.error("No se pudo enviar el correo:", emailError));
    return NextResponse.json(
      {
        id: order.id,
        orderNumber: order.order_number,
        totalCents: order.total_cents,
        paymentMethod: order.payment_method,
      },
      { status: 201 },
    );
  }

  let totalCents = 0;
  for (const line of input.lines) {
    const product = products.find((item) => item.id === line.productId);
    if (!product || !product.published || product.stock < line.quantity) {
      return NextResponse.json(
        { error: "Uno de los libros ya no tiene inventario suficiente." },
        { status: 409 },
      );
    }
    totalCents += product.price * line.quantity;
  }

  const reference = Date.now().toString().slice(-7);
  const orderNumber = `KTVT-DEMO-${reference}`;
  await sendOrderReceivedEmail({
    email: input.customer.email,
    name: input.customer.name,
    orderNumber,
    totalCents,
    paymentMethod: input.paymentMethod,
  }).catch((emailError) => console.error("No se pudo enviar el correo demo:", emailError));
  return NextResponse.json(
    {
      id: crypto.randomUUID(),
      orderNumber,
      totalCents,
      paymentMethod: input.paymentMethod,
      demo: true,
    },
    { status: 201 },
  );
}
