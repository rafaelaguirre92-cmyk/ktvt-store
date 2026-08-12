import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeading } from "@/components/content";
import {
  mission,
  painPoints,
  philosophySteps,
  storyPillars,
  values,
  vision,
  workPhases,
} from "@/lib/institutional";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce KTVT: libros infantiles elegidos a mano y orientación para mamás que quieren leer en familia sin complicarse.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Quiénes somos"
        title="Una selección de libros que sí tiene sentido"
        description="Empezamos recomendando de mamá a mamá. Hoy seguimos igual: ayudarte a encontrar historias que a tus hijos les van a prender."
      />
      <section className="section">
        <div className="container">
          <div className="narrow stack mb-4">
            <h2>Quieres que lean, pero elegir el libro correcto no siempre es fácil.</h2>
            <p className="lede muted">
              Lo sabemos porque lo vivimos. Por eso curamos cada libro con calma y te
              orientamos cuando no sabes cuál probar.
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
            eyebrow="Qué encuentras aquí"
            title="Libros, guía y talleres en un solo lugar"
            description="Todo pensado para que leer en casa se sienta posible, aunque andes con mil cosas."
          />
          <div className="grid-4">
            {storyPillars.map((pillar) => (
              <article className="feature-card stack" key={pillar.title}>
                <h3>{pillar.title}</h3>
                <p className="muted">{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          <article className="feature-card stack">
            <p className="eyebrow">{mission.title}</p>
            <h2>{mission.statement}</h2>
            <p className="muted">{mission.detail}</p>
          </article>
          <article className="feature-card stack">
            <p className="eyebrow">{vision.title}</p>
            <h2>{vision.statement}</h2>
            <p className="muted">{vision.detail}</p>
          </article>
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <SectionHeading
            eyebrow="Así se siente cuando funciona"
            title="Un buen libro cambia la plática en casa"
            description="No se trata de leer mucho ni rápido. Se trata de que quieran volver a abrirlo."
          />
          <div className="grid-3">
            {philosophySteps.map((step, index) => (
              <article className="feature-card stack" key={step.title}>
                <p className="eyebrow">{index + 1}</p>
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
            eyebrow="En qué nos guiamos"
            title="Seis cosas que no negociamos"
            description="Así elegimos cada libro y cada experiencia."
          />
          <div className="grid-3">
            {values.map((value, index) => (
              <article className="feature-card stack" key={value.title}>
                <p className="eyebrow">{index + 1}</p>
                <h3>{value.title}</h3>
                <p className="muted">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <SectionHeading eyebrow="Cómo te acompañamos" title="Antes, durante y después del libro" />
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
            <p className="eyebrow">¿Le damos?</p>
            <h2>Encuentra un libro para el momento que viven hoy</h2>
            <p className="lede muted">Explora la tienda o escríbenos por WhatsApp. Te orientamos con gusto.</p>
            <div className="cluster">
              <Link className="button primary" href="/tienda">
                Ver la tienda
              </Link>
              <Link className="button secondary" href="/organizaciones">
                ¿Vienes de una escuela?
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
