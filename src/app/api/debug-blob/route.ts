import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET() {
  const { blobs } = await list({ prefix: "data/store.json", limit: 10 });
  const match = blobs.find((b) => b.pathname === "data/store.json");

  if (!match) return NextResponse.json({ error: "not found" });

  const bustedUrl = `${match.url}?v=${new Date(match.uploadedAt).getTime()}`;
  const res = await fetch(bustedUrl, { cache: "no-store" });
  const data = await res.json();

  return NextResponse.json({
    now: new Date().toISOString(),
    uploadedAt: match.uploadedAt,
    size: match.size,
    bustedUrl,
    fetchStatus: res.status,
    fetchCacheHeader: res.headers.get("x-vercel-cache"),
    fetchAge: res.headers.get("age"),
    p003ShortDescription: data.products.find((p: { id: string }) => p.id === "p003")?.shortDescription
  });
}
