import { NextRequest, NextResponse } from "next/server";
import { readStore, updateStore } from "@/lib/db";
import type { PromoCode } from "@/lib/types";

export async function GET() {
  const store = readStore();
  return NextResponse.json(store.settings.promoCodes);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<PromoCode>;
  const newCode: PromoCode = {
    id: `promo${Date.now()}`,
    code: (body.code ?? "").toUpperCase(),
    discountPercent: Number(body.discountPercent ?? 0),
    active: body.active ?? true
  };
  updateStore((data) => {
    data.settings.promoCodes.push(newCode);
  });
  return NextResponse.json(newCode, { status: 201 });
}
