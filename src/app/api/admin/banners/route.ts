import { NextRequest, NextResponse } from "next/server";
import { readStore, updateStore } from "@/lib/db";
import type { Banner } from "@/lib/types";

export async function GET() {
  const store = readStore();
  return NextResponse.json(store.banners);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<Banner>;
  const newBanner: Banner = {
    id: `b${Date.now()}`,
    title: body.title ?? "",
    subtitle: body.subtitle ?? "",
    ctaLabel: body.ctaLabel ?? "Découvrir la boutique",
    ctaHref: body.ctaHref ?? "/boutique",
    image: body.image ?? "gradient-hero",
    active: body.active ?? true
  };
  updateStore((data) => {
    data.banners.push(newBanner);
  });
  return NextResponse.json(newBanner, { status: 201 });
}
