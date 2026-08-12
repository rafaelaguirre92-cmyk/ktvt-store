"use client";

import Link from "next/link";
import { CartLines, useCart } from "@/components/cart";
import { formatCurrency } from "@/lib/catalog";

export default function CartPage() {
  const { lines, subtotal } = useCart();

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Tu selección</p>
            <h1>Carrito</h1>
          </div>
          <Link className="text-link" href="/tienda">
            Seguir explorando
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
              <span>Por confirmar</span>
            </div>
            <p className="small muted">
              La logística final está en definición. Confirmaremos cobertura, fecha y costo antes de
              preparar tu pedido.
            </p>
            <Link
              aria-disabled={!lines.length}
              className={`button primary full ${!lines.length ? "disabled" : ""}`}
              href={lines.length ? "/checkout" : "/tienda"}
            >
              {lines.length ? "Continuar al checkout" : "Explorar libros"}
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
