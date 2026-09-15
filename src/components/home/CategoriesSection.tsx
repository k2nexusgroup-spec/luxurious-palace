import Link from "next/link";
import type { CategoryInfo } from "@/lib/types";
import ProductVisual from "@/components/ui/ProductVisual";

export default function CategoriesSection({ categories }: { categories: CategoryInfo[] }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-lp">
        <div className="mx-auto max-w-xl text-center">
          <span className="section-eyebrow">Nos univers</span>
          <h2 className="mt-3 text-3xl font-bold text-ink-900 sm:text-4xl">Explorez nos catégories</h2>
          <p className="mt-3 text-ink-500">Trois univers pensés pour révéler votre style, homme comme femme.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/categorie/${cat.slug}`}
              className="group relative block overflow-hidden rounded-2xl reveal"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="relative aspect-[3/4] w-full">
                <ProductVisual category={cat.slug} className="h-full w-full transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-serif text-2xl font-bold text-white">{cat.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-white/80">{cat.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-300 transition-transform group-hover:translate-x-1">
                  Découvrir →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
