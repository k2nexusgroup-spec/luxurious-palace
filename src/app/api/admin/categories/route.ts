import { NextRequest, NextResponse } from "next/server";
import { readStore, updateStore } from "@/lib/db";
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

export async function GET() {
  const store = await readStore();
  return NextResponse.json(store.categories);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<CategoryInfo>;
  const name = String(body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "Le nom de la catégorie est obligatoire." }, { status: 400 });
  }

  let created: CategoryInfo | null = null;
  let conflict = false;

  await updateStore((data) => {
    const baseSlug = slugify(name) || `categorie-${Date.now()}`;
    if (data.categories.some((c) => c.slug === baseSlug)) {
      conflict = true;
      return;
    }
    created = {
      slug: baseSlug,
      name,
      description: String(body.description ?? "").trim(),
      image: String(body.image ?? "").trim(),
      subCategories: cleanSubCategories(body.subCategories)
    };
    data.categories.push(created);
  });

  if (conflict) {
    return NextResponse.json({ error: "Une catégorie portant ce nom existe déjà." }, { status: 409 });
  }
  return NextResponse.json(created, { status: 201 });
}
