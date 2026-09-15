import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";
import { getSettings } from "@/lib/queries";

export const metadata: Metadata = { title: "Mon panier" };

export default function CartPage() {
  const settings = getSettings();

  return (
    <div className="container-lp py-12 sm:py-16">
      <span className="section-eyebrow">Votre sélection</span>
      <h1 className="mt-2 text-3xl font-bold text-ink-900 sm:text-4xl">Panier</h1>
      <div className="mt-10">
        <CartView whatsappNumber={settings.whatsappNumber} deliveryZones={settings.deliveryZones} />
      </div>
    </div>
  );
}
