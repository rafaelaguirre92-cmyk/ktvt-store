import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/content";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Respuestas sobre pedidos, pagos, envíos, recomendaciones y talleres KTVT.",
};

const questions = [
  {
    question: "¿Los libros son físicos?",
    answer: "Sí. El catálogo de esta versión está compuesto por libros físicos.",
  },
  {
    question: "¿Cómo elijo un libro según la edad?",
    answer:
      "Puedes usar el filtro de edad como orientación. Si nos cuentas intereses y momento lector por WhatsApp, te ayudamos a comparar opciones.",
  },
  {
    question: "¿Qué formas de pago aceptan?",
    answer:
      "El checkout está preparado para Stripe, Mercado Pago, PayPal y transferencia coordinada por WhatsApp. Durante validación, las pasarelas funcionan únicamente en sandbox.",
  },
  {
    question: "¿Cómo funcionan los envíos?",
    answer:
      "La logística final depende de un tercero y sigue en definición. Antes de preparar el pedido confirmaremos cobertura, fecha y costo. El sistema queda preparado para entrega local y envío nacional.",
  },
  {
    question: "¿Necesito crear una cuenta para comprar?",
    answer: "No. Puedes completar la compra como invitado con tus datos de contacto y entrega.",
  },
  {
    question: "¿Puedo cambiar o devolver un libro?",
    answer:
      "Los criterios provisionales están en la página de cambios y devoluciones. Se revisarán legalmente antes del lanzamiento.",
  },
  {
    question: "¿Qué ocurre si un taller todavía no tiene fecha?",
    answer:
      "Puedes registrar tu interés. Conservaremos tus datos únicamente para avisarte cuando se publique la fecha.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Ayuda"
        title="Preguntas frecuentes"
        description="Información práctica para comprar, recibir tu pedido y participar en talleres."
      />
      <section className="section">
        <div className="container">
          <div className="narrow">
            <div className="faq-list">
              {questions.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
            <div className="lead-box mt-6">
              <div className="stack tight">
                <h2>¿Tu pregunta no está aquí?</h2>
                <p className="muted">Cuéntanos y te responderemos en 1 a 2 días hábiles.</p>
              </div>
              <Link className="button primary" href="/contacto">
                Ir a contacto
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
