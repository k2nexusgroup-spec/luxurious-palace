import { NextRequest, NextResponse } from "next/server";
import { updateStore } from "@/lib/db";
import type { Banner } from "@/lib/types";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = (await request.json()) as Partial<Banner>;
  let updated: Banner | null = null;
  updateStore((data) => {
    const index = data.banners.findIndex((b) => b.id === params.id);
    if (index === -1) return;
    data.banners[index] = { ...data.banners[index], ...body, id: params.id };
    updated = data.banners[index];
  });
  if (!updated) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  let found = false;
  updateStore((data) => {
    const before = data.banners.length;
    data.banners = data.banners.filter((b) => b.id !== params.id);
    found = data.banners.length !== before;
  });
  if (!found) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
