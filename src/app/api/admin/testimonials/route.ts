import { NextRequest, NextResponse } from "next/server";
import { readStore, updateStore } from "@/lib/db";
import type { Testimonial } from "@/lib/types";

export async function GET() {
  const store = readStore();
  return NextResponse.json(store.testimonials);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<Testimonial>;
  const newTestimonial: Testimonial = {
    id: `t${Date.now()}`,
    name: body.name ?? "Client",
    rating: body.rating ?? 5,
    text: body.text ?? "",
    city: body.city ?? "",
    demo: true
  };
  updateStore((data) => {
    data.testimonials.unshift(newTestimonial);
  });
  return NextResponse.json(newTestimonial, { status: 201 });
}
