import type { Metadata } from "next";
import { Suspense } from "react";
import Filters from "@/components/shop/Filters";
import ProductCard from "@/components/shop/ProductCard";
import { filterProducts, getAllColors, getAllSizes, getSettings } from "@/lib/queries";
import type { ProductFilters } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Parcourez toute la boutique Luxurious Palace : bijoux, parfums et vêtements personnalisables. Filtrez par catégorie, taille, couleur et prix."
};

export default function BoutiquePage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const settings = getSettings();
  const sizes = getAllSizes();
  const colors = getAllColors();

  const filters: ProductFilters = {
    category: searchParams.category as ProductFilters["category"],
    subCategory: searchParams.subCategory,
    gender: searchParams.gender as ProductFilters["gender"],
    size: searchParams.size,
    color: searchParams.color,
    search: searchParams.search,
    sort: searchParams.sort as ProductFilters["sort"],
    customizable: searchParams.customizable === "true"
  };

  const products = filterProducts(filters);

  return (
    <div className="container-lp py-12 sm:py-16">
      <div className="mb-8">
        <span className="section-eyebrow">Catalogue complet</span>
        <h1 className="mt-2 text-3xl font-bold text-ink-900 sm:text-4xl">La Boutique</h1>
        {filters.search && (
          <p className="mt-2 text-sm text-ink-500">
            Résultats pour « {filters.search} » — {products.length} produit(s)
          </p>
        )}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <Suspense fallback={null}>
          <Filters sizes={sizes} colors={colors} />
        </Suspense>

        <div className="flex-1">
          {products.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-ink-200 p-10 text-center text-ink-400">
              Aucun produit ne correspond à votre recherche.
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
