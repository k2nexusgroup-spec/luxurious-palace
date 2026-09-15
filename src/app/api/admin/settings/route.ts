import { NextRequest, NextResponse } from "next/server";
import { readStore, updateStore } from "@/lib/db";
import type { StoreSettings } from "@/lib/types";

export async function GET() {
  const store = readStore();
  return NextResponse.json(store.settings);
}

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as Partial<StoreSettings>;
  const store = updateStore((data) => {
    data.settings = { ...data.settings, ...body };
  });
  return NextResponse.json(store.settings);
}
