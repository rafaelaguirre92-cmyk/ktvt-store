import type { Product } from "@/lib/catalog";

export type ShopSortOption =
  | "destacados"
  | "precio-asc"
  | "precio-desc"
  | "rating"
  | "nombre"
  | "nuevos";

export function sortProducts(products: Product[], orden?: string): Product[] {
  const sorted = [...products];

  switch (orden) {
    case "precio-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "precio-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
      );
    case "nombre":
      return sorted.sort((a, b) => a.title.localeCompare(b.title, "es"));
    case "nuevos":
      return sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.rating - a.rating);
    default:
      return sorted.sort((a, b) => {
        const weight = (product: Product) =>
          (product.recommended ? 2 : 0) + (product.isNew ? 1 : 0);
        return weight(b) - weight(a) || b.rating - a.rating;
      });
  }
}
