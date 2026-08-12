import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Completa tu pedido de libros",
  description:
    "Agrega tus datos de contacto, entrega y pago para completar el pedido sin crear una cuenta.",
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
