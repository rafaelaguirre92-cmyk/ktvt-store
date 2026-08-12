import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const paypalOrderId = url.searchParams.get("token");
  const internalOrderId = url.searchParams.get("order");
  const folio = url.searchParams.get("folio") || "";
  if (!paypalOrderId || !internalOrderId) {
    return NextResponse.redirect(new URL("/checkout?error=paypal", url.origin));
  }

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) return NextResponse.redirect(new URL("/checkout?error=paypal", url.origin));
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
  const token = (await tokenResponse.json()) as { access_token?: string };
  if (!token.access_token) return NextResponse.redirect(new URL("/checkout?error=paypal", url.origin));

  const captureResponse = await fetch(`${base}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `ktvt-capture-${paypalOrderId}`,
    },
    cache: "no-store",
  });
  const capture = (await captureResponse.json()) as { status?: string };
  if (!captureResponse.ok || capture.status !== "COMPLETED") {
    return NextResponse.redirect(new URL("/checkout?error=paypal", url.origin));
  }

  const supabase = createAdminSupabaseClient();
  if (supabase) {
    await Promise.all([
      supabase
        .from("payment_attempts")
        .update({ status: "paid", raw_response: capture })
        .eq("provider", "paypal")
        .eq("provider_reference", paypalOrderId),
      supabase
        .from("orders")
        .update({ payment_status: "paid", status: "confirmed" })
        .eq("id", internalOrderId),
    ]);
  }

  const success = new URL("/checkout/exito", url.origin);
  success.searchParams.set("pedido", folio);
  success.searchParams.set("metodo", "paypal");
  return NextResponse.redirect(success);
}
