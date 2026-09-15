"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import ProductVisual from "@/components/ui/ProductVisual";
import ProductBadge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import WhatsappIcon from "@/components/ui/WhatsappIcon";
import { formatFcfa, buildSingleProductMessage, buildWhatsappUrl } from "@/lib/whatsapp";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";

export default function ProductCard({ product, whatsappNumber }: { product: Product; whatsappNumber: string }) {
  const addItem = useCartStore((s) => s.addItem);
  const isSaved = useWishlistStore((s) => s.isSaved(product.id));
  const toggle = useWishlistStore((s) => s.toggle);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      category: product.category,
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0]
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleWhatsappOrder() {
    const message = buildSingleProductMessage({
      name: product.name,
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0],
      price: product.price
    });
    window.open(buildWhatsappUrl(whatsappNumber, message), "_blank");
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white transition-shadow duration-300 hover:shadow-xl hover:shadow-ink-900/5">
      <button
        onClick={() => toggle(product.id)}
        aria-label="Ajouter aux favoris"
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-600 shadow-sm transition-colors hover:text-red-500"
      >
        <svg viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.7} className={isSaved ? "h-4 w-4 text-red-500" : "h-4 w-4"}>
          <path d="M12 20.6s-7-4.35-9.5-8.8C.9 8.6 2.3 5 5.8 5c2 0 3.4 1.1 4.2 2.4C10.8 6.1 12.2 5 14.2 5c3.5 0 4.9 3.6 3.3 6.8-2.5 4.45-9.5 8.8-9.5 8.8Z" strokeLinejoin="round" />
        </svg>
      </button>

      <Link href={`/produit/${product.slug}`} className="relative block aspect-[4/5] w-full overflow-hidden">
        <ProductVisual category={product.category} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badges.map((b) => (
            <ProductBadge key={b} type={b} />
          ))}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/produit/${product.slug}`}>
          <h3 className="line-clamp-1 font-serif text-base font-semibold text-ink-900 group-hover:text-gold-700">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-1 text-xs text-ink-400">{product.shortDescription}</p>
        <StarRating rating={product.rating} count={product.reviewsCount} />

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-bold text-ink-900">{formatFcfa(product.price)}</span>
          {product.oldPrice && (
            <span className="text-sm text-ink-300 line-through">{formatFcfa(product.oldPrice)}</span>
          )}
        </div>

        <div className="mt-2 flex gap-2">
          <button onClick={handleAddToCart} className="btn-outline flex-1 !px-3 !py-2 text-xs">
            {added ? "Ajouté ✓" : "Ajouter au panier"}
          </button>
          <button
            onClick={handleWhatsappOrder}
            aria-label="Commander sur WhatsApp"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-105"
          >
            <WhatsappIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
