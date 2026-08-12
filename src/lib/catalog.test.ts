import { describe, expect, it } from "vitest";
import { articles, formatCurrency, products } from "@/lib/catalog";

describe("catálogo de demostración", () => {
  it("mantiene slugs y SKU únicos", () => {
    expect(new Set(products.map((product) => product.slug)).size).toBe(products.length);
    expect(new Set(products.map((product) => product.sku)).size).toBe(products.length);
  });

  it("no publica productos con inventario negativo", () => {
    expect(products.every((product) => product.stock >= 0)).toBe(true);
  });

  it("incluye tres artículos iniciales orientados a contenido", () => {
    expect(articles).toHaveLength(3);
    expect(articles.every((article) => article.content.length >= 3)).toBe(true);
  });

  it("formatea centavos como pesos mexicanos", () => {
    expect(formatCurrency(28900)).toContain("289");
  });
});
