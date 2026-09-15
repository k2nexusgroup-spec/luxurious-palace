import type { CategorySlug } from "@/lib/types";
import ProductVisual from "@/components/ui/ProductVisual";

const DEMO_TILES: { category: CategorySlug; variant: number }[] = [
  { category: "bijoux", variant: 0 },
  { category: "vetements", variant: 1 },
  { category: "parfums", variant: 2 },
  { category: "vetements", variant: 0 },
  { category: "bijoux", variant: 2 },
  { category: "parfums", variant: 1 }
];

export default function InstagramSection({ instagramUrl }: { instagramUrl: string }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-lp text-center">
        <span className="section-eyebrow">Suivez-nous</span>
        <h2 className="mt-3 text-3xl font-bold text-ink-900 sm:text-4xl">@luxuriouspalace</h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-500">
          Retrouvez nos dernières publications et inspirations sur Instagram — visuels de démonstration en attendant
          la connexion de votre flux réel.
        </p>
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-gold-600 hover:underline">
          Voir le profil Instagram →
        </a>
      </div>

      <div className="container-lp mt-10 grid grid-cols-3 gap-2 sm:gap-4 md:grid-cols-6">
        {DEMO_TILES.map((tile, i) => (
          <a
            key={i}
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group reveal block aspect-square overflow-hidden rounded-xl"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <ProductVisual
              category={tile.category}
              variant={tile.variant}
              className="h-full w-full transition-transform duration-500 group-hover:scale-110"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
