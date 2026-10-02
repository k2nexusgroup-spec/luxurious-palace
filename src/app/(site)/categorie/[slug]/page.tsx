import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductVisual from "@/components/ui/ProductVisual";
import { isImageUrl } from "@/lib/slug";
import ProductCard from "@/components/shop/ProductCard";
import CategoryFilters from "@/components/shop/CategoryFilters";
import { filterProducts, getCategory, getSettings } from "@/lib/queries";
import type { CategorySlug } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await getCategory(params.slug as CategorySlug);
  if (!category) return {};
  return {
    title: category.name,
    description: `${category.description} Livraison en Côte d'Ivoire, commande facile sur WhatsApp.`
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams: Record<string, string | undefined>;
}) {
  const category = await getCategory(params.slug as CategorySlug);
  if (!category) notFound();

  const settings = await getSettings();
  const products = await filterProducts({
    category: category.slug,
    subCategory: searchParams.subCategory,
    gender: searchParams.gender as "homme" | "femme" | undefined,
    sort: searchParams.sort as "prix-asc" | "prix-desc" | "nouveaute" | "popularite" | undefined
  });

  return (
    <div>
      <div className="relative h-56 overflow-hidden sm:h-72">
        {isImageUrl(category.image) ? (
          <Image src={category.image} alt={category.name} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <ProductVisual category={category.slug} label={category.name} className="h-full w-full" />
        )}
        <div className="absolute inset-0 flex items-center bg-black/40">
          <div className="container-lp">
            <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl">{category.name}</h1>
            <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="container-lp py-10 sm:py-14">
        <Suspense fallback={null}>
          <CategoryFilters subCategories={category.subCategories} />
        </Suspense>

        <div className="mt-8">
          {products.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-ink-200 p-10 text-center text-ink-400">
              Aucun produit disponible pour ces critères pour le moment.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} whatsappNumber={settings.whatsappNumber} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
