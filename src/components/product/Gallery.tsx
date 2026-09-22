"use client";

import { useState } from "react";
import clsx from "clsx";
import type { CategorySlug } from "@/lib/types";
import ProductImage from "@/components/ui/ProductImage";

export default function Gallery({
  category,
  images = [],
  alt,
  count = 4
}: {
  category: CategorySlug;
  images?: string[];
  alt: string;
  count?: number;
}) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const hasPhotos = images.length > 0;
  const thumbs = hasPhotos ? images : Array.from({ length: count }, (_, i) => i);

  return (
    <div>
      <button
        onClick={() => setZoomed(true)}
        className="relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl"
        aria-label="Agrandir la photo"
      >
        <ProductImage
          src={hasPhotos ? images[active] : undefined}
          category={category}
          alt={alt}
          variant={active}
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
        />
        <span className="absolute bottom-3 right-3 rounded-full bg-white/85 px-3 py-1 text-[11px] font-medium text-ink-700">
          🔍 Cliquer pour zoomer
        </span>
      </button>

      {thumbs.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {thumbs.map((thumb, i) => (
            <button
              key={hasPhotos ? (thumb as string) : (thumb as number)}
              onClick={() => setActive(i)}
              className={clsx(
                "relative aspect-square overflow-hidden rounded-xl border-2 transition-colors",
                active === i ? "border-gold-500" : "border-transparent"
              )}
            >
              <ProductImage
                src={hasPhotos ? (thumb as string) : undefined}
                category={category}
                alt={alt}
                variant={i}
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}

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
          <div
            className="relative aspect-square w-full max-w-xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <ProductImage
              src={hasPhotos ? images[active] : undefined}
              category={category}
              alt={alt}
              variant={active}
              className="scale-110"
              sizes="600px"
            />
          </div>
        </div>
      )}
    </div>
  );
}
