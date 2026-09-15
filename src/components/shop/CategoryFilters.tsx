"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";
import type { CategorySlug } from "@/lib/types";

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

export default function CategoryFilters({ category }: { category: CategorySlug }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const subCategory = searchParams.get("subCategory");
  const gender = searchParams.get("gender");
  const sort = searchParams.get("sort") ?? "";

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={() => setParam("subCategory", null)}
        className={clsx(
          "rounded-full border px-4 py-1.5 text-xs font-medium",
          !subCategory ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200 text-ink-600"
        )}
      >
        Tout
      </button>
      {SUBCATEGORIES[category].map((s) => (
        <button
          key={s.slug}
          onClick={() => setParam("subCategory", subCategory === s.slug ? null : s.slug)}
          className={clsx(
            "rounded-full border px-4 py-1.5 text-xs font-medium",
            subCategory === s.slug ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200 text-ink-600"
          )}
        >
          {s.label}
        </button>
      ))}

      <span className="mx-1 hidden h-5 w-px bg-ink-200 sm:block" />

      {["homme", "femme"].map((g) => (
        <button
          key={g}
          onClick={() => setParam("gender", gender === g ? null : g)}
          className={clsx(
            "rounded-full border px-4 py-1.5 text-xs font-medium capitalize",
            gender === g ? "border-gold-500 bg-gold-500 text-ink-900" : "border-ink-200 text-ink-600"
          )}
        >
          {g}
        </button>
      ))}

      <select
        value={sort}
        onChange={(e) => setParam("sort", e.target.value || null)}
        className="ml-auto rounded-full border border-ink-200 px-4 py-1.5 text-xs font-medium text-ink-600"
      >
        <option value="">Trier : Pertinence</option>
        <option value="nouveaute">Nouveautés</option>
        <option value="popularite">Popularité</option>
        <option value="prix-asc">Prix croissant</option>
        <option value="prix-desc">Prix décroissant</option>
      </select>
    </div>
  );
}
