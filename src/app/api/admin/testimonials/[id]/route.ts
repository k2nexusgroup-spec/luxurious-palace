import { NextRequest, NextResponse } from "next/server";
import { updateStore } from "@/lib/db";

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  let found = false;
  updateStore((data) => {
    const before = data.testimonials.length;
    data.testimonials = data.testimonials.filter((t) => t.id !== params.id);
    found = data.testimonials.length !== before;
  });
  if (!found) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
