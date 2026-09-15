import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/product/Gallery";
import ProductOptions from "@/components/product/ProductOptions";
import StarRating from "@/components/ui/StarRating";
import ProductBadge from "@/components/ui/Badge";
import ProductCard from "@/components/shop/ProductCard";
import { getAllProducts, getCategory, getProductBySlug, getRelatedProducts, getSettings } from "@/lib/queries";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: { title: product.name, description: product.shortDescription }
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const settings = getSettings();
  const related = getRelatedProducts(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "XOF",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    aggregateRating: product.reviewsCount > 0
      ? { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewsCount }
      : undefined
  };

  return (
    <div className="container-lp py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-xs text-ink-400">
        <Link href="/" className="hover:text-gold-600">Accueil</Link> /{" "}
        <Link href={`/categorie/${product.category}`} className="hover:text-gold-600">{getCategory(product.category)?.name}</Link> /{" "}
        <span className="text-ink-600">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <Gallery category={product.category} />

        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            {product.badges.map((b) => (
              <ProductBadge key={b} type={b} />
            ))}
          </div>
          <h1 className="font-serif text-3xl font-bold text-ink-900 sm:text-4xl">{product.name}</h1>
          <div className="mt-2">
            <StarRating rating={product.rating} count={product.reviewsCount} />
          </div>
          <p className="mt-4 leading-relaxed text-ink-500">{product.description}</p>

          <div className="mt-6 border-t border-ink-100 pt-6">
            <ProductOptions product={product} whatsappNumber={settings.whatsappNumber} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-serif text-2xl font-bold text-ink-900">Produits similaires</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} whatsappNumber={settings.whatsappNumber} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
