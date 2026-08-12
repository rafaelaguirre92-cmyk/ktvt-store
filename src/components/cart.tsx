"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { formatCurrency } from "@/lib/catalog";

export type CartLine = Pick<Product, "id" | "slug" | "title" | "price" | "stock"> & {
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  add: (product: Product) => void;
  update: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "ktvt-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) setLines(JSON.parse(stored) as CartLine[]);
      } catch {
        window.localStorage.removeItem(storageKey);
      } finally {
        setHydrated(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(storageKey, JSON.stringify(lines));
  }, [hydrated, lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      ready: hydrated,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
      add(product) {
        if (product.stock < 1) return;
        setLines((current) => {
          const existing = current.find((line) => line.id === product.id);
          if (existing) {
            return current.map((line) =>
              line.id === product.id
                ? { ...line, quantity: Math.min(line.quantity + 1, product.stock) }
                : line,
            );
          }
          return [
            ...current,
            {
              id: product.id,
              slug: product.slug,
              title: product.title,
              price: product.price,
              stock: product.stock,
              quantity: 1,
            },
          ];
        });
        setDrawerOpen(true);
      },
      update(id, quantity) {
        setLines((current) =>
          current
            .map((line) => ({
              ...line,
              quantity:
                line.id === id ? Math.max(0, Math.min(quantity, line.stock)) : line.quantity,
            }))
            .filter((line) => line.quantity > 0),
        );
      },
      remove(id) {
        setLines((current) => current.filter((line) => line.id !== id));
      },
      clear() {
        setLines([]);
      },
      open() {
        setDrawerOpen(true);
      },
    }),
    [hydrated, lines],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {drawerOpen && (
        <div className="drawer-backdrop" role="presentation" onMouseDown={() => setDrawerOpen(false)}>
          <aside
            aria-label="Carrito"
            aria-modal="true"
            className="cart-drawer"
            role="dialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="cluster spread">
              <div>
                <p className="eyebrow">Tu selección</p>
                <h2>Carrito ({value.count})</h2>
              </div>
              <button className="icon-button" onClick={() => setDrawerOpen(false)} aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>
            <CartLines compact />
            {lines.length > 0 && (
              <div className="drawer-summary">
                <div className="cluster spread">
                  <strong>Subtotal</strong>
                  <strong>{formatCurrency(value.subtotal)}</strong>
                </div>
                <p className="muted small">
                  El costo y la fecha de entrega se confirman antes de preparar tu pedido.
                </p>
                <Link className="button primary full" href="/checkout" onClick={() => setDrawerOpen(false)}>
                  Continuar al pago
                </Link>
                <Link className="button secondary full" href="/carrito" onClick={() => setDrawerOpen(false)}>
                  Ver carrito
                </Link>
              </div>
            )}
          </aside>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}

export function CartButton() {
  const { count, open } = useCart();
  return (
    <button className="cart-button" onClick={open} aria-label={`Abrir carrito, ${count} productos`}>
      <ShoppingBag size={19} />
      <span>Carrito</span>
      {count > 0 && <span className="cart-count">{count}</span>}
    </button>
  );
}

export function AddToCart({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { add, ready } = useCart();
  if (product.stock < 1) return null;

  return (
    <button
      className={`button primary${compact ? " compact" : ""}`}
      disabled={!ready}
      onClick={() => add(product)}
      type="button"
    >
      Agregar al carrito
    </button>
  );
}

export function ProductInterestButton({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [email, setEmail] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "product_interest",
          email,
          product_slug: product.slug,
        }),
      });
      if (!response.ok) throw new Error("No se pudo enviar");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="small stock" role="status">
        Te avisamos cuando haya stock
      </p>
    );
  }

  if (!open) {
    return (
      <button
        className={`button secondary${compact ? " compact" : ""}`}
        onClick={() => setOpen(true)}
        type="button"
      >
        Me interesa
      </button>
    );
  }

  return (
    <form className="waitlist-form" onSubmit={submit}>
      <label className="sr-only" htmlFor={`waitlist-${product.id}`}>
        Correo para avisarte
      </label>
      <input
        id={`waitlist-${product.id}`}
        name="email"
        type="email"
        placeholder="Tu correo"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <button className={`button primary${compact ? " compact" : ""}`} disabled={status === "sending"} type="submit">
        {status === "sending" ? "Enviando…" : "Avísame"}
      </button>
      {status === "error" && (
        <p className="small stock out" role="alert">
          No se pudo guardar. Intenta de nuevo.
        </p>
      )}
    </form>
  );
}

export function ProductCardAction({ product, compact = false }: { product: Product; compact?: boolean }) {
  if (product.stock > 0) {
    return <AddToCart compact={compact} product={product} />;
  }
  return <ProductInterestButton compact={compact} product={product} />;
}

export function CartLines({ compact = false }: { compact?: boolean }) {
  const { lines, update, remove } = useCart();

  if (lines.length === 0) {
    return (
      <div className="empty-state">
        <ShoppingBag size={28} />
        <h3>Tu carrito está vacío</h3>
        <p className="muted">
          Explora historias para distintas edades y para eso que hoy les da tanta curiosidad.
        </p>
        <Link className="button secondary" href="/tienda">
          Explorar libros
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-lines">
      {lines.map((line) => (
        <article className="cart-line" key={line.id}>
          <div className="image-placeholder thumbnail" aria-hidden="true">
            Portada
          </div>
          <div className="stack tight grow">
            <Link href={`/producto/${line.slug}`}>
              <strong>{line.title}</strong>
            </Link>
            <span className="muted small">{formatCurrency(line.price)} c/u</span>
            <div className="quantity">
              <button aria-label="Quitar uno" onClick={() => update(line.id, line.quantity - 1)}>
                <Minus size={14} />
              </button>
              <span aria-live="polite">{line.quantity}</span>
              <button aria-label="Agregar uno" onClick={() => update(line.id, line.quantity + 1)}>
                <Plus size={14} />
              </button>
              <button className="remove" aria-label="Eliminar producto" onClick={() => remove(line.id)}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
          {!compact && <strong>{formatCurrency(line.price * line.quantity)}</strong>}
        </article>
      ))}
    </div>
  );
}
