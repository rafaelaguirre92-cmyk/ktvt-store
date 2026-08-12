import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/content";
import { DataForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Contacto | Libros, pedidos y actividades",
  description:
    "Resuelve una duda sobre un libro, tu pedido, una actividad o una idea para tu organización por WhatsApp, correo o formulario.",
};

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5210000000000";

  return (
    <>
      <PageHero
        eyebrow="Aquí puedes resolverlo"
        title="¿Tienes una duda? Elige el camino más fácil."
        description="Libros, pedidos, actividades u organizaciones: usa WhatsApp para algo rápido o envía el formulario si necesitas contar un poco más."
      />
      <section className="section">
        <div className="container split-panel">
          <div className="stack">
            <div className="feature-card stack">
              <MessageCircle size={26} />
              <h3>WhatsApp</h3>
              <p className="muted">Para recomendaciones de libros y dudas rápidas.</p>
              <a
                className="text-link"
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hola. Busco un libro para mis hijos. Sus edades son [EDADES] y les interesa [INTERESES].")}`}
                target="_blank"
                rel="noreferrer"
              >
                Ir a WhatsApp
              </a>
            </div>
            <div className="feature-card stack">
              <Mail size={26} />
              <h3>Correo</h3>
              <p className="muted">hola@ktvt.mx (dirección provisional)</p>
              <p className="muted small">
                Para mensajes que pueden esperar. La respuesta suele llegar en 1 a 2 días hábiles.
              </p>
            </div>
          </div>
          <div className="summary-box stack">
            <h2>Cuenta qué necesitas</h2>
            <DataForm
              kind="contact"
              fields={[
                { name: "name", label: "Tu nombre", required: true },
                { name: "email", label: "Tu correo", type: "email", required: true },
                { name: "phone", label: "Tu WhatsApp", type: "tel" },
                {
                  name: "message",
                  label: "¿Qué necesitas resolver?",
                  type: "textarea",
                  required: true,
                },
              ]}
              submitLabel="Enviar mensaje"
              successMessage="Listo, tu mensaje ya va en camino. Recibirás respuesta en 1 a 2 días hábiles."
            />
          </div>
        </div>
      </section>
    </>
  );
}
