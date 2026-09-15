import Link from "next/link";
import ProductVisual from "@/components/ui/ProductVisual";

export default function CustomizationSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-lp grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="reveal grid grid-cols-2 gap-4">
          <ProductVisual category="vetements" variant={1} className="aspect-square rounded-2xl" />
          <ProductVisual category="vetements" variant={2} className="mt-8 aspect-square rounded-2xl" />
        </div>
        <div className="reveal" style={{ animationDelay: "0.15s" }}>
          <span className="section-eyebrow">Personnalisation</span>
          <h2 className="mt-3 text-3xl font-bold text-ink-900 sm:text-4xl">
            Créez un vêtement qui vous ressemble.
          </h2>
          <p className="mt-4 leading-relaxed text-ink-500">
            Débardeurs, T-shirts, polos et boxers 100% coton : ajoutez votre texte, vos initiales, un logo ou un
            visuel pour un article unique. Idéal pour un cadeau, un évènement ou simplement affirmer votre style.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-ink-600">
            {[
              "Texte, initiales, logo ou visuel au choix",
              "Emplacement libre : devant, dos ou manche",
              "Rendu confirmé avec vous avant impression",
              "Livraison partout en Côte d'Ivoire"
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                {item}
              </li>
            ))}
          </ul>
          <Link href="/personnalisation" className="btn-primary mt-8">
            Personnaliser mon article
          </Link>
        </div>
      </div>
    </section>
  );
}
