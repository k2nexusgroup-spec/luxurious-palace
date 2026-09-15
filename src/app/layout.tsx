import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Luxurious Palace — Bijoux, Parfums & Vêtements personnalisés en Côte d'Ivoire",
    template: "%s | Luxurious Palace"
  },
  description:
    "Luxurious Palace, boutique en ligne en Côte d'Ivoire spécialisée dans les bijoux, parfums et vêtements 100% coton personnalisables. Commandez facilement sur WhatsApp, livraison à Abidjan et partout en Côte d'Ivoire.",
  keywords: [
    "bijoux Côte d'Ivoire",
    "parfums Abidjan",
    "vêtements personnalisés Côte d'Ivoire",
    "t-shirt personnalisé Abidjan",
    "boutique en ligne Côte d'Ivoire"
  ],
  openGraph: {
    type: "website",
    locale: "fr_CI",
    siteName: "Luxurious Palace",
    title: "Luxurious Palace — Bijoux, Parfums & Vêtements personnalisés",
    description:
      "Bijoux, parfums et vêtements 100% coton personnalisables. Commande facile sur WhatsApp, livraison en Côte d'Ivoire.",
    url: siteUrl
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxurious Palace",
    description: "Bijoux, parfums et vêtements personnalisés en Côte d'Ivoire."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
