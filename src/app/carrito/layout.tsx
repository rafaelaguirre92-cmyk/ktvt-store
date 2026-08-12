import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tu carrito de libros",
  description:
    "Revisa los libros que elegiste, ajusta cantidades y continúa al pago cuando todo esté listo.",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
