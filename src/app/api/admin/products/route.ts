import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const productInput = z.object({
  sku: z.string().trim().min(2).max(80),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(2).max(250),
  priceCents: z.number().int().min(0),
  stock: z.number().int().min(0),
  age: z.string().trim().min(1).max(80),
  category: z.string().trim().min(1).max(120),
  shortDescription: z.string().trim().max(500).default(""),
  description: z.string().trim().max(5000).default(""),
  recommendation: z.string().trim().max(3000).default(""),
  recommended: z.boolean().default(false),
  published: z.boolean().default(false),
  images: z.array(z.url()).max(12).default([]),
});

const patchInput = z.object({
  id: z.uuid(),
  stock: z.number().int().min(0).optional(),
  price: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
  recommended: z.boolean().optional(),
});

function mapProduct(row: Record<string, unknown>) {
  const category = row.category as { name?: string } | { name?: string }[] | null;
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
    category: (Array.isArray(category) ? category[0]?.name : category?.name) || "Sin categoría",
    recommended: row.is_recommended,
    published: row.is_published,
    images: row.images || [],
  };
}

function authError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 503;
  return NextResponse.json({ error: "El panel administrativo no está disponible." }, { status });
}

export async function POST(request: Request) {
  try {
    const { adminClient } = await requireAdmin();
    const body = await request.json();
    const parsed = body.products
      ? z.object({ products: z.array(productInput).min(1).max(1000) }).safeParse(body)
      : productInput.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Hay datos de producto inválidos." }, { status: 400 });
    }
    const inputs = "products" in parsed.data ? parsed.data.products : [parsed.data];

    for (const input of inputs) {
      const categorySlug = input.category
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const { data: category, error: categoryError } = await adminClient
        .from("categories")
        .upsert({ slug: categorySlug, name: input.category }, { onConflict: "name" })
        .select("id")
        .single();
      if (categoryError || !category) throw categoryError || new Error("No se creó la categoría");

      const { error } = await adminClient.from("products").upsert(
        {
          category_id: category.id,
          sku: input.sku,
          slug: input.slug,
          title: input.title,
          price_cents: input.priceCents,
          stock: input.stock,
          age_range: input.age,
          short_description: input.shortDescription,
          description: input.description,
          recommendation: input.recommendation,
          is_recommended: input.recommended,
          is_published: input.published,
          images: input.images,
        },
        { onConflict: "sku" },
      );
      if (error) throw error;
    }

    const { data, error } = await adminClient
      .from("products")
      .select("*,category:categories(name)")
      .order("created_at", { ascending: false });
    if (error || !data) throw error || new Error("No se pudo recargar el catálogo");
    const products = data.map((row) => mapProduct(row));
    if ("products" in parsed.data) {
      return NextResponse.json({ products, imported: inputs.length }, { status: 201 });
    }
    const product = products.find((item) => item.sku === inputs[0].sku);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Admin products POST:", error);
    return authError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { adminClient } = await requireAdmin();
    const parsed = patchInput.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Cambio inválido." }, { status: 400 });
    const { id, stock, price, published, recommended } = parsed.data;
    const changes: Record<string, unknown> = {};
    if (stock !== undefined) changes.stock = stock;
    if (price !== undefined) changes.price_cents = price;
    if (published !== undefined) changes.is_published = published;
    if (recommended !== undefined) changes.is_recommended = recommended;
    const { data, error } = await adminClient
      .from("products")
      .update(changes)
      .eq("id", id)
      .select("*,category:categories(name)")
      .single();
    if (error || !data) throw error || new Error("Producto no encontrado");
    return NextResponse.json({ product: mapProduct(data) });
  } catch (error) {
    console.error("Admin products PATCH:", error);
    return authError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { adminClient } = await requireAdmin();
    const id = new URL(request.url).searchParams.get("id");
    if (!id || !z.uuid().safeParse(id).success) {
      return NextResponse.json({ error: "Producto inválido." }, { status: 400 });
    }
    const { error } = await adminClient.from("products").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin products DELETE:", error);
    return authError(error);
  }
}
