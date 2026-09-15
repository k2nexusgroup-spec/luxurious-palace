import type { Metadata } from "next";
import { getSettings } from "@/lib/queries";
import WhatsappIcon from "@/components/ui/WhatsappIcon";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Luxurious Palace par WhatsApp, téléphone ou email pour toute question sur nos produits ou vos commandes."
};

export default function ContactPage() {
  const settings = getSettings();

  return (
    <div className="container-lp py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="section-eyebrow">Contact</span>
        <h1 className="mt-2 text-3xl font-bold text-ink-900 sm:text-4xl">Une question ? Contactez-nous</h1>
        <p className="mt-3 text-ink-500">
          Notre équipe vous répond rapidement sur WhatsApp pour toute question sur nos produits, la personnalisation
          ou une commande en cours.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
        <a
          href={settings.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-3 rounded-2xl border border-ink-100 p-6 text-center transition-shadow hover:shadow-lg"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white">
            <WhatsappIcon className="h-6 w-6" />
          </span>
          <p className="font-semibold text-ink-900">WhatsApp</p>
          <p className="text-sm text-ink-500">{settings.whatsappNumber}</p>
        </a>

        <a
          href={`tel:${settings.phoneNumber}`}
          className="flex flex-col items-center gap-3 rounded-2xl border border-ink-100 p-6 text-center transition-shadow hover:shadow-lg"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 text-xl text-white">📞</span>
          <p className="font-semibold text-ink-900">Téléphone</p>
          <p className="text-sm text-ink-500">{settings.phoneNumber}</p>
        </a>

        <a
          href={`mailto:${settings.email}`}
          className="flex flex-col items-center gap-3 rounded-2xl border border-ink-100 p-6 text-center transition-shadow hover:shadow-lg"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-xl text-ink-900">✉️</span>
          <p className="font-semibold text-ink-900">Email</p>
          <p className="break-all text-sm text-ink-500">{settings.email}</p>
        </a>
      </div>

      <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-gold-50/50 p-6 text-center text-sm text-ink-500">
        {settings.address} — Livraison à Abidjan et dans les autres villes de Côte d'Ivoire.
      </div>
    </div>
  );
}
