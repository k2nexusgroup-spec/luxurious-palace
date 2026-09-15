import { NextRequest, NextResponse } from "next/server";
import { updateStore } from "@/lib/db";
import type { Product } from "@/lib/types";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = (await request.json()) as Partial<Product>;
  let updated: Product | null = null;

  updateStore((data) => {
    const index = data.products.findIndex((p) => p.id === params.id);
    if (index === -1) return;
    data.products[index] = { ...data.products[index], ...body, id: params.id };
    updated = data.products[index];
  });

  if (!updated) return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  let found = false;
  updateStore((data) => {
    const before = data.products.length;
    data.products = data.products.filter((p) => p.id !== params.id);
    found = data.products.length !== before;
  });

  if (!found) return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
