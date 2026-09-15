import { NextRequest, NextResponse } from "next/server";
import { updateStore } from "@/lib/db";
import type { Order, OrderItem } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    customerName?: string;
    customerPhone?: string;
    city?: string;
    items: OrderItem[];
  };

  if (!body.items || body.items.length === 0) {
    return NextResponse.json({ error: "Le panier est vide." }, { status: 400 });
  }

  const subtotal = body.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const newOrder: Order = {
    id: `cmd${Date.now()}`,
    createdAt: new Date().toISOString(),
    customerName: body.customerName ?? "Client WhatsApp",
    customerPhone: body.customerPhone ?? "",
    city: body.city ?? "",
    items: body.items,
    subtotal,
    deliveryFee: null,
    total: subtotal,
    status: "nouvelle",
    channel: "whatsapp"
  };

  updateStore((data) => {
    data.orders.unshift(newOrder);
  });

  return NextResponse.json(newOrder, { status: 201 });
}
