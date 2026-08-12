"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartLines, useCart } from "@/components/cart";
import { formatCurrency } from "@/lib/catalog";

const providers = [
  { value: "stripe", title: "Tarjeta con Stripe", note: "Pago con tarjeta de crédito o débito" },
  { value: "mercadopago", title: "Mercado Pago", note: "Tarjeta, transferencia o efectivo según disponibilidad" },
  { value: "paypal", title: "PayPal", note: "Pago con cuenta PayPal o tarjeta" },
  {
    value: "transfer",
    title: "Transferencia coordinada por WhatsApp",
    note: "El pedido queda pendiente hasta confirmar el pago",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, clear } = useCart();
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = new FormData(event.currentTarget);
    const paymentMethod = String(form.get("payment_method"));

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.get("name"),
            email: form.get("email"),
            phone: form.get("phone"),
          },
          shipping: {
            address1: form.get("address1"),
            address2: form.get("address2"),
            city: form.get("city"),
            state: form.get("state"),
            postalCode: form.get("postal_code"),
            country: "MX",
          },
          shippingCode: "pending-logistics",
          paymentMethod,
          notes: form.get("notes"),
          lines: lines.map((line) => ({ productId: line.id, quantity: line.quantity })),
        }),
      });
      const order = await response.json();
      if (!response.ok) throw new Error(order.error || "No se pudo crear el pedido");

      if (paymentMethod === "transfer") {
        const message = `Hola, quiero completar por transferencia el pedido ${order.orderNumber} por ${formatCurrency(order.totalCents)}.`;
        window.open(
          `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5210000000000"}?text=${encodeURIComponent(message)}`,
          "_blank",
          "noopener,noreferrer",
        );
        clear();
        router.push(`/checkout/exito?pedido=${encodeURIComponent(order.orderNumber)}&metodo=transfer`);
        return;
      }

      const paymentResponse = await fetch(`/api/checkout/${paymentMethod}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });
      const payment = await paymentResponse.json();
      if (!paymentResponse.ok) throw new Error(payment.error || "No se pudo iniciar el pago");
      clear();
      window.location.assign(payment.checkoutUrl);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Algo se atoró. Intenta otra vez o continúa por WhatsApp.");
      setStatus("idle");
    }
  }

  if (!lines.length) {
    return (
      <section className="section">
        <div className="container empty-state">
          <h1>Todavía no hay libros por aquí</h1>
          <p className="muted">
            Explora por edad o empieza por eso que hoy no dejan de preguntar.
          </p>
          <Link className="button primary" href="/tienda">
            Explorar libros
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="stack mb-4">
          <p className="eyebrow">Sin cuentas ni contraseñas</p>
          <h1>Completa tu pedido</h1>
          <p className="muted">Solo faltan tus datos de contacto, entrega y pago.</p>
        </div>
        <form className="checkout-grid" onSubmit={submit}>
          <div className="stack">
            <section className="card stack">
              <h2>Datos de contacto</h2>
              <div className="form-grid">
                <label>
                  Nombre completo
                  <input name="name" required autoComplete="name" />
                </label>
                <label>
                  Correo
                  <input name="email" type="email" required autoComplete="email" />
                </label>
                <label>
                  WhatsApp
                  <input name="phone" type="tel" required autoComplete="tel" />
                </label>
              </div>
            </section>
            <section className="card stack">
              <h2>Dirección de entrega</h2>
              <div className="form-grid">
                <label className="full">
                  Calle y número
                  <input name="address1" required autoComplete="address-line1" />
                </label>
                <label className="full">
                  Interior o referencias
                  <input name="address2" autoComplete="address-line2" />
                </label>
                <label>
                  Ciudad o municipio
                  <input name="city" required autoComplete="address-level2" />
                </label>
                <label>
                  Estado
                  <input name="state" required autoComplete="address-level1" />
                </label>
                <label>
                  Código postal
                  <input name="postal_code" required autoComplete="postal-code" inputMode="numeric" />
                </label>
              </div>
              <div className="config-banner small">
                Antes de preparar el pedido recibirás la cobertura, la fecha y el costo de entrega
                para confirmarlos. El total mostrado todavía no incluye ese costo.
              </div>
            </section>
            <section className="card stack">
              <h2>Método de pago</h2>
              <div className="payment-options">
                {providers.map((provider, index) => (
                  <label className="payment-option" key={provider.value}>
                    <input
                      type="radio"
                      name="payment_method"
                      value={provider.value}
                      defaultChecked={index === 0}
                    />
                    <span className="stack tight">
                      <strong>{provider.title}</strong>
                      <span className="muted small">{provider.note}</span>
                    </span>
                  </label>
                ))}
              </div>
              <label>
                Nota para tu pedido (opcional)
                <textarea name="notes" rows={3} />
              </label>
              <label className="cluster">
                <input className="w-auto" type="checkbox" required /> Acepto las políticas de
                compra y el aviso de privacidad.
              </label>
            </section>
          </div>
          <aside className="summary-box stack">
            <h2>Tu pedido</h2>
            <CartLines compact />
            <div className="cluster spread">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="cluster spread">
              <span>Entrega por confirmar</span>
              <span>$0</span>
            </div>
            <div className="cluster spread">
              <strong>Total antes de entrega</strong>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <button className="button primary full" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Confirmando…" : "Confirmar pedido y pagar"}
            </button>
            {error && (
              <p className="form-error small" role="alert">
                {error}
              </p>
            )}
            <p className="muted small">
              El total y la disponibilidad se revisan antes de confirmar el pedido.
            </p>
          </aside>
        </form>
      </div>
    </section>
  );
}
