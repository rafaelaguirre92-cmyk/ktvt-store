"use client";

import Link from "next/link";
import { CartLines, useCart } from "@/components/cart";
import { formatCurrency } from "@/lib/catalog";

export default function CartPage() {
  const { lines, subtotal } = useCart();

  if (!lines.length) {
    return (
      <section className="section">
        <div className="container empty-state">
          <p className="eyebrow">Tu selección</p>
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
        <div className="section-heading">
          <div>
            <p className="eyebrow">Tu selección</p>
            <h1>Carrito</h1>
          </div>
          <Link className="text-link" href="/tienda">
            Seguir viendo libros
          </Link>
        </div>
        <div className="checkout-grid">
          <div className="card">
            <CartLines />
          </div>
          <aside className="summary-box stack">
            <h2>Resumen</h2>
            <div className="cluster spread">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="cluster spread">
              <span>Entrega</span>
              <span>Entrega por confirmar</span>
            </div>
            <p className="small muted">
              La cobertura, la fecha y el costo se confirman antes de preparar tu pedido.
            </p>
            <Link className="button primary full" href="/checkout">
              Continuar al pago
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
