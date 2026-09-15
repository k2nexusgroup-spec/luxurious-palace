import type { Metadata } from "next";
import { getSettings } from "@/lib/queries";

export const metadata: Metadata = { title: "Conditions générales de vente" };

export default function MentionsLegalesPage() {
  const settings = getSettings();

  return (
    <div className="container-lp max-w-3xl py-16">
      <h1 className="text-3xl font-bold text-ink-900">Conditions générales de vente</h1>
      <p className="mt-2 text-xs uppercase tracking-wide text-gold-600">
        Modèle indicatif — à faire valider par un professionnel avant mise en ligne définitive.
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-600">
        <section>
          <h2 className="font-serif text-lg font-semibold text-ink-900">1. Identification du vendeur</h2>
          <p>
            {settings.shopName}, boutique en ligne basée en Côte d'Ivoire ({settings.address}). Contact :{" "}
            {settings.email} — {settings.phoneNumber}.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg font-semibold text-ink-900">2. Produits</h2>
          <p>
            Les produits présentés (bijoux, parfums, vêtements) sont décrits avec la plus grande exactitude possible.
            Les photos utilisées à ce stade sont des visuels de démonstration en attendant l'intégration des photos
            réelles des produits.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg font-semibold text-ink-900">3. Commande</h2>
          <p>
            Toute commande passée via le site est finalisée par échange sur WhatsApp avec notre équipe, qui confirme
            la disponibilité, le prix final et les modalités de livraison avant validation définitive.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg font-semibold text-ink-900">4. Paiement</h2>
          <p>
            Les modalités de paiement (paiement à la livraison, Orange Money, MTN Money, Moov Money, Wave) vous sont
            communiquées lors de la confirmation de commande. Certains moyens de paiement en ligne peuvent ne pas
            encore être activés.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg font-semibold text-ink-900">5. Livraison</h2>
          <p>Voir notre page dédiée « Livraison & retours » pour le détail des zones, frais et délais.</p>
        </section>
        <section>
          <h2 className="font-serif text-lg font-semibold text-ink-900">6. Personnalisation</h2>
          <p>
            Les articles personnalisés sont fabriqués selon les indications fournies par le client. Le rendu est
            confirmé avant impression. Ces articles ne peuvent être ni repris ni échangés, sauf défaut de fabrication.
          </p>
        </section>
      </div>
    </div>
  );
}
