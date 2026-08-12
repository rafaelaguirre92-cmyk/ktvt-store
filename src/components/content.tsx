import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Clock, MapPin, Sparkles, Tag } from "lucide-react";
import type { Article, Event, Product } from "@/lib/catalog";
import { formatCurrency, formatDate } from "@/lib/catalog";
import { trustHighlights } from "@/lib/institutional";
import { ProductCardToolbar, ProductRating } from "@/components/product-card-tools";
import { ProductCardAction } from "@/components/cart";

function ProductImageBadges({ product }: { product: Product }) {
  if (product.isNew) {
    return (
      <div className="product-badges">
        <span className="badge">
          <Tag size={13} /> Nuevo
        </span>
      </div>
    );
  }

  if (product.recommended) {
    return (
      <div className="product-badges">
        <span className="badge">
          <Sparkles size={13} /> Recomendado
        </span>
      </div>
    );
  }

  return null;
}

export function ProductPrice({
  product,
  compact = false,
}: {
  product: Pick<Product, "price" | "compareAtPrice">;
  compact?: boolean;
}) {
  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);

  return (
    <div className={`product-price-row${compact ? " compact" : ""}`}>
      <strong className="product-price-current">{formatCurrency(product.price)}</strong>
      {hasDiscount && product.compareAtPrice && (
        <span className="product-price-compare">{formatCurrency(product.compareAtPrice)}</span>
      )}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p className="lede muted">{description}</p>}
      </div>
      {action && (
        <Link className="text-link" href={action.href}>
          {action.label} <ArrowRight size={17} />
        </Link>
      )}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link href={`/producto/${product.slug}`} className="product-image">
        <div className="image-placeholder">
          <span>Portada</span>
          <small>{product.title}</small>
        </div>
        <ProductImageBadges product={product} />
      </Link>
      <div className="product-copy">
        <div className="product-card-meta">
          <span className="muted small">{product.age}</span>
          <ProductCardToolbar product={product} />
        </div>
        <Link href={`/producto/${product.slug}`}>
          <h3>{product.title}</h3>
        </Link>
        <ProductRating rating={product.rating} reviewCount={product.reviewCount} />
        <p className="muted small product-excerpt">{product.shortDescription}</p>
        <div className="card-actions">
          <ProductPrice compact product={product} />
          <ProductCardAction compact product={product} />
        </div>
      </div>
    </article>
  );
}

export function EventCard({ event }: { event: Event }) {
  return (
    <article className="card stack">
      <div className="cluster spread">
        <span className="badge">{event.type}</span>
        <span className="muted small">{event.modality}</span>
      </div>
      <div>
        <h3>{event.title}</h3>
        <p className="muted">{event.description}</p>
      </div>
      <div className="stack tight small">
        <span className="cluster">
          <Clock size={16} /> {event.duration}
        </span>
        <span className="cluster">
          <MapPin size={16} /> {event.audience}
        </span>
        <span className="cluster">
          <CalendarDays size={16} /> {event.date ? formatDate(event.date) : "Fecha por anunciar"}
        </span>
      </div>
      <div className="cluster spread">
        <strong>{event.price ? formatCurrency(event.price) : "Registro de interés"}</strong>
        <Link className="button secondary" href={`/eventos#${event.slug}`}>
          {event.date ? "Reservar lugar" : "Me interesa"}
        </Link>
      </div>
    </article>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  const href = `/blog/${article.slug}`;

  return (
    <article className="card article-card stack">
      <Link className="article-card-image" href={href} aria-label={`Leer: ${article.title}`}>
        <div className="image-placeholder landscape">Imagen editorial</div>
      </Link>
      <div className="cluster muted small">
        <span>{article.category}</span>
        <span>·</span>
        <span>{article.readingMinutes} min</span>
      </div>
      <Link href={href}>
        <h3>{article.title}</h3>
      </Link>
      <p className="muted">{article.excerpt}</p>
      <Link className="text-link" href={href}>
        Leer artículo <ArrowRight size={17} />
      </Link>
    </article>
  );
}

export function TrustStrip() {
  const items = trustHighlights;

  return (
    <div className="trust-strip">
      {items.map((item) => (
        <span className="cluster" key={item}>
          <Check size={17} /> {item}
        </span>
      ))}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="narrow stack">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
          <p className="lede">{description}</p>
        </div>
      </div>
    </section>
  );
}
