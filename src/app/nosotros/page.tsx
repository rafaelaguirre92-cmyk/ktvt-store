import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/content";
import {
  painPoints,
  philosophySteps,
  values,
  valueProps,
  workPhases,
} from "@/lib/institutional";

export const metadata: Metadata = {
  title: "Cómo elegir libros para tus hijos sin complicarte",
  description:
    "Empieza por su edad y por lo que hoy les da curiosidad. Compara menos, elige más fácil y encuentra historias para leer juntos.",
};

export default function AboutPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5210000000000";
  const whatsappMessage =
    "Hola. Busco un libro para mis hijos. Sus edades son [EDADES] y les interesa [INTERESES].";

  return (
    <>
      <PageHero
        eyebrow="Tu guía para elegir"
        title="Elegir un libro no tendría que sentirse como examen"
        description="Empieza con su edad y con eso que hoy les da curiosidad. Si todavía dudas, pide dos o tres opciones que sí tengan sentido para ellos."
      />
      <section className="section">
        <div className="container">
          <div className="narrow stack mb-4">
            <h2>Hay muchísimos libros. Tu tiempo no es infinito.</h2>
            <p className="lede muted">
              No necesitas revisar un catálogo entero ni acertar a la primera. Una buena pista es
              empezar por lo que les interesa hoy.
            </p>
          </div>
          <div className="grid-3">
            {painPoints.map((point) => (
              <article className="feature-card stack" key={point.title}>
                <h3>{point.title}</h3>
                <p className="muted">{point.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <SectionHeading
            eyebrow="Para elegir sin perderte"
            title="Pocas opciones. Mejor pensadas."
            description="La idea es que salgas con un libro que tenga sentido para tus hijos, no con una lista interminable."
          />
          <div className="grid-4">
            {valueProps.map((item) => (
              <article className="feature-card stack" key={item.title}>
                <h3>{item.title}</h3>
                <p className="muted">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container narrow stack">
          <p className="eyebrow">Un libro puede aparecer en cualquier momento</p>
          <h2>Que una historia se cuele en su día</h2>
          <p className="lede muted">
            En una pregunta durante la cena, una risa antes de dormir o un personaje que quieren
            dibujar una y otra vez.
          </p>
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <SectionHeading
            eyebrow="Una señal de que funcionó"
            title="Cierran el libro y la historia sigue ahí"
            description="No importa si leyeron cinco páginas o el cuento completo. Importa que algo les haya dado ganas de preguntar, jugar o volver mañana."
          />
          <div className="grid-3">
            {philosophySteps.map((step) => (
              <article className="feature-card stack" key={step.title}>
                <h3>{step.title}</h3>
                <p className="muted">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Lo que sí importa al recomendar"
            title="El libro tiene que tener sentido para ellos"
            description="La edad es solo una pista. También cuentan sus preguntas, sus temas favoritos y cómo se llevan con la lectura."
          />
          <div className="grid-3">
            {values.map((value) => (
              <article className="feature-card stack" key={value.title}>
                <h3>{value.title}</h3>
                <p className="muted">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <SectionHeading eyebrow="Así de sencillo" title="Tres pasos. Sin complicarte." />
          <div className="grid-3">
            {workPhases.map((phase) => (
              <article className="feature-card stack" key={phase.title}>
                <h3>{phase.title}</h3>
                <p className="muted">{phase.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="narrow stack">
            <p className="eyebrow">Empieza por eso que hoy les encanta</p>
            <h2>Encuentra una historia que se parezca a ellos</h2>
            <p className="lede muted">
              Explora por edad o pide dos o tres opciones por WhatsApp.
            </p>
            <div className="cluster">
              <Link className="button primary" href="/tienda">
                Explorar libros
              </Link>
              <a
                className="button secondary"
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
              >
                <MessageCircle size={18} /> Pedir recomendación
              </a>
              <Link className="button secondary" href="/organizaciones">
                Para organizaciones
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
