import { NextRequest, NextResponse } from "next/server";
import { updateStore } from "@/lib/db";
import { slugify } from "@/lib/slug";
import type { CategoryInfo, SubCategoryInfo } from "@/lib/types";

function cleanSubCategories(input: unknown): SubCategoryInfo[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const result: SubCategoryInfo[] = [];
  for (const item of input) {
    const name = String((item as SubCategoryInfo)?.name ?? "").trim();
    if (!name) continue;
    const slug = (item as SubCategoryInfo).slug?.trim() || slugify(name);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    result.push({ slug, name });
  }
  return result;
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  const body = (await request.json()) as Partial<CategoryInfo>;
  let updated: CategoryInfo | null = null;

  await updateStore((data) => {
    const index = data.categories.findIndex((c) => c.slug === params.slug);
    if (index === -1) return;
    const current = data.categories[index];
    data.categories[index] = {
      slug: current.slug,
      name: body.name !== undefined ? String(body.name).trim() || current.name : current.name,
      description: body.description !== undefined ? String(body.description).trim() : current.description,
      image: body.image !== undefined ? String(body.image).trim() : current.image,
      subCategories:
        body.subCategories !== undefined ? cleanSubCategories(body.subCategories) : current.subCategories ?? []
    };
    updated = data.categories[index];
  });

  if (!updated) return NextResponse.json({ error: "Catégorie introuvable." }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: { params: { slug: string } }) {
  let found = false;
  let productsCount = 0;

  await updateStore((data) => {
    productsCount = data.products.filter((p) => p.category === params.slug).length;
    if (productsCount > 0) return;
    const before = data.categories.length;
    data.categories = data.categories.filter((c) => c.slug !== params.slug);
    found = data.categories.length !== before;
  });

  if (productsCount > 0) {
    return NextResponse.json(
      { error: `Impossible de supprimer : ${productsCount} produit(s) utilisent cette catégorie. Déplace-les ou supprime-les d'abord.` },
      { status: 409 }
    );
  }
  if (!found) return NextResponse.json({ error: "Catégorie introuvable." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
