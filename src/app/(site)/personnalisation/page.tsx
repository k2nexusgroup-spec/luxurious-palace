import type { Metadata } from "next";
import ProductCard from "@/components/shop/ProductCard";
import PersonalizationForm from "@/components/product/PersonalizationForm";
import { filterProducts, getSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Personnalisation",
  description:
    "Personnalisez vos débardeurs, T-shirts, polos et boxers 100% coton chez Luxurious Palace : texte, initiales, logo ou visuel au choix."
};

export default function PersonalizationPage() {
  const settings = getSettings();
  const customizableProducts = filterProducts({ customizable: true });

  return (
    <div>
      <section className="bg-ink-900 py-20 text-center text-white">
        <div className="container-lp">
          <span className="section-eyebrow text-gold-400">Sur-mesure</span>
          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">Créez un vêtement qui vous ressemble.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-ink-200">
            Débardeurs, T-shirts, polos et boxers 100% coton personnalisables avec votre texte, vos initiales, un
            logo ou un visuel. Décrivez votre idée, nous nous occupons du reste.
          </p>
        </div>
      </section>

      <section className="container-lp py-16">
        <h2 className="mb-8 font-serif text-2xl font-bold text-ink-900">Articles personnalisables</h2>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {customizableProducts.map((p) => (
            <ProductCard key={p.id} product={p} whatsappNumber={settings.whatsappNumber} />
          ))}
        </div>
      </section>

      <section className="bg-gold-50/50 py-16">
        <div className="container-lp grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink-900">Comment ça marche ?</h2>
            <ol className="mt-6 space-y-5 text-sm text-ink-600">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white">1</span>
                Choisissez votre article (débardeur, T-shirt, polo ou boxer) et sa couleur.
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white">2</span>
                Décrivez votre personnalisation : texte, initiales, logo ou visuel et son emplacement.
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white">3</span>
                Envoyez votre demande sur WhatsApp, nous confirmons le rendu avant impression.
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white">4</span>
                Votre article personnalisé est préparé puis livré.
              </li>
            </ol>
          </div>

          <PersonalizationForm whatsappNumber={settings.whatsappNumber} />
        </div>
      </section>
    </div>
  );
}
