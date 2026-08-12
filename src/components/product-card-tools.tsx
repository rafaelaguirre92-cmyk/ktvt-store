"use client";

import { useEffect, useState } from "react";
import { Heart, Share2 } from "lucide-react";
import type { Product } from "@/lib/catalog";

const favoritesKey = "ktvt-favorites-v1";

function readFavorites() {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const stored = window.localStorage.getItem(favoritesKey);
    return new Set<string>(stored ? (JSON.parse(stored) as string[]) : []);
  } catch {
    return new Set<string>();
  }
}

export function ProductCardToolbar({ product }: { product: Pick<Product, "id" | "slug" | "title"> }) {
  const [favorite, setFavorite] = useState(false);
  const [shareNote, setShareNote] = useState<string | null>(null);

  useEffect(() => {
    setFavorite(readFavorites().has(product.id));
  }, [product.id]);

  function toggleFavorite() {
    const favorites = readFavorites();
    if (favorites.has(product.id)) favorites.delete(product.id);
    else favorites.add(product.id);
    window.localStorage.setItem(favoritesKey, JSON.stringify([...favorites]));
    setFavorite(favorites.has(product.id));
  }

  async function shareProduct() {
    const url = `${window.location.origin}/producto/${product.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareNote("Enlace copiado");
    } catch {
      setShareNote(null);
    }
  }

  useEffect(() => {
    if (!shareNote) return;
    const timer = window.setTimeout(() => setShareNote(null), 2000);
    return () => window.clearTimeout(timer);
  }, [shareNote]);

  return (
    <div className="product-card-tools">
      <button
        type="button"
        className={favorite ? "active" : ""}
        aria-label={favorite ? "Quitar de favoritos" : "Guardar en favoritos"}
        aria-pressed={favorite}
        onClick={toggleFavorite}
      >
        <Heart size={16} fill={favorite ? "currentColor" : "none"} />
      </button>
      <button type="button" aria-label="Compartir libro" onClick={shareProduct}>
        <Share2 size={16} />
      </button>
      {shareNote && (
        <span className="sr-only" role="status">
          {shareNote}
        </span>
      )}
    </div>
  );
}

export function ProductRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  return (
    <div
      className="product-rating"
      aria-label={`${rating.toFixed(1)} de 5 estrellas${reviewCount ? `, ${reviewCount} reseñas` : ""}`}
    >
      <div className="stars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => {
          const star = index + 1;
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;
          return (
            <span className={`star${filled ? " filled" : half ? " half" : ""}`} key={star}>
              ★
            </span>
          );
        })}
      </div>
      <span className="small muted">
        {rating.toFixed(1)}
        {reviewCount > 0 ? ` (${reviewCount})` : ""}
      </span>
    </div>
  );
}
