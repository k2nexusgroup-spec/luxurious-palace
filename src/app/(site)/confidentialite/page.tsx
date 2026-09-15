import type { Metadata } from "next";
import { getSettings } from "@/lib/queries";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function ConfidentialitePage() {
  const settings = getSettings();

  return (
    <div className="container-lp max-w-3xl py-16">
      <h1 className="text-3xl font-bold text-ink-900">Politique de confidentialité</h1>
      <p className="mt-2 text-xs uppercase tracking-wide text-gold-600">
        Modèle indicatif — à faire valider par un professionnel avant mise en ligne définitive.
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-600">
        <section>
          <h2 className="font-serif text-lg font-semibold text-ink-900">Données collectées</h2>
          <p>
            Lorsque vous passez commande, nous collectons votre nom, votre numéro de téléphone et votre ville de
            livraison afin de traiter votre commande sur WhatsApp. Aucune donnée bancaire n'est collectée par le site.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg font-semibold text-ink-900">Utilisation des données</h2>
          <p>
            Ces informations sont utilisées uniquement pour le traitement de votre commande et la communication avec
            vous concernant celle-ci. Elles ne sont ni vendues ni partagées avec des tiers non liés à la livraison.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg font-semibold text-ink-900">Cookies et stockage local</h2>
          <p>
            Le site utilise le stockage local de votre navigateur pour mémoriser le contenu de votre panier et vos
            favoris entre deux visites.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg font-semibold text-ink-900">Vos droits</h2>
          <p>
            Vous pouvez à tout moment demander la suppression de vos données en nous contactant à {settings.email} ou
            via WhatsApp au {settings.whatsappNumber}.
          </p>
        </section>
      </div>
    </div>
  );
}
