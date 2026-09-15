"use client";

import { useState } from "react";
import clsx from "clsx";
import type { Product } from "@/lib/types";
import { formatFcfa, buildSingleProductMessage, buildWhatsappUrl } from "@/lib/whatsapp";
import { useCartStore } from "@/lib/cart-store";
import WhatsappIcon from "@/components/ui/WhatsappIcon";

export default function ProductOptions({ product, whatsappNumber }: { product: Product; whatsappNumber: string }) {
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState("");
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const addItem = useCartStore((s) => s.addItem);

  const inStock = product.stock > 0;

  function validateCustomization(): boolean {
    if (product.customizable && customization.trim().length === 0) {
      setError("Merci d'indiquer les détails de votre personnalisation.");
      return false;
    }
    setError("");
    return true;
  }

  function handleAddToCart() {
    if (!validateCustomization()) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      category: product.category,
      quantity,
      size: size || undefined,
      color: color || undefined,
      customization: customization || undefined
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleWhatsappOrder() {
    if (!validateCustomization()) return;
    const message = buildSingleProductMessage({
      name: product.name,
      quantity,
      size: size || undefined,
      color: color || undefined,
      customization: customization || undefined,
      price: product.price
    });
    window.open(buildWhatsappUrl(whatsappNumber, message), "_blank");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-ink-900">{formatFcfa(product.price)}</span>
        {product.oldPrice && <span className="text-lg text-ink-300 line-through">{formatFcfa(product.oldPrice)}</span>}
      </div>

      <p className={clsx("text-sm font-medium", inStock ? "text-green-600" : "text-red-500")}>
        {inStock ? `En stock (${product.stock} disponibles)` : "Rupture de stock"}
      </p>

      {product.sizes.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">Taille</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={clsx(
                  "rounded-lg border px-4 py-2 text-sm font-medium",
                  size === s ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200 text-ink-600"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colors.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">Couleur</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={clsx(
                  "rounded-full border px-4 py-2 text-sm font-medium",
                  color === c ? "border-gold-500 bg-gold-50 text-ink-900" : "border-ink-200 text-ink-600"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">Quantité</p>
        <div className="inline-flex items-center rounded-lg border border-ink-200">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-4 py-2 text-lg" aria-label="Diminuer">
            −
          </button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)} className="px-4 py-2 text-lg" aria-label="Augmenter">
            +
          </button>
        </div>
      </div>

      {product.customizable && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
            Détails de personnalisation <span className="text-red-500">*</span>
          </p>
          {product.customizationNote && <p className="mb-2 text-xs text-ink-400">{product.customizationNote}</p>}
          <textarea
            value={customization}
            onChange={(e) => setCustomization(e.target.value)}
            rows={3}
            placeholder="Ex : Texte « Grace », en lettres dorées, sur le devant"
            className="w-full rounded-lg border border-ink-200 p-3 text-sm outline-none focus:border-gold-500"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={handleAddToCart} disabled={!inStock} className="btn-outline flex-1 disabled:cursor-not-allowed disabled:opacity-40">
          {added ? "Ajouté au panier ✓" : "Ajouter au panier"}
        </button>
        <button onClick={handleWhatsappOrder} disabled={!inStock} className="btn-whatsapp flex-1 disabled:cursor-not-allowed disabled:opacity-40">
          <WhatsappIcon className="h-4 w-4" />
          Commander sur WhatsApp
        </button>
      </div>
    </div>
  );
}
