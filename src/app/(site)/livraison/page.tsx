import type { Metadata } from "next";
import { getSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Livraison & retours",
  description: "Informations sur la livraison des commandes Luxurious Palace à Abidjan et dans les autres villes de Côte d'Ivoire."
};

export default function LivraisonPage() {
  const settings = getSettings();

  return (
    <div className="container-lp py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="section-eyebrow">Livraison</span>
        <h1 className="mt-2 text-3xl font-bold text-ink-900 sm:text-4xl">Livraison & retours</h1>
      </div>

      <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-ink-100">
        <table className="w-full text-sm">
          <thead className="bg-ink-900 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Zone</th>
              <th className="px-4 py-3 text-left font-medium">Frais</th>
              <th className="px-4 py-3 text-left font-medium">Délai estimé</th>
            </tr>
          </thead>
          <tbody>
            {settings.deliveryZones.map((zone) => (
              <tr key={zone.id} className="border-t border-ink-100">
                <td className="px-4 py-3 font-medium text-ink-800">{zone.name}</td>
                <td className="px-4 py-3 text-ink-500">
                  {zone.fee !== null ? `${zone.fee.toLocaleString("fr-FR")} FCFA` : "À confirmer avec vous"}
                </td>
                <td className="px-4 py-3 text-ink-500">{zone.delay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-ink-400">
        Les frais et délais définitifs vous sont confirmés lors de la finalisation de votre commande sur WhatsApp.
        Ces informations sont configurables depuis l'espace administrateur de la boutique.
      </p>

      <div className="mx-auto mt-12 max-w-2xl space-y-4 text-sm leading-relaxed text-ink-600">
        <h2 className="font-serif text-xl font-semibold text-ink-900">Retours & échanges</h2>
        <p>
          Pour toute question relative à un retour ou un échange, contactez-nous directement sur WhatsApp au{" "}
          {settings.whatsappNumber} en précisant votre numéro de commande. Les articles personnalisés ne peuvent pas
          faire l'objet d'un échange sauf en cas de défaut de fabrication.
        </p>
      </div>
    </div>
  );
}
