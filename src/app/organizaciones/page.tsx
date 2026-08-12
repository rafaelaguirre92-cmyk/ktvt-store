import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeading } from "@/components/content";
import { DataForm } from "@/components/forms";
import {
  impactPoints,
  schoolModalities,
  serviceGroups,
  socialCommitment,
  whyKtvt,
} from "@/lib/institutional";

export const metadata: Metadata = {
  title: "Ferias del libro y eventos para organizaciones",
  description:
    "Encuentra ferias del libro, cuentacuentos y eventos para escuelas, empresas y grupos, pensados según el público y lo que quieres lograr.",
};

export default function OrganizationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Para escuelas, empresas y grupos"
        title="Lleva historias a la comunidad que quieres reunir"
        description="Una feria, un cuentacuentos o varios encuentros: elige la forma de acercar los libros a estudiantes, colaboradores, familias o invitados."
      />
      <section className="section">
        <div className="container cluster">
          <Link className="button primary" href="#propuesta">
            Quiero una propuesta
          </Link>
          <Link className="button secondary" href="#opciones">
            Ver opciones
          </Link>
        </div>
      </section>
      <section className="section" id="opciones">
        <div className="container grid-3">
          {serviceGroups.map((group) => (
            <article className="feature-card stack" key={group.title}>
              <p className="eyebrow">{group.eyebrow}</p>
              <h3>{group.title}</h3>
              <p className="muted">{group.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <SectionHeading
            eyebrow="Dos formas de empezar"
            title="Una fecha especial o varios encuentros"
            description="Comienza con una sola jornada o reparte las actividades a lo largo del año."
          />
          <div className="grid-2">
            {schoolModalities.map((modality) => (
              <article className="feature-card stack" key={modality.title}>
                <h3>{modality.title}</h3>
                <p className="muted">{modality.description}</p>
                <p className="small muted">{modality.components}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Cada organización es distinta"
            title="El plan debe parecerse a quienes van a vivirlo"
          />
          <div className="grid-3">
            {whyKtvt.map((item) => (
              <article className="feature-card stack" key={item.title}>
                <h3>{item.title}</h3>
                <p className="muted">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="container split-panel">
          <div className="stack">
            <p className="eyebrow">Lo que puede pasar después</p>
            <h2>El libro vuelve a aparecer en la conversación</h2>
            <ul className="stack tight">
              {impactPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="feature-card stack">
            <p className="eyebrow">Compromiso social</p>
            <h3>Leer no debería ser un lujo</h3>
            <p className="muted">{socialCommitment}</p>
          </div>
        </div>
      </section>
      <section className="section" id="propuesta">
        <div className="container split-panel">
          <div className="stack">
            <p className="eyebrow">Comparte tu idea</p>
            <h2>Arma el plan adecuado para tu organización</h2>
            <p className="lede muted">
              Comparte algunos datos y recibirás una opción recomendada, el siguiente paso y una
              cotización.
            </p>
            <div className="wire-block">Caso, fotografía o testimonio futuro</div>
          </div>
          <div className="summary-box">
            <DataForm
              kind="organization"
              fields={[
                { name: "name", label: "Tu nombre", required: true },
                { name: "email", label: "Correo de trabajo", type: "email", required: true },
                { name: "phone", label: "WhatsApp", type: "tel", required: true },
                {
                  name: "organization",
                  label: "Empresa, escuela u organización",
                  required: true,
                },
                {
                  name: "organization_size",
                  label: "Número aproximado de participantes",
                  type: "select",
                  required: true,
                  options: ["1–25 personas", "26–100 personas", "101–500 personas", "Más de 500"],
                },
                {
                  name: "interest",
                  label: "Interés principal",
                  type: "select",
                  required: true,
                  options: [
                    "Un día para contar",
                    "Lectura durante todo el ciclo",
                    "Compra de libros por volumen",
                    "Evento para colaboradores o familias",
                    "No sé cuál elegir",
                  ],
                },
                {
                  name: "message",
                  label: "Contexto adicional",
                  type: "textarea",
                },
              ]}
              submitLabel="Recibir propuesta"
              successMessage="Listo, tu mensaje ya va en camino. Recibirás respuesta en 1 a 2 días hábiles."
            />
          </div>
        </div>
      </section>
    </>
  );
}
