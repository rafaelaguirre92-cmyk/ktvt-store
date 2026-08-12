import type { Metadata } from "next";
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
  title: "Organizaciones",
  description:
    "Ferias, cuentacuentos, talleres y eventos a la medida para tu escuela, empresa o grupo.",
};

export default function OrganizationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Para escuelas y grupos"
        title="Lleva la lectura a tu comunidad"
        description="Ferias del libro, cuentacuentos, capacitación y eventos hechos a la medida de tu escuela o organización."
      />
      <section className="section">
        <div className="container grid-3">
          {serviceGroups.map((group) => (
            <article className="feature-card stack" key={group.title}>
              <p className="eyebrow">{group.title}</p>
              <h3>{group.items.join(" · ")}</h3>
              <p className="muted">{group.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <SectionHeading
            eyebrow="Modalidades"
            title="¿Un día o todo el año?"
            description="Elige una jornada concentrada o una ruta que mantenga la lectura viva durante el ciclo escolar."
          />
          <div className="grid-2">
            {schoolModalities.map((modality) => (
              <article className="feature-card stack" key={modality.title}>
                <h3>{modality.title}</h3>
                <p className="muted">{modality.description}</p>
                <ol className="stack tight">
                  {modality.steps.map((step, index) => (
                    <li key={step}>
                      {index + 1}. {step}
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Por qué trabajar con nosotros"
            title="Porque cada comunidad lectora es distinta"
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
            <p className="eyebrow">Qué suele pasar después</p>
            <h2>El libro vuelve a salir en la conversación</h2>
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
      <section className="section">
        <div className="container split-panel">
          <div className="stack">
            <p className="eyebrow">Cuéntanos tu idea</p>
            <h2>Armemos algo útil para tu escuela o grupo</h2>
            <p className="lede muted">
              Con unos datos te proponemos la modalidad, el siguiente paso y una cotización.
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
                { name: "organization", label: "Organización", required: true },
                {
                  name: "organization_size",
                  label: "Tamaño aproximado",
                  type: "select",
                  required: true,
                  options: ["1–25 personas", "26–100 personas", "101–500 personas", "Más de 500"],
                },
                {
                  name: "interest",
                  label: "Principal interés",
                  type: "select",
                  required: true,
                  options: [
                    "Un día para contar",
                    "Contamos todo el año",
                    "Compra por volumen",
                    "Evento empresarial",
                    "Aún no estoy seguro",
                  ],
                },
                {
                  name: "message",
                  label: "Contexto adicional",
                  type: "textarea",
                },
              ]}
              submitLabel="Solicitar información"
              successMessage="Recibimos tus datos. Te contactaremos pronto."
            />
          </div>
        </div>
      </section>
    </>
  );
}
