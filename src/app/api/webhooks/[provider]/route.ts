import { NextResponse } from "next/server";
import Stripe from "stripe";
import { WebhookSignatureValidator } from "mercadopago";
import { createAdminSupabaseClient } from "@/lib/supabase";

async function recordEvent(provider: string, externalId: string, payload: unknown) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) throw new Error("Supabase no está configurado");
  const { error } = await supabase.from("webhook_events").insert({
    provider,
    external_id: externalId,
    payload,
  });
  if (error?.code === "23505") return { duplicate: true, supabase };
  if (error) throw error;
  return { duplicate: false, supabase };
}

async function markPaid(
  orderId: string,
  provider: string,
  providerReference: string,
  rawResponse: unknown,
) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) throw new Error("Supabase no está configurado");
  const [{ error: paymentError }, { error: orderError }] = await Promise.all([
    supabase
      .from("payment_attempts")
      .update({ status: "paid", raw_response: rawResponse })
      .eq("provider", provider)
      .eq("provider_reference", providerReference),
    supabase
      .from("orders")
      .update({ payment_status: "paid", status: "confirmed" })
      .eq("id", orderId),
  ]);
  if (paymentError || orderError) throw paymentError || orderError;
}

async function paypalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) throw new Error("Credenciales PayPal incompletas");
  const base =
    process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  const body = (await response.json()) as { access_token?: string };
  if (!body.access_token) throw new Error("PayPal no emitió token");
  return { token: body.access_token, base };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;

  try {
    if (provider === "stripe") {
      const signature = request.headers.get("stripe-signature");
      const secret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!signature || !secret || !process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json({ error: "Firma Stripe no configurada" }, { status: 401 });
      }
      const raw = await request.text();
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const event = stripe.webhooks.constructEvent(raw, signature, secret);
      const recorded = await recordEvent(provider, event.id, event);
      if (recorded.duplicate) return NextResponse.json({ received: true, duplicate: true });
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const orderId = session.metadata?.order_id || session.client_reference_id;
        if (orderId && session.payment_status === "paid") {
          await markPaid(orderId, provider, session.id, event);
        }
      }
      return NextResponse.json({ received: true });
    }

    if (provider === "mercadopago") {
      const url = new URL(request.url);
      const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
      const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (!secret || !token) {
        return NextResponse.json({ error: "Webhook Mercado Pago no configurado" }, { status: 401 });
      }
      WebhookSignatureValidator.validate({
        xSignature: request.headers.get("x-signature"),
        xRequestId: request.headers.get("x-request-id"),
        dataId: url.searchParams.get("data.id"),
        secret,
        toleranceSeconds: 300,
      });
      const notification = (await request.json()) as {
        id?: string | number;
        type?: string;
        data?: { id?: string };
      };
      const paymentId = notification.data?.id || url.searchParams.get("data.id");
      if (!paymentId) return NextResponse.json({ received: true });
      const recorded = await recordEvent(
        provider,
        String(notification.id || `${notification.type}-${paymentId}`),
        notification,
      );
      if (recorded.duplicate) return NextResponse.json({ received: true, duplicate: true });
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const payment = (await paymentResponse.json()) as {
        id?: number;
        status?: string;
        external_reference?: string;
      };
      if (paymentResponse.ok && payment.status === "approved" && payment.external_reference) {
        const supabase = createAdminSupabaseClient();
        if (!supabase) throw new Error("Supabase no está configurado");
        const { data: attempt } = await supabase
          .from("payment_attempts")
          .select("provider_reference")
          .eq("order_id", payment.external_reference)
          .eq("provider", provider)
          .maybeSingle();
        await markPaid(
          payment.external_reference,
          provider,
          attempt?.provider_reference || String(payment.id),
          payment,
        );
      }
      return NextResponse.json({ received: true });
    }

    if (provider === "paypal") {
      const webhookId = process.env.PAYPAL_WEBHOOK_ID;
      if (!webhookId) return NextResponse.json({ error: "Webhook PayPal no configurado" }, { status: 401 });
      const event = (await request.json()) as {
        id: string;
        event_type: string;
        resource: {
          id?: string;
          custom_id?: string;
          supplementary_data?: { related_ids?: { order_id?: string } };
        };
      };
      const { token, base } = await paypalAccessToken();
      const verify = await fetch(`${base}/v1/notifications/verify-webhook-signature`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_algo: request.headers.get("paypal-auth-algo"),
          cert_url: request.headers.get("paypal-cert-url"),
          transmission_id: request.headers.get("paypal-transmission-id"),
          transmission_sig: request.headers.get("paypal-transmission-sig"),
          transmission_time: request.headers.get("paypal-transmission-time"),
          webhook_id: webhookId,
          webhook_event: event,
        }),
        cache: "no-store",
      });
      const verification = (await verify.json()) as { verification_status?: string };
      if (!verify.ok || verification.verification_status !== "SUCCESS") {
        return NextResponse.json({ error: "Firma PayPal inválida" }, { status: 401 });
      }
      const recorded = await recordEvent(provider, event.id, event);
      if (recorded.duplicate) return NextResponse.json({ received: true, duplicate: true });
      if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
        const paypalOrderId = event.resource.supplementary_data?.related_ids?.order_id;
        const supabase = createAdminSupabaseClient();
        if (!supabase) throw new Error("Supabase no está configurado");
        const { data: attempt } = await supabase
          .from("payment_attempts")
          .select("order_id")
          .eq("provider", provider)
          .eq("provider_reference", paypalOrderId)
          .maybeSingle();
        const orderId = event.resource.custom_id || attempt?.order_id;
        if (orderId && paypalOrderId) await markPaid(orderId, provider, paypalOrderId, event);
      }
      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ error: "Proveedor no soportado" }, { status: 404 });
  } catch (error) {
    console.error(`Webhook ${provider} rechazado:`, error);
    return NextResponse.json({ error: "Webhook rechazado" }, { status: 400 });
  }
}
