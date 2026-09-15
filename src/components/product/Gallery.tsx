"use client";

import { useState } from "react";
import clsx from "clsx";
import type { CategorySlug } from "@/lib/types";
import ProductVisual from "@/components/ui/ProductVisual";

export default function Gallery({ category, count = 4 }: { category: CategorySlug; count?: number }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const variants = Array.from({ length: count }, (_, i) => i);

  return (
    <div>
      <button
        onClick={() => setZoomed(true)}
        className="relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl"
        aria-label="Agrandir la photo"
      >
        <ProductVisual category={category} variant={active} className="h-full w-full" />
        <span className="absolute bottom-3 right-3 rounded-full bg-white/85 px-3 py-1 text-[11px] font-medium text-ink-700">
          🔍 Cliquer pour zoomer
        </span>
      </button>

      <div className="mt-4 grid grid-cols-4 gap-3">
        {variants.map((v) => (
          <button
            key={v}
            onClick={() => setActive(v)}
            className={clsx(
              "aspect-square overflow-hidden rounded-xl border-2 transition-colors",
              active === v ? "border-gold-500" : "border-transparent"
            )}
          >
            <ProductVisual category={category} variant={v} className="h-full w-full" />
          </button>
        ))}
      </div>

      {zoomed && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-6"
          onClick={() => setZoomed(false)}
        >
          <button
            aria-label="Fermer"
            className="absolute right-5 top-5 text-2xl text-white/80 hover:text-white"
            onClick={() => setZoomed(false)}
          >
            ✕
          </button>
          <div className="aspect-square w-full max-w-xl overflow-hidden rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <ProductVisual category={category} variant={active} className="h-full w-full scale-110" />
          </div>
        </div>
      )}
    </div>
  );
}
