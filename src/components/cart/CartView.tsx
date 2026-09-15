"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartStore, useCartSubtotal } from "@/lib/cart-store";
import { formatFcfa, buildCartMessage, buildWhatsappUrl } from "@/lib/whatsapp";
import type { DeliveryZone } from "@/lib/types";
import WhatsappIcon from "@/components/ui/WhatsappIcon";
import ProductVisual from "@/components/ui/ProductVisual";

export default function CartView({
  whatsappNumber,
  deliveryZones
}: {
  whatsappNumber: string;
  deliveryZones: DeliveryZone[];
}) {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const subtotal = useCartSubtotal();

  const [zoneId, setZoneId] = useState(deliveryZones[0]?.id ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const zone = deliveryZones.find((z) => z.id === zoneId);
  const deliveryFee = zone?.fee ?? null;
  const total = subtotal + (deliveryFee ?? 0);

  async function handleCheckout() {
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name || undefined,
          customerPhone: phone || undefined,
          city: zone?.name,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
            customization: i.customization
          }))
        })
      });
    } catch {
      // L'envoi WhatsApp reste possible même si l'enregistrement local échoue.
    }

    const message = buildCartMessage(items, subtotal);
    window.open(buildWhatsappUrl(whatsappNumber, message), "_blank");
    clear();
    setSubmitting(false);
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 p-16 text-center">
        <p className="text-ink-500">Votre panier est vide pour le moment.</p>
        <Link href="/boutique" className="btn-primary mt-6 inline-flex">
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {items.map((item) => (
          <div key={item.key} className="flex gap-4 rounded-2xl border border-ink-100 p-4">
            <ProductVisual category={item.category} className="h-24 w-24 shrink-0 rounded-xl" />
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link href={`/produit/${item.slug}`} className="font-serif font-semibold text-ink-900 hover:text-gold-700">
                    {item.name}
                  </Link>
                  <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-ink-400">
                    {item.size && <span>Taille : {item.size}</span>}
                    {item.color && <span>Couleur : {item.color}</span>}
                  </div>
                  {item.customization && (
                    <p className="mt-1 text-xs text-ink-500">Personnalisation : {item.customization}</p>
                  )}
                </div>
                <button onClick={() => removeItem(item.key)} className="text-xs text-red-500 hover:underline">
                  Supprimer
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="inline-flex items-center rounded-lg border border-ink-200">
                  <button
                    onClick={() => updateQuantity(item.key, item.quantity - 1)}
                    className="px-3 py-1 text-base"
                    aria-label="Diminuer"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.key, item.quantity + 1)}
                    className="px-3 py-1 text-base"
                    aria-label="Augmenter"
                  >
                    +
                  </button>
                </div>
                <span className="font-semibold text-ink-900">{formatFcfa(item.price * item.quantity)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-fit space-y-5 rounded-2xl border border-ink-100 p-6">
        <h2 className="font-serif text-lg font-semibold text-ink-900">Récapitulatif</h2>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-500">Nom et prénoms</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre nom"
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-gold-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-500">Numéro de téléphone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07 00 00 00 00"
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-gold-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-500">Ville de livraison</label>
          <select
            value={zoneId}
            onChange={(e) => setZoneId(e.target.value)}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
          >
            {deliveryZones.map((z) => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2 border-t border-ink-100 pt-4 text-sm">
          <div className="flex justify-between text-ink-500">
            <span>Sous-total</span>
            <span>{formatFcfa(subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink-500">
            <span>Frais de livraison ({zone?.name})</span>
            <span>{deliveryFee !== null ? formatFcfa(deliveryFee) : "À confirmer"}</span>
          </div>
          <div className="flex justify-between border-t border-ink-100 pt-2 text-base font-bold text-ink-900">
            <span>Total</span>
            <span>{deliveryFee !== null ? formatFcfa(total) : `${formatFcfa(subtotal)} + livraison`}</span>
          </div>
        </div>

        <button onClick={handleCheckout} disabled={submitting} className="btn-whatsapp w-full">
          <WhatsappIcon className="h-4 w-4" />
          {submitting ? "Envoi en cours…" : "Commander sur WhatsApp"}
        </button>
        <p className="text-center text-[11px] text-ink-400">
          Vous serez redirigé vers WhatsApp pour finaliser votre commande avec notre équipe.
        </p>
      </div>
    </div>
  );
}
