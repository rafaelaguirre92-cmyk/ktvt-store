import Stripe from "stripe";
import MercadoPagoConfig, { Preference } from "mercadopago";
import { createAdminSupabaseClient } from "@/lib/supabase";

export type PaymentProvider = "stripe" | "mercadopago" | "paypal";

type PaymentOrder = {
  id: string;
  orderNumber: string;
  customerEmail: string;
  totalCents: number;
  items: { title: string; quantity: number; unitPriceCents: number }[];
};

async function getOrder(orderId: string): Promise<PaymentOrder> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) throw new Error("Configura Supabase antes de iniciar pagos sandbox.");
  const { data: order, error } = await supabase
    .from("orders")
    .select("id,order_number,customer_email,total_cents,payment_status")
    .eq("id", orderId)
    .single();
  if (error || !order) throw new Error("Pedido no encontrado.");
  if (order.payment_status === "paid") throw new Error("El pedido ya está pagado.");

  const { data: items, error: itemError } = await supabase
    .from("order_items")
    .select("title,quantity,unit_price_cents")
    .eq("order_id", orderId);
  if (itemError || !items?.length) throw new Error("El pedido no contiene productos.");

  return {
    id: order.id,
    orderNumber: order.order_number,
    customerEmail: order.customer_email,
    totalCents: order.total_cents,
    items: items.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      unitPriceCents: item.unit_price_cents,
    })),
  };
}

async function rememberAttempt(
  order: PaymentOrder,
  provider: PaymentProvider,
  reference: string,
  checkoutUrl: string,
  raw: unknown,
) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("payment_attempts").upsert(
    {
      order_id: order.id,
      provider,
      provider_reference: reference,
      status: "pending",
      checkout_url: checkoutUrl,
      amount_cents: order.totalCents,
      raw_response: raw,
    },
    { onConflict: "provider,provider_reference" },
  );
  if (error) throw new Error(`No se pudo registrar el intento de pago: ${error.message}`);
}

export async function createCheckout(provider: PaymentProvider, orderId: string) {
  const order = await getOrder(orderId);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (provider === "stripe") {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("Falta STRIPE_SECRET_KEY.");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        client_reference_id: order.id,
        customer_email: order.customerEmail,
        line_items: order.items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "mxn",
            unit_amount: item.unitPriceCents,
            product_data: { name: item.title },
          },
        })),
        success_url: `${siteUrl}/checkout/exito?pedido=${encodeURIComponent(order.orderNumber)}&metodo=stripe&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/checkout?cancelado=stripe`,
        metadata: { order_id: order.id, order_number: order.orderNumber },
      },
      { idempotencyKey: `ktvt-${order.id}-stripe` },
    );
    if (!session.url) throw new Error("Stripe no devolvió una URL de checkout.");
    await rememberAttempt(order, provider, session.id, session.url, session);
    return { checkoutUrl: session.url, reference: session.id };
  }

  if (provider === "mercadopago") {
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!token) throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN.");
    const client = new MercadoPagoConfig({ accessToken: token });
    const preference = await new Preference(client).create({
      body: {
        items: order.items.map((item, index) => ({
          id: `${order.id}-${index}`,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unitPriceCents / 100,
          currency_id: "MXN",
        })),
        payer: { email: order.customerEmail },
        external_reference: order.id,
        back_urls: {
          success: `${siteUrl}/checkout/exito?pedido=${encodeURIComponent(order.orderNumber)}&metodo=mercadopago`,
          failure: `${siteUrl}/checkout?error=mercadopago`,
          pending: `${siteUrl}/checkout/exito?pedido=${encodeURIComponent(order.orderNumber)}&metodo=mercadopago-pendiente`,
        },
        auto_return: "approved",
        notification_url: `${siteUrl}/api/webhooks/mercadopago`,
      },
      requestOptions: { idempotencyKey: `ktvt-${order.id}-mercadopago` },
    });
    const url = preference.sandbox_init_point || preference.init_point;
    if (!url || !preference.id) throw new Error("Mercado Pago no devolvió una URL de checkout.");
    await rememberAttempt(order, provider, preference.id, url, preference);
    return { checkoutUrl: url, reference: preference.id };
  }

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) throw new Error("Faltan credenciales sandbox de PayPal.");
  const base =
    process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
  const tokenResponse = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  const tokenBody = (await tokenResponse.json()) as { access_token?: string; error_description?: string };
  if (!tokenResponse.ok || !tokenBody.access_token) {
    throw new Error(tokenBody.error_description || "PayPal rechazó las credenciales.");
  }

  const orderResponse = await fetch(`${base}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenBody.access_token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `ktvt-${order.id}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: order.id,
          custom_id: order.id,
          invoice_id: order.orderNumber,
          amount: { currency_code: "MXN", value: (order.totalCents / 100).toFixed(2) },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: "KTVT",
            user_action: "PAY_NOW",
            return_url: `${siteUrl}/api/paypal/capture?order=${encodeURIComponent(order.id)}&folio=${encodeURIComponent(order.orderNumber)}`,
            cancel_url: `${siteUrl}/checkout?cancelado=paypal`,
          },
        },
      },
    }),
    cache: "no-store",
  });
  const paypal = (await orderResponse.json()) as {
    id?: string;
    links?: { rel: string; href: string }[];
    message?: string;
  };
  const url = paypal.links?.find((link) => link.rel === "payer-action" || link.rel === "approve")?.href;
  if (!orderResponse.ok || !paypal.id || !url) {
    throw new Error(paypal.message || "PayPal no devolvió una URL de aprobación.");
  }
  await rememberAttempt(order, provider, paypal.id, url, paypal);
  return { checkoutUrl: url, reference: paypal.id };
}
