import { NextRequest, NextResponse } from "next/server";
import { updateStore } from "@/lib/db";
import type { Order } from "@/lib/types";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = (await request.json()) as Partial<Order>;
  let updated: Order | null = null;

  updateStore((data) => {
    const index = data.orders.findIndex((o) => o.id === params.id);
    if (index === -1) return;
    data.orders[index] = { ...data.orders[index], ...body, id: params.id };
    updated = data.orders[index];
  });

  if (!updated) return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
  return NextResponse.json(updated);
}
