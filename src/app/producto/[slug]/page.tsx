import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, ShieldCheck, Sparkles, Tag, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductCardAction } from "@/components/cart";
import { ProductCard, ProductPrice, SectionHeading } from "@/components/content";
import { ProductCardToolbar, ProductRating } from "@/components/product-card-tools";
import { getProduct, getProducts } from "@/lib/repository";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Libro no encontrado" };
  return {
    title: product.title,
    description: product.shortDescription,
    openGraph: { title: product.title, description: product.shortDescription, type: "website" },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = (await getProducts())
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        (candidate.age === product.age || candidate.category === product.category),
    )
    .slice(0, 4);
  const whatsapp = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5210000000000"}?text=${encodeURIComponent(`Hola, quiero una recomendación similar a ${product.title}.`)}`;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription,
    sku: product.sku,
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "MXN",
      price: product.price / 100,
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema).replaceAll("<", "\\u003c") }}
      />
      <section className="section">
        <div className="container product-detail">
          <div className="product-gallery">
            <div className="image-placeholder">
              <span>Portada principal</span>
              <small>{product.title}</small>
            </div>
            <div className="grid-2">
              <div className="wire-block">Interior del libro</div>
              <div className="wire-block">Detalle de ilustración</div>
            </div>
          </div>
          <div className="stack">
            <Link className="text-link small" href="/tienda">
              ← Volver a la tienda
            </Link>
            <div className="product-detail-meta">
              <div className="cluster">
                <span className="badge">{product.age}</span>
                <span className="badge">{product.category}</span>
                {product.isNew ? (
                  <span className="badge">
                    <Tag size={13} /> Nuevo
                  </span>
                ) : product.recommended ? (
                  <span className="badge">
                    <Sparkles size={13} /> Recomendado
                  </span>
                ) : null}
              </div>
              <ProductCardToolbar product={product} />
            </div>
            <h1>{product.title}</h1>
            <ProductRating rating={product.rating} reviewCount={product.reviewCount} />
            <p className="lede muted">{product.shortDescription}</p>
            <ProductPrice product={product} />
            <p className={product.stock > 0 ? "stock" : "stock out"}>
              {product.stock > 0 ? `${product.stock} disponibles` : "Por ahora en lista de espera"}
            </p>
            <div className="cluster">
              <ProductCardAction product={product} />
              <a className="button secondary" href={whatsapp} target="_blank" rel="noreferrer">
                <MessageCircle size={18} /> Pedir recomendación
              </a>
            </div>
            <div className="trust-strip">
              <span className="cluster">
                <ShieldCheck size={18} /> Checkout seguro
              </span>
              <span className="cluster">
                <Truck size={18} /> Entrega por confirmar
              </span>
            </div>
            <div className="stack">
              <h2>Sobre este libro</h2>
              <p>{product.description}</p>
            </div>
            <aside className="recommendation stack tight">
              <p className="eyebrow">Por qué lo recomendamos</p>
              <h3>La mirada KTVT</h3>
              <p>{product.recommendation}</p>
            </aside>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="section soft">
          <div className="container">
            <SectionHeading
              eyebrow="Para seguir explorando"
              title="Otros libros que pueden gustarles"
            />
            <div className="product-grid">
              {related.map((item) => (
                <ProductCard product={item} key={item.id} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
