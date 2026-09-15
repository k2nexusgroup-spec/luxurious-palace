import Link from "next/link";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/shop/ProductCard";

export default function ProductsSection({
  title,
  subtitle,
  products,
  whatsappNumber,
  viewAllHref
}: {
  title: string;
  subtitle: string;
  products: Product[];
  whatsappNumber: string;
  viewAllHref: string;
}) {
  return (
    <section className="bg-gold-50/40 py-20 sm:py-28">
      <div className="container-lp">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="section-eyebrow">Sélection</span>
            <h2 className="mt-3 text-3xl font-bold text-ink-900 sm:text-4xl">{title}</h2>
            <p className="mt-3 max-w-xl text-ink-500">{subtitle}</p>
          </div>
          <Link href={viewAllHref} className="btn-outline">
            Voir tout
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <div key={p.id} className="reveal" style={{ animationDelay: `${i * 0.06}s` }}>
              <ProductCard product={p} whatsappNumber={whatsappNumber} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
