import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Gift, MessageCircle } from "lucide-react";
import { ArticleCard, EventCard, ProductCard, SectionHeading, TrustStrip } from "@/components/content";
import { NewsletterForm } from "@/components/forms";
import { ages } from "@/lib/catalog";
import { homeHero, homeSeo } from "@/lib/institutional";
import { getArticles, getEvents, getProducts } from "@/lib/repository";

export const metadata: Metadata = {
  title: homeSeo.title,
  description: homeSeo.description,
  openGraph: {
    title: `${homeSeo.title} · KTVT`,
    description: homeSeo.description,
  },
};

export default async function Home() {
  const [products, events, articles] = await Promise.all([
    getProducts(),
    getEvents(),
    getArticles(),
  ]);

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5210000000000";

  return (
    <>
      <section className="container hero">
        <div className="hero-copy">
          <h1>{homeHero.title}</h1>
          <p className="lede muted">{homeHero.description}</p>
          <div className="cluster lg">
            <Link className="button primary" href="/tienda">
              Ver la tienda <ArrowRight size={17} />
            </Link>
            <Link className="text-link" href="/organizaciones">
              ¿Eres maestra o Colegio?
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
            eyebrow="Por edad"
            title="Elige según la edad de tus hijos"
            description="La edad ayuda a orientarte, pero lo que más pesa es lo que les gusta y cómo están leyendo hoy."
          />
          <div className="grid-5">
            {ages.map((age) => (
              <Link className="age-card" href={`/tienda?edad=${encodeURIComponent(age)}`} key={age}>
                <span className="eyebrow">Explorar por edad</span>
                <div className="cluster spread">
                  <h3>{age}</h3>
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
            eyebrow="Nuestra selección"
            title="Los que volveríamos a regalar"
            description="Cada uno lo revisamos antes de ponerlo aquí. Los que más funcionan con otras mamás también."
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
            <p className="eyebrow">¿Trabajas en una escuela?</p>
            <h2>Llevamos libros y experiencias a tu plantel</h2>
            <p className="lede">
              Ferias del libro, cuentacuentos, talleres para mamás y propuestas hechas a la medida
              de tu escuela.
            </p>
            <Link className="button light" href="/organizaciones">
              Ver opciones para escuelas
            </Link>
          </div>
          <div className="wire-block">Imagen o caso de colaboración</div>
        </div>
      </section>

      <section className="section">
        <div className="container lead-box">
          <div className="stack tight">
            <Gift size={28} />
            <p className="eyebrow">Guía gratis</p>
            <h2>7 ideas para leer en casa sin que se sienta como tarea</h2>
            <p className="muted">Te la mandamos por correo. Empieza con algo pequeño esta semana.</p>
          </div>
          <NewsletterForm />
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
            <h2>Escríbenos: cuéntanos la edad de tu hijo o hija y te orientamos</h2>
            <p className="lede muted">
              Por WhatsApp, con gusto. Sin compromiso de compra, solo para ayudarte a acertar.
            </p>
            <div className="cluster">
              <Link className="button primary" href="/tienda">
                Explorar la tienda
              </Link>
              <a
                className="button secondary"
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hola, necesito ayuda para elegir un libro para mis hijos.")}`}
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
