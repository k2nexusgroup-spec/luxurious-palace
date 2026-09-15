"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import type { CategorySlug } from "@/lib/types";

const CATEGORIES: { slug: CategorySlug; label: string }[] = [
  { slug: "bijoux", label: "Bijoux" },
  { slug: "parfums", label: "Parfums" },
  { slug: "vetements", label: "Vêtements" }
];

const SUBCATEGORIES: Record<CategorySlug, { slug: string; label: string }[]> = {
  bijoux: [
    { slug: "chaines", label: "Chaînes" },
    { slug: "bracelets", label: "Bracelets" },
    { slug: "boucles-oreilles", label: "Boucles d'oreilles" }
  ],
  parfums: [
    { slug: "parfum-homme", label: "Parfums homme" },
    { slug: "parfum-femme", label: "Parfums femme" }
  ],
  vetements: [
    { slug: "debardeurs", label: "Débardeurs" },
    { slug: "tshirts", label: "T-shirts" },
    { slug: "polos", label: "Polos" },
    { slug: "boxers", label: "Boxers" }
  ]
};

export default function Filters({ sizes, colors }: { sizes: string[]; colors: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const category = searchParams.get("category") as CategorySlug | null;
  const subCategory = searchParams.get("subCategory");
  const gender = searchParams.get("gender");
  const size = searchParams.get("size");
  const color = searchParams.get("color");
  const sort = searchParams.get("sort") ?? "";
  const customizable = searchParams.get("customizable");

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key === "category") params.delete("subCategory");
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    router.push(pathname);
  }

  const content = (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold text-ink-900">Filtres</h3>
        <button onClick={clearAll} className="text-xs font-medium text-gold-600 hover:underline">
          Réinitialiser
        </button>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-400">Trier par</p>
        <select
          value={sort}
          onChange={(e) => setParam("sort", e.target.value || null)}
          className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
        >
          <option value="">Pertinence</option>
          <option value="nouveaute">Nouveautés</option>
          <option value="popularite">Popularité</option>
          <option value="prix-asc">Prix croissant</option>
          <option value="prix-desc">Prix décroissant</option>
        </select>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-400">Catégorie</p>
        <div className="space-y-2">
          {CATEGORIES.map((c) => (
            <label key={c.slug} className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
              <input
                type="radio"
                name="category"
                checked={category === c.slug}
                onChange={() => setParam("category", c.slug)}
                className="accent-gold-500"
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      {category && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-400">Sous-catégorie</p>
          <div className="space-y-2">
            {SUBCATEGORIES[category].map((s) => (
              <label key={s.slug} className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
                <input
                  type="radio"
                  name="subCategory"
                  checked={subCategory === s.slug}
                  onChange={() => setParam("subCategory", s.slug)}
                  className="accent-gold-500"
                />
                {s.label}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-400">Genre</p>
        <div className="flex flex-wrap gap-2">
          {["homme", "femme"].map((g) => (
            <button
              key={g}
              onClick={() => setParam("gender", gender === g ? null : g)}
              className={clsx(
                "rounded-full border px-3 py-1.5 text-xs font-medium capitalize",
                gender === g ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200 text-ink-600"
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {sizes.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-400">Taille</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setParam("size", size === s ? null : s)}
                className={clsx(
                  "rounded-full border px-3 py-1.5 text-xs font-medium",
                  size === s ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200 text-ink-600"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-400">Couleur</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setParam("color", color === c ? null : c)}
                className={clsx(
                  "rounded-full border px-3 py-1.5 text-xs font-medium",
                  color === c ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200 text-ink-600"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={customizable === "true"}
            onChange={(e) => setParam("customizable", e.target.checked ? "true" : null)}
            className="accent-gold-500"
          />
          Personnalisable uniquement
        </label>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="btn-outline mb-4 w-full lg:hidden"
      >
        Filtres &amp; tri
      </button>

      <aside className="hidden w-64 shrink-0 lg:block">{content}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="mb-4 flex justify-end">
              <button onClick={() => setMobileOpen(false)} aria-label="Fermer" className="text-ink-500">
                ✕
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
