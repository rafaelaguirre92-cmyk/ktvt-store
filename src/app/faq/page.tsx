import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/content";

export const metadata: Metadata = {
  title: "Dudas sobre libros, compras y entregas",
  description:
    "Encuentra respuestas sencillas sobre recomendaciones, pagos, entregas, compra sin cuenta, cambios y actividades.",
};

const questions = [
  {
    question: "¿Los libros son físicos?",
    answer: "Sí. Todos los títulos de la tienda son libros físicos.",
  },
  {
    question: "¿Cómo elijo un libro según la edad?",
    answer:
      "Empieza por la edad y fíjate también en lo que le gusta, cuánto tiempo suele escuchar y si prefiere mirar, escuchar o leer solo. Si dudas entre varias opciones, pide una recomendación por WhatsApp.",
  },
  {
    question: "¿Puedo recibir una recomendación personal?",
    answer:
      "Sí. Comparte sus edades, sus temas favoritos y si leen solos o contigo. Recibirás pocas opciones para comparar antes de comprar.",
  },
  {
    question: "¿Qué formas de pago aceptan?",
    answer:
      "Puedes pagar con los métodos que aparezcan disponibles al completar tu pedido.",
  },
  {
    question: "¿Cómo funcionan las entregas?",
    answer:
      "Antes de preparar tu pedido se confirman la cobertura, la fecha y el costo. Así puedes aprobar la opción disponible para tu ubicación.",
  },
  {
    question: "¿Necesito crear una cuenta para comprar?",
    answer: "No. Puedes completar tu compra como invitada con tus datos de contacto y entrega.",
  },
  {
    question: "¿Puedo cambiar o devolver un libro?",
    answer:
      "Consulta los criterios vigentes en la página de cambios y devoluciones. Si recibiste un producto dañado o incorrecto, inicia tu solicitud dentro del plazo indicado.",
  },
  {
    question: "¿Qué ocurre si una actividad todavía no tiene fecha?",
    answer:
      "Puedes registrar tu interés. Conservaremos tus datos únicamente para avisarte cuando se publique la fecha.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Ayuda"
        title="Respuestas rápidas para elegir y comprar"
        description="Lo más importante sobre libros, pagos, entregas y actividades, sin vueltas."
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
                <p className="muted">Manda tu duda y recibirás respuesta en 1 a 2 días hábiles.</p>
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
