import { NextRequest, NextResponse } from "next/server";
import { readStore, updateStore } from "@/lib/db";
import type { Product } from "@/lib/types";

export async function GET() {
  const store = readStore();
  return NextResponse.json(store.products);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<Product>;

  if (!body.name || !body.category || !body.subCategory || body.price === undefined) {
    return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
  }

  const id = `p${Date.now()}`;
  const slug = String(body.name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const newProduct: Product = {
    id,
    slug: `${slug}-${id.slice(-4)}`,
    name: body.name,
    category: body.category,
    subCategory: body.subCategory,
    gender: body.gender ?? "mixte",
    price: Number(body.price),
    oldPrice: body.oldPrice ? Number(body.oldPrice) : undefined,
    images: body.images ?? [],
    description: body.description ?? "",
    shortDescription: body.shortDescription ?? "",
    sizes: body.sizes ?? [],
    colors: body.colors ?? [],
    customizable: Boolean(body.customizable),
    customizationNote: body.customizationNote,
    stock: Number(body.stock ?? 0),
    badges: body.badges ?? [],
    rating: 0,
    reviewsCount: 0,
    popularity: 0,
    createdAt: new Date().toISOString().slice(0, 10)
  };

  const store = updateStore((data) => {
    data.products.unshift(newProduct);
  });

  return NextResponse.json(newProduct, { status: 201 });
}
