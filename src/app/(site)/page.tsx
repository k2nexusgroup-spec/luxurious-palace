import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import CategoriesSection from "@/components/home/CategoriesSection";
import ProductsSection from "@/components/home/ProductsSection";
import CustomizationSection from "@/components/home/CustomizationSection";
import AdvantagesSection from "@/components/home/AdvantagesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import InstagramSection from "@/components/home/InstagramSection";
import {
  getBanners,
  getCategories,
  getPopularProducts,
  getNewProducts,
  getSettings,
  getTestimonials
} from "@/lib/queries";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "Découvrez Luxurious Palace : bijoux, parfums et vêtements 100% coton personnalisables en Côte d'Ivoire. Commande simple sur WhatsApp."
};

export default function HomePage() {
  const settings = getSettings();
  const categories = getCategories();
  const banners = getBanners();
  const popular = getPopularProducts(8);
  const nouveautes = getNewProducts(4);
  const testimonials = getTestimonials();
  const banner = banners[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: settings.shopName,
    description: settings.tagline,
    telephone: settings.phoneNumber,
    email: settings.email,
    address: { "@type": "PostalAddress", addressLocality: "Abidjan", addressCountry: "CI" }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {banner && <Hero banner={banner} whatsappLink={settings.whatsappLink} />}

      <CategoriesSection categories={categories} />

      <ProductsSection
        title="Produits populaires"
        subtitle="Les pièces préférées de nos clientes et clients, sélectionnées pour vous."
        products={popular}
        whatsappNumber={settings.whatsappNumber}
        viewAllHref="/boutique?sort=popularite"
      />

      <CustomizationSection />

      <ProductsSection
        title="Nouveautés"
        subtitle="Les derniers arrivages de la boutique, à découvrir en avant-première."
        products={nouveautes}
        whatsappNumber={settings.whatsappNumber}
        viewAllHref="/boutique?sort=nouveaute"
      />

      <AdvantagesSection />

      <TestimonialsSection testimonials={testimonials} />

      <InstagramSection instagramUrl={settings.socialLinks.instagram} />
    </>
  );
}
