import { NextResponse } from "next/server";
import { z } from "zod";
import { createCheckout, type PaymentProvider } from "@/lib/payments";

const bodySchema = z.object({ orderId: z.uuid() });
const providers = new Set<PaymentProvider>(["stripe", "mercadopago", "paypal"]);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  if (!providers.has(provider as PaymentProvider)) {
    return NextResponse.json({ error: "Proveedor no soportado." }, { status: 404 });
  }
  const body = bodySchema.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  try {
    const checkout = await createCheckout(provider as PaymentProvider, body.data.orderId);
    return NextResponse.json(checkout, { status: 201 });
  } catch (reason) {
    console.error(`No se pudo iniciar ${provider}:`, reason);
    return NextResponse.json(
      { error: reason instanceof Error ? reason.message : "No se pudo iniciar el pago." },
      { status: 503 },
    );
  }
}
