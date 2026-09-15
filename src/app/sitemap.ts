import type { MetadataRoute } from "next";
import { getAllProducts, getCategories } from "@/lib/queries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/boutique",
    "/personnalisation",
    "/contact",
    "/livraison",
    "/mentions-legales",
    "/confidentialite",
    "/panier"
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.6
  }));

  const categoryRoutes = getCategories().map((c) => ({
    url: `${siteUrl}/categorie/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));

  const productRoutes = getAllProducts().map((p) => ({
    url: `${siteUrl}/produit/${p.slug}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.5
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
