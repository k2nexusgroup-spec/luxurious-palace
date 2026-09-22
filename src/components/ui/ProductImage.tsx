import Image from "next/image";
import clsx from "clsx";
import type { CategorySlug } from "@/lib/types";
import ProductVisual from "./ProductVisual";

interface ProductImageProps {
  src?: string;
  category: CategorySlug;
  alt: string;
  className?: string;
  variant?: number;
  sizes?: string;
  priority?: boolean;
}

export default function ProductImage({ src, category, alt, className, variant, sizes, priority }: ProductImageProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(min-width: 1024px) 25vw, 50vw"}
        priority={priority}
        className={clsx("object-cover", className)}
      />
    );
  }
  return <ProductVisual category={category} variant={variant} className={clsx("absolute inset-0 h-full w-full", className)} />;
}
