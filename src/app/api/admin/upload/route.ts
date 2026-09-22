import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const MAX_SIZE = 8 * 1024 * 1024; // 8 Mo
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Format d'image non supporté." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image trop volumineuse (8 Mo max)." }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `produits/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: false
  });

  return NextResponse.json({ url: blob.url });
}
