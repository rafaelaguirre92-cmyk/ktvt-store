import type { Metadata } from "next";
import Link from "next/link";
import { AdminDashboard } from "@/components/admin-dashboard";
import { products as demoProducts } from "@/lib/catalog";
import type { Product } from "@/lib/catalog";
import { createAdminSupabaseClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createAdminSupabaseClient();
  let products: Product[] = demoProducts;
  let orders: Parameters<typeof AdminDashboard>[0]["orders"] = [];
  let leads: Parameters<typeof AdminDashboard>[0]["leads"] = [];
  let shipping: Parameters<typeof AdminDashboard>[0]["shipping"] = [
    {
      id: "demo-pending",
      code: "pending-logistics",
      name: "Entrega por confirmar",
      price_cents: 0,
      is_active: true,
    },
  ];
  let events: Parameters<typeof AdminDashboard>[0]["events"] = [];
  let articles: Parameters<typeof AdminDashboard>[0]["articles"] = [];

  if (supabase) {
    const [productResult, orderResult, leadResult, shippingResult, eventResult, articleResult] =
      await Promise.all([
        supabase
          .from("products")
          .select("*,category:categories(name)")
          .order("created_at", { ascending: false }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(200),
        supabase.from("shipping_methods").select("*").order("sort_order"),
        supabase.from("events").select("id,title,slug,is_published").order("created_at", { ascending: false }),
        supabase.from("articles").select("id,title,slug,is_published").order("created_at", { ascending: false }),
      ]);
    if (productResult.data) {
      products = productResult.data.map((row) => ({
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
        category:
          (Array.isArray(row.category) ? row.category[0]?.name : row.category?.name) ||
          "Sin categoría",
        recommended: row.is_recommended,
        isNew: false,
        published: row.is_published,
        images: row.images || [],
        rating: 4.5,
        reviewCount: 0,
      }));
    }
    orders = orderResult.data || [];
    leads = leadResult.data || [];
    shipping = shippingResult.data || [];
    events = eventResult.data || [];
    articles = articleResult.data || [];
  }

  return (
    <section className="section">
      <div className="container stack">
        <div className="cluster spread">
          <div>
            <p className="eyebrow">Operación KTVT</p>
            <h1>Panel administrativo</h1>
          </div>
          <Link className="button secondary" href="/">
            Ver sitio
          </Link>
        </div>
        <AdminDashboard
          initialProducts={products}
          orders={orders}
          leads={leads}
          shipping={shipping}
          events={events}
          articles={articles}
          demo={!supabase}
        />
      </div>
    </section>
  );
}
