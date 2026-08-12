import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Gift, MessageCircle } from "lucide-react";
import { ArticleCard, EventCard, ProductCard, SectionHeading, TrustStrip } from "@/components/content";
import { NewsletterForm } from "@/components/forms";
import { ages } from "@/lib/catalog";
import { homeHero, homeSeo } from "@/lib/institutional";
import { getArticles, getEvents, getProducts } from "@/lib/repository";

const ageEyebrows: Record<string, string> = {
  "0–2 años": "Mis primeros pasos",
  "3–5 años": "Aprendiendo a leer",
  "6–8 años": "Leo yo solito",
  "9–12 años": "Elijo qué leer",
  "Para toda la familia": "Para toda la familia",
};

export const metadata: Metadata = {
  title: homeSeo.title,
  description: homeSeo.description,
  alternates: { canonical: homeSeo.canonical },
  openGraph: {
    title: homeSeo.openGraphTitle,
    description: homeSeo.openGraphDescription,
  },
};

export default async function Home() {
  const [products, events, articles] = await Promise.all([
    getProducts(),
    getEvents(),
    getArticles(),
  ]);

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5210000000000";
  const whatsappMessage =
    "Hola. Busco un libro para mis hijos. Sus edades son [EDADES] y les interesa [INTERESES].";

  return (
    <>
      <section className="container hero">
        <div className="hero-copy">
          <h1>{homeHero.title}</h1>
          <p className="lede muted">{homeHero.description}</p>
          <div className="cluster lg">
            <Link className="button primary" href="/tienda">
              Explorar libros <ArrowRight size={17} />
            </Link>
            <Link className="text-link" href="/organizaciones">
              Para organizaciones
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-label="Espacio reservado para campaña estacional">
          <div className="wire-block tall">Fotografía principal de campaña</div>
          <div className="wire-block">Portada destacada</div>
          <div className="wire-block">Detalle editorial</div>
        </div>
      </section>

      <div className="container">
        <TrustStrip />
      </div>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Empieza por aquí"
            title="Libros infantiles para cada edad"
            description="La edad es una buena pista. Lo que les gusta hoy termina de ayudarte a elegir."
          />
          <div className="grid-5">
            {ages.map((age) => (
              <Link className="age-card" href={`/tienda?edad=${encodeURIComponent(age)}`} key={age}>
                <span className="eyebrow">{ageEyebrows[age] ?? "Explorar por edad"}</span>
                <div className="cluster spread">
                  {age !== "Para toda la familia" && <h3>{age}</h3>}
                  <ArrowRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <SectionHeading
            eyebrow="Elegidos con calma"
            title="Historias que da gusto llevar a casa"
            description="Libros leídos y escogidos porque despiertan preguntas, risas o ese “otra vez” que da gusto escuchar."
            action={{ href: "/tienda?recomendados=true", label: "Ver toda la selección" }}
          />
          <div className="product-grid">
            {products
              .filter((product) => product.recommended)
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Talleres"
            title="Actividades para compartir con tus hijos"
            description="Creatividad, lectura y más — cada taller es distinto. Algunos van de libros; otros, de otras cosas que también les encantan."
            action={{ href: "/eventos", label: "Ver todos los talleres" }}
          />
          <div className="grid-2">
            {events.slice(0, 2).map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="container split-panel">
          <div className="stack">
            <Building2 size={32} />
            <p className="eyebrow">Para escuelas, empresas y grupos</p>
            <h2>Haz de los libros un punto de encuentro</h2>
            <p className="lede">
              Ferias del libro, cuentacuentos y eventos para estudiantes, colaboradores, familias o
              la comunidad que quieras reunir.
            </p>
            <Link className="button light" href="/organizaciones">
              Ver opciones para organizaciones
            </Link>
          </div>
          <div className="wire-block">Imagen o caso de colaboración</div>
        </div>
      </section>

      <section className="section">
        <div className="container lead-box">
          <div className="stack tight">
            <Gift size={28} />
            <p className="eyebrow">Guía gratuita</p>
            <h2>7 ideas para leer en casa sin convertirlo en tarea</h2>
            <p className="muted">Todas caben entre semana y no necesitan una rutina perfecta.</p>
          </div>
          <div className="stack tight">
            <NewsletterForm />
            <p className="small muted">
              Recibirás la guía y solo los contenidos que aceptes. Puedes darte de baja cuando
              quieras.
            </p>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <SectionHeading
            eyebrow="Tips para mamás"
            title="Del blog"
            action={{ href: "/blog", label: "Ver todos los artículos" }}
          />
          <div className="grid-3">
            {articles.slice(0, 3).map((article) => (
              <ArticleCard article={article} key={article.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="narrow stack">
            <MessageCircle size={30} />
            <p className="eyebrow">¿No sabes cuál elegir?</p>
            <h2>Encuentra por dónde empezar</h2>
            <p className="lede muted">
              Comparte por WhatsApp sus edades, sus temas favoritos y si ya leen solos o contigo.
              Recibirás pocas opciones, bien pensadas y sin compromiso de compra.
            </p>
            <div className="cluster">
              <Link className="button primary" href="/tienda">
                Explorar libros
              </Link>
              <a
                className="button secondary"
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
              >
                Pedir recomendación
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
