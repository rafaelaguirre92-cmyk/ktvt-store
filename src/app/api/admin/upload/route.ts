import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

const allowed = new Set(["image/png", "image/jpeg", "image/webp", "image/avif"]);
const extensions: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function POST(request: Request) {
  try {
    const { adminClient } = await requireAdmin();
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !allowed.has(file.type) || file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Usa una imagen JPG, PNG, WebP o AVIF de máximo 10 MB." },
        { status: 400 },
      );
    }
    const path = `products/${crypto.randomUUID()}.${extensions[file.type]}`;
    const { error } = await adminClient.storage
      .from("catalog")
      .upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false });
    if (error) throw error;
    const { data } = adminClient.storage.from("catalog").getPublicUrl(path);
    return NextResponse.json({ path, url: data.publicUrl }, { status: 201 });
  } catch (error) {
    console.error("Admin upload:", error);
    return NextResponse.json({ error: "No se pudo cargar la imagen." }, { status: 503 });
  }
}
