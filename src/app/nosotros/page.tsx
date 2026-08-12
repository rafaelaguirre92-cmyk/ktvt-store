import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import "./about.css";

export const metadata: Metadata = {
  title: "Conócenos | Libros que acercan a las familias",
  description:
    "Conoce la historia, la filosofía y la persona detrás de una selección de libros pensada para conectar, conversar y crecer en familia.",
  openGraph: {
    title: "Conoce la historia detrás de KTVT",
    description:
      "Libros seleccionados con cuidado para que leer en familia se convierta en una oportunidad para conectar, conversar y crecer.",
  },
};

const trustBlocks = [
  {
    title: "Cada libro tiene una razón",
    text: "El catálogo no se llena por llenar. Cada título se selecciona pensando en lo que puede aportar a distintas edades, intereses y familias.",
  },
  {
    title: "Denise está detrás de la selección",
    text: "No recibes una respuesta automática ni una lista genérica. Las recomendaciones parten de una mirada educativa y humana.",
  },
  {
    title: "Puedes preguntar antes de comprar",
    text: "Si dudas entre varias opciones, puedes compartir la edad y los intereses de tus hijos antes de decidir.",
  },
  {
    title: "Leer no se presenta como tarea",
    text: "Las historias se acercan desde la curiosidad y el disfrute, sin presión por terminar, avanzar o leer de una sola manera.",
  },
];

const offerings = [
  {
    title: "Libros seleccionados",
    text: "Historias elegidas por edad e intereses, con una razón clara para estar en el catálogo.",
    href: "/tienda",
    cta: "Explorar libros",
  },
  {
    title: "Talleres y actividades",
    text: "Encuentros para leer, crear, conversar y compartir tiempo en familia.",
    href: "/eventos",
    cta: "Ver actividades",
  },
  {
    title: "Organizaciones",
    text: "Ferias del libro, cuentacuentos y eventos para escuelas, empresas y grupos.",
    href: "/organizaciones",
    cta: "Ver opciones",
  },
];

export default function AboutPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5210000000000";
  const whatsappMessage =
    "Hola. Busco un libro para mis hijos. Sus edades son [EDADES] y les interesa [INTERESES].";

  return (
    <>
      <section className="container about-hero">
        <div className="about-hero-copy">
          <p className="eyebrow">Sobre KTVT</p>
          <h1>Los libros pueden acercar a una familia</h1>
          <p className="lede muted">
            Esa idea está detrás de KTVT: acercarte historias que tengan sentido para tus hijos y
            encuentren un lugar real en casa. No para leer por cumplir, sino para imaginar,
            conversar y crecer juntos.
          </p>
          <div className="about-actions">
            <Link className="button primary" href="/tienda">
              Explorar libros <ArrowRight size={17} />
            </Link>
            <Link className="button secondary" href="/organizaciones">
              Opciones para organizaciones
            </Link>
          </div>
        </div>
        <div aria-hidden="true" className="wire-block about-hero-visual">
          Fotografía de lectura en familia
        </div>
      </section>

      <section className="section">
        <div className="container split-panel">
          <div className="stack">
            <p className="eyebrow">Cómo empezó</p>
            <h2>De recomendar un libro a acompañar a más familias</h2>
            <p className="muted">
              La idea nació de una pregunta que muchas mamás comparten: entre tantos libros, ¿cómo
              saber cuál puede conectar con mis hijos?
            </p>
            <p className="muted">
              Lo que comenzó con recomendaciones personales fue creciendo hasta convertirse en un
              espacio donde los libros, los talleres y los encuentros comparten un mismo propósito:
              hacer que leer en familia se sienta cercano, posible y disfrutable.
            </p>
          </div>
          <div aria-hidden="true" className="wire-block">
            Imagen editorial sobre el origen de KTVT
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container split-panel">
          <div aria-hidden="true" className="wire-block about-portrait">
            Fotografía de Denise Salinas
            <small>Pendiente de incorporar</small>
          </div>
          <div className="stack">
            <p className="eyebrow">Quién está detrás</p>
            <h2>Denise Salinas, educadora y promotora de lectura</h2>
            <p className="muted">
              Denise está detrás de la selección y de la forma en que cada libro se recomienda. Su
              mirada como educadora parte de algo sencillo: no todas las familias necesitan el mismo
              libro ni todos los niños conectan con las mismas historias.
            </p>
            <p className="muted">
              Por eso, cada recomendación considera la edad, los intereses y la manera en que cada
              niño disfruta acercarse a los libros.
            </p>
          </div>
        </div>
      </section>

      <section className="section about-mission">
        <div className="container narrow stack">
          <p className="eyebrow">La misión</p>
          <h2>Ayudarte a encontrar historias para conectar y crecer juntos</h2>
          <p className="lede muted">
            Acercar libros y experiencias que hagan más fácil elegir, leer y conversar en familia.
            Cada recomendación busca que la lectura encuentre un lugar en la vida cotidiana, sin
            convertirse en otra obligación que cumplir.
          </p>
        </div>
      </section>

      <section className="section soft about-philosophy">
        <div className="container narrow stack">
          <p className="eyebrow">La filosofía</p>
          <h2>No vender libros por vender</h2>
          <p className="muted">
            Un libro vale por lo que puede provocar: una pregunta inesperada, una emoción que por
            fin encuentra palabras, una risa compartida o una conversación que continúa después de
            cerrar la portada.
          </p>
          <p className="muted">
            Por eso, los títulos no se eligen solamente por ser nuevos o populares. Cada uno debe
            tener una razón para llegar a una familia.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="narrow stack mb-4">
            <p className="eyebrow">Por qué confiar</p>
            <h2>Detrás de cada recomendación hay una decisión personal</h2>
          </div>
          <div className="grid-2">
            {trustBlocks.map((block) => (
              <article className="feature-card stack" key={block.title}>
                <h3>{block.title}</h3>
                <p className="muted">{block.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container split-panel">
          <div className="stack">
            <p className="eyebrow">La visión</p>
            <h2>Que los libros formen parte de la vida diaria</h2>
            <p className="muted">
              Una casa donde un cuento aparece antes de dormir, una pregunta continúa durante la
              cena y los niños vuelven a un libro porque quieren, no porque toca.
            </p>
            <p className="muted">
              Que la lectura sea una forma de acompañarse, conocerse y estar juntos.
            </p>
          </div>
          <div aria-hidden="true" className="wire-block about-hero-visual">
            Imagen editorial de lectura en casa
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="narrow stack mb-4">
            <p className="eyebrow">Más allá de una librería</p>
            <h2>Distintas maneras de encontrarse alrededor de los libros</h2>
          </div>
          <div className="grid-3">
            {offerings.map((item) => (
              <article className="feature-card stack" key={item.title}>
                <h3>{item.title}</h3>
                <p className="muted">{item.text}</p>
                <Link className="text-link" href={item.href}>
                  {item.cta} <ArrowRight size={17} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="narrow stack">
            <p className="eyebrow">Empieza con una historia</p>
            <h2>Encuentra un libro para compartir en casa</h2>
            <p className="lede muted">
              Explora la selección o pide una recomendación si todavía no sabes cuál elegir.
            </p>
            <div className="about-actions">
              <Link className="button primary" href="/tienda">
                Explorar libros
              </Link>
              <a
                className="button secondary"
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
              >
                <MessageCircle size={18} /> Pedir recomendación
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
