import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ pedido?: string; metodo?: string }>;
}) {
  const { pedido, metodo } = await searchParams;
  return (
    <section className="section">
      <div className="container empty-state">
        <CheckCircle2 size={48} />
        <p className="eyebrow">Pedido recibido</p>
        <h1>Gracias por elegir una historia para compartir</h1>
        <p className="lede muted">
          Tu folio es <strong>{pedido || "pendiente de confirmación"}</strong>.
        </p>
        <p className="muted">
          {metodo === "transfer"
            ? "El pedido seguirá pendiente hasta que confirmemos la transferencia por WhatsApp."
            : "Te enviaremos la confirmación y los siguientes pasos por correo."}
        </p>
        <div className="cluster">
          <Link className="button primary" href="/tienda">
            Seguir explorando
          </Link>
          <Link className="button secondary" href="/">
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
