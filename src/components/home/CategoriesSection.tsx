import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import type { CategoryInfo } from "@/lib/types";
import ProductVisual from "@/components/ui/ProductVisual";
import { isImageUrl } from "@/lib/slug";

export default function CategoriesSection({ categories }: { categories: CategoryInfo[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <div className="container-lp">
        <div className="mx-auto max-w-xl text-center">
          <span className="section-eyebrow">Nos univers</span>
          <h2 className="mt-3 text-3xl font-bold text-ink-900 sm:text-4xl">Explorez nos catégories</h2>
          <p className="mt-3 text-ink-500">Des univers pensés pour révéler votre style, homme comme femme.</p>
        </div>

        <div
          className={clsx(
            "mt-12 grid grid-cols-1 gap-6",
            categories.length === 1 ? "sm:grid-cols-1" : "sm:grid-cols-2",
            categories.length >= 3 && "lg:grid-cols-3",
            categories.length === 4 && "xl:grid-cols-4"
          )}
        >
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/categorie/${cat.slug}`}
              className="group reveal relative block overflow-hidden rounded-2xl"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="relative aspect-[3/4] w-full">
                {isImageUrl(cat.image) ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <ProductVisual
                    category={cat.slug}
                    label={cat.name}
                    className="h-full w-full transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-serif text-2xl font-bold text-white">{cat.name}</h3>
                {cat.description && <p className="mt-1 line-clamp-2 text-sm text-white/80">{cat.description}</p>}
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
