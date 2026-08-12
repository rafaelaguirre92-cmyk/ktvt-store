import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const eventSchema = z.object({
  title: z.string().trim().min(2).max(250),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  audience: z.string().trim().min(2).max(300),
  modality: z.string().trim().min(2).max(120),
  duration: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(5000),
  startsAt: z.string().optional(),
  priceCents: z.number().int().min(0).optional(),
  capacity: z.number().int().min(1).optional(),
  published: z.boolean().default(false),
});

const articleSchema = z.object({
  title: z.string().trim().min(2).max(250),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().trim().min(10).max(500),
  category: z.string().trim().min(2).max(120),
  content: z.array(z.string().trim().min(1)).min(1),
  readingMinutes: z.number().int().min(1).max(60),
  published: z.boolean().default(false),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  try {
    const { type } = await params;
    const { adminClient } = await requireAdmin();
    const body = await request.json().catch(() => null);
    if (type === "events") {
      const parsed = eventSchema.safeParse(body);
      if (!parsed.success) return NextResponse.json({ error: "Evento inválido." }, { status: 400 });
      const input = parsed.data;
      const { data, error } = await adminClient
        .from("events")
        .insert({
          title: input.title,
          slug: input.slug,
          audience: input.audience,
          modality: input.modality,
          duration: input.duration,
          description: input.description,
          starts_at: input.startsAt || null,
          price_cents: input.priceCents ?? null,
          capacity: input.capacity ?? null,
          is_published: input.published,
        })
        .select("id,title,slug,is_published")
        .single();
      if (error) throw error;
      return NextResponse.json({ item: data }, { status: 201 });
    }
    if (type === "articles") {
      const parsed = articleSchema.safeParse(body);
      if (!parsed.success) return NextResponse.json({ error: "Artículo inválido." }, { status: 400 });
      const input = parsed.data;
      const { data, error } = await adminClient
        .from("articles")
        .insert({
          title: input.title,
          slug: input.slug,
          excerpt: input.excerpt,
          category: input.category,
          content: input.content,
          reading_minutes: input.readingMinutes,
          published_at: input.published ? new Date().toISOString() : null,
          is_published: input.published,
        })
        .select("id,title,slug,is_published")
        .single();
      if (error) throw error;
      return NextResponse.json({ item: data }, { status: 201 });
    }
    return NextResponse.json({ error: "Tipo no soportado." }, { status: 404 });
  } catch (error) {
    console.error("Admin content POST:", error);
    return NextResponse.json({ error: "No se pudo guardar el contenido." }, { status: 503 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  try {
    const { type } = await params;
    if (!["events", "articles"].includes(type)) {
      return NextResponse.json({ error: "Tipo no soportado." }, { status: 404 });
    }
    const input = z
      .object({ id: z.uuid(), published: z.boolean() })
      .safeParse(await request.json().catch(() => null));
    if (!input.success) return NextResponse.json({ error: "Cambio inválido." }, { status: 400 });
    const { adminClient } = await requireAdmin();
    const { data, error } = await adminClient
      .from(type)
      .update({
        is_published: input.data.published,
        ...(type === "articles" && input.data.published
          ? { published_at: new Date().toISOString() }
          : {}),
      })
      .eq("id", input.data.id)
      .select("id,title,slug,is_published")
      .single();
    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch (error) {
    console.error("Admin content PATCH:", error);
    return NextResponse.json({ error: "No se pudo actualizar." }, { status: 503 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  try {
    const { type } = await params;
    const id = new URL(request.url).searchParams.get("id");
    if (!["events", "articles"].includes(type) || !id || !z.uuid().safeParse(id).success) {
      return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
    }
    const { adminClient } = await requireAdmin();
    const { error } = await adminClient.from(type).delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin content DELETE:", error);
    return NextResponse.json({ error: "No se pudo eliminar." }, { status: 503 });
  }
}
