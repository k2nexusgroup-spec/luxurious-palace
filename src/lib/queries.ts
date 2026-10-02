import { readStore } from "./db";
import type { CategorySlug, Gender, Product } from "./types";

export async function getSettings() {
  return (await readStore()).settings;
}

export async function getCategories() {
  return (await readStore()).categories.map((c) => ({ ...c, subCategories: c.subCategories ?? [] }));
}

export async function getCategory(slug: CategorySlug) {
  return (await getCategories()).find((c) => c.slug === slug) ?? null;
}

export async function getTestimonials() {
  return (await readStore()).testimonials;
}

export async function getBanners() {
  return (await readStore()).banners.filter((b) => b.active);
}

export async function getAllProducts(): Promise<Product[]> {
  return (await readStore()).products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return (await getAllProducts()).find((p) => p.slug === slug) ?? null;
}

export async function getProductsByCategory(category: CategorySlug): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => p.category === category);
}

export async function getPopularProducts(limit = 8): Promise<Product[]> {
  return [...(await getAllProducts())].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

export async function getNewProducts(limit = 8): Promise<Product[]> {
  return [...(await getAllProducts())]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return (await getAllProducts())
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export interface ProductFilters {
  category?: CategorySlug;
  subCategory?: string;
  gender?: Gender;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: "prix-asc" | "prix-desc" | "nouveaute" | "popularite";
  customizable?: boolean;
}

export async function filterProducts(filters: ProductFilters): Promise<Product[]> {
  let results = await getAllProducts();

  if (filters.category) results = results.filter((p) => p.category === filters.category);
  if (filters.subCategory) results = results.filter((p) => p.subCategory === filters.subCategory);
  if (filters.gender) results = results.filter((p) => p.gender === filters.gender || p.gender === "mixte");
  if (filters.size) results = results.filter((p) => p.sizes.includes(filters.size!));
  if (filters.color) results = results.filter((p) => p.colors.includes(filters.color!));
  if (filters.minPrice !== undefined) results = results.filter((p) => p.price >= filters.minPrice!);
  if (filters.maxPrice !== undefined) results = results.filter((p) => p.price <= filters.maxPrice!);
  if (filters.customizable) results = results.filter((p) => p.customizable);
  if (filters.search) {
    const term = filters.search.toLowerCase();
    results = results.filter(
      (p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
    );
  }

  switch (filters.sort) {
    case "prix-asc":
      results = [...results].sort((a, b) => a.price - b.price);
      break;
    case "prix-desc":
      results = [...results].sort((a, b) => b.price - a.price);
      break;
    case "nouveaute":
      results = [...results].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "popularite":
      results = [...results].sort((a, b) => b.popularity - a.popularity);
      break;
  }

  return results;
}

export async function getAllSizes(): Promise<string[]> {
  const sizes = new Set<string>();
  (await getAllProducts()).forEach((p) => p.sizes.forEach((s) => sizes.add(s)));
  return Array.from(sizes);
}

export async function getAllColors(): Promise<string[]> {
  const colors = new Set<string>();
  (await getAllProducts()).forEach((p) => p.colors.forEach((c) => colors.add(c)));
  return Array.from(colors);
}
