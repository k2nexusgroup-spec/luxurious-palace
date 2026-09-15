import clsx from "clsx";
import type { Badge as BadgeType } from "@/lib/types";

const STYLES: Record<BadgeType, string> = {
  nouveau: "bg-ink-900 text-white",
  populaire: "bg-gold-500 text-ink-900",
  promo: "bg-red-600 text-white"
};

const LABELS: Record<BadgeType, string> = {
  nouveau: "Nouveau",
  populaire: "Populaire",
  promo: "Promo"
};

export default function ProductBadge({ type, className }: { type: BadgeType; className?: string }) {
  return (
    <span className={clsx("rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider", STYLES[type], className)}>
      {LABELS[type]}
    </span>
  );
}
