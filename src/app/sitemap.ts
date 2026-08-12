import type { MetadataRoute } from "next";
import { getArticles, getEvents, getProducts } from "@/lib/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [products, events, articles] = await Promise.all([
    getProducts(),
    getEvents(),
    getArticles(),
  ]);
  const staticRoutes = [
    "",
    "/nosotros",
    "/tienda",
    "/eventos",
    "/blog",
    "/contacto",
    "/organizaciones",
    "/faq",
    "/politicas/compras",
    "/politicas/cambios-devoluciones",
    "/politicas/privacidad",
    "/politicas/terminos",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" || route === "/tienda" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : route === "/tienda" ? 0.9 : 0.6,
    })),
    ...products.map((product) => ({
      url: `${base}/producto/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...events.map((event) => ({
      url: `${base}/eventos#${event.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...articles.map((article) => ({
      url: `${base}/blog/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
