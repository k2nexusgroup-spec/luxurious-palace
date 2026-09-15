import { NextRequest, NextResponse } from "next/server";
import { updateStore } from "@/lib/db";
import type { PromoCode } from "@/lib/types";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = (await request.json()) as Partial<PromoCode>;
  let updated: PromoCode | null = null;
  updateStore((data) => {
    const index = data.settings.promoCodes.findIndex((p) => p.id === params.id);
    if (index === -1) return;
    data.settings.promoCodes[index] = { ...data.settings.promoCodes[index], ...body, id: params.id };
    updated = data.settings.promoCodes[index];
  });
  if (!updated) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  let found = false;
  updateStore((data) => {
    const before = data.settings.promoCodes.length;
    data.settings.promoCodes = data.settings.promoCodes.filter((p) => p.id !== params.id);
    found = data.settings.promoCodes.length !== before;
  });
  if (!found) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
