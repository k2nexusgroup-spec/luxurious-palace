import clsx from "clsx";
import type { CategorySlug } from "@/lib/types";

const GRADIENTS: Record<CategorySlug, string> = {
  bijoux: "from-ink-900 via-gold-500 to-ink-900",
  parfums: "from-ink-900 via-ink-700 to-gold-600",
  vetements: "from-gold-100 via-white to-gold-200"
};

const ICONS: Record<CategorySlug, React.ReactNode> = {
  bijoux: (
    <path d="M12 2 8 7h8l-4-5Zm-5 7 5 13 5-13H7Z" strokeLinejoin="round" />
  ),
  parfums: (
    <path
      d="M10 2h4M11 2v3.2c0 .4-.15.78-.42 1.07C9.55 7.35 9 8.7 9 10v9a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-9c0-1.3-.55-2.65-1.58-3.73A1.6 1.6 0 0 1 13 5.2V2"
      strokeLinejoin="round"
    />
  ),
  vetements: (
    <path
      d="M8 4 4 7l2 3 2-1.3V20h8V8.7L18 10l2-3-4-3-2 2h-4L8 4Z"
      strokeLinejoin="round"
    />
  )
};

const LABELS: Record<CategorySlug, string> = {
  bijoux: "Bijoux",
  parfums: "Parfums",
  vetements: "Vêtements"
};

interface ProductVisualProps {
  category: CategorySlug;
  className?: string;
  iconClassName?: string;
  variant?: number;
}

export default function ProductVisual({ category, className, iconClassName, variant = 0 }: ProductVisualProps) {
  const isLight = category === "vetements";
  const angle = 45 + variant * 35;

  return (
    <div
      className={clsx(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        GRADIENTS[category],
        className
      )}
      style={{ backgroundImage: `linear-gradient(${angle}deg, var(--tw-gradient-stops))` }}
    >
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 14px)"
      }} />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={0.8}
        className={clsx(
          "h-1/3 w-1/3",
          isLight ? "text-ink-800/25" : "text-white/30",
          iconClassName
        )}
      >
        {ICONS[category]}
      </svg>
      <span
        className={clsx(
          "absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.3em]",
          isLight ? "text-ink-700/50" : "text-white/50"
        )}
      >
        {LABELS[category]}
      </span>
    </div>
  );
}
