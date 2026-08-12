import { articles as demoArticles, events as demoEvents, products as demoProducts } from "@/lib/catalog";
import type { Article, Event, Product } from "@/lib/catalog";
import { createServerSupabaseClient } from "@/lib/supabase";

type ProductRow = {
  id: string;
  slug: string;
  sku: string;
  title: string;
  short_description: string;
  description: string;
  recommendation: string;
  price_cents: number;
  compare_at_price_cents: number | null;
  stock: number;
  age_range: string;
  category: { name: string } | { name: string }[] | null;
  is_recommended: boolean;
  is_published: boolean;
  images: string[] | null;
};

function mapProduct(row: ProductRow): Product {
  const category = Array.isArray(row.category) ? row.category[0]?.name : row.category?.name;
  return {
    id: row.id,
    slug: row.slug,
    sku: row.sku,
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    recommendation: row.recommendation,
    price: row.price_cents,
    compareAtPrice: row.compare_at_price_cents || undefined,
    stock: row.stock,
    age: row.age_range,
    category: category || "Sin categoría",
    recommended: row.is_recommended,
    isNew: false,
    published: row.is_published,
    images: row.images || [],
    rating: 4.5,
    reviewCount: 0,
  };
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return demoProducts;
  const { data, error } = await supabase
    .from("products")
    .select(
      "id,slug,sku,title,short_description,description,recommendation,price_cents,compare_at_price_cents,stock,age_range,is_recommended,is_published,images,category:categories(name)",
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("No se pudo cargar el catálogo:", error?.message);
    return demoProducts;
  }
  return (data as unknown as ProductRow[]).map(mapProduct);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

export async function getEvents(): Promise<Event[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return demoEvents;
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("starts_at", { ascending: true, nullsFirst: false });
  if (error || !data) return demoEvents;
  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: row.event_type,
    audience: row.audience,
    modality: row.modality,
    duration: row.duration,
    price: row.price_cents || undefined,
    capacity: row.capacity || undefined,
    date: row.starts_at || undefined,
    description: row.description,
  }));
}

export async function getArticles(): Promise<Article[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return demoArticles;
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error || !data) return demoArticles;
  return data.map((row) => ({
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    publishedAt: row.published_at,
    readingMinutes: row.reading_minutes,
    content: row.content,
  }));
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find((article) => article.slug === slug);
}
