import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/content";
import { DataForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos para recibir ayuda con libros, pedidos o talleres.",
};

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5210000000000";

  return (
    <>
      <PageHero
        eyebrow="Escríbenos"
        title="¿Dudas con tu pedido o qué libro elegir?"
        description="Libros, pedidos, talleres o propuestas para tu escuela: elige el medio que te quede más fácil."
      />
      <section className="section">
        <div className="container split-panel">
          <div className="stack">
            <div className="feature-card stack">
              <MessageCircle size={26} />
              <h3>WhatsApp</h3>
              <p className="muted">Para recomendaciones y dudas rápidas.</p>
              <a
                className="text-link"
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hola, quiero contactar a KTVT.")}`}
                target="_blank"
                rel="noreferrer"
              >
                Abrir conversación
              </a>
            </div>
            <div className="feature-card stack">
              <Mail size={26} />
              <h3>Correo</h3>
              <p className="muted">hola@ktvt.mx (dirección provisional)</p>
            </div>
            <p className="small muted">
              Respondemos normalmente en un plazo de 1 a 2 días hábiles.
            </p>
          </div>
          <div className="summary-box stack">
            <h2>Enviar un mensaje</h2>
            <DataForm
              kind="contact"
              fields={[
                { name: "name", label: "Nombre", required: true },
                { name: "email", label: "Correo", type: "email", required: true },
                { name: "phone", label: "WhatsApp", type: "tel" },
                {
                  name: "message",
                  label: "¿En qué podemos ayudarte?",
                  type: "textarea",
                  required: true,
                },
              ]}
              submitLabel="Enviar mensaje"
              successMessage="Recibimos tu mensaje. Te responderemos en 1 a 2 días hábiles."
            />
          </div>
        </div>
      </section>
    </>
  );
}
