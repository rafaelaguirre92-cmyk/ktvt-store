import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsletterForm } from "@/components/forms";
import { formatDate } from "@/lib/catalog";
import { getArticle } from "@/lib/repository";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Artículo no encontrado" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, type: "article" },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: { "@type": "Organization", name: "KTVT" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replaceAll("<", "\\u003c") }}
      />
      <article>
        <header className="page-hero">
          <div className="container">
            <div className="narrow stack">
              <Link className="text-link small" href="/blog">
                ← Volver al blog
              </Link>
              <p className="eyebrow">{article.category}</p>
              <h1>{article.title}</h1>
              <p className="lede">{article.excerpt}</p>
              <p className="muted small">
                {formatDate(article.publishedAt)} · {article.readingMinutes} minutos de lectura
              </p>
            </div>
          </div>
        </header>
        <div className="container section">
          <div className="narrow">
          <div className="image-placeholder landscape">Imagen editorial del artículo</div>
          <div className="prose">
            {article.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <aside className="lead-box mt-6">
            <div className="stack tight">
              <p className="eyebrow">Siguiente paso</p>
              <h2>Lleva una idea sencilla a casa</h2>
              <p className="muted">Descarga gratis la guía con siete ideas para leer en casa.</p>
            </div>
            <NewsletterForm />
          </aside>
          <div className="cluster mt-4">
            <Link className="button primary" href="/tienda">
              Explorar libros
            </Link>
            <Link className="button secondary" href="/eventos">
              Ver talleres
            </Link>
          </div>
          </div>
        </div>
      </article>
    </>
  );
}
