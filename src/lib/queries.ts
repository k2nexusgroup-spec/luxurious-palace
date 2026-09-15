import { readStore } from "./db";
import type { CategorySlug, Gender, Product } from "./types";

export function getSettings() {
  return readStore().settings;
}

export function getCategories() {
  return readStore().categories;
}

export function getCategory(slug: CategorySlug) {
  return getCategories().find((c) => c.slug === slug) ?? null;
}

export function getTestimonials() {
  return readStore().testimonials;
}

export function getBanners() {
  return readStore().banners.filter((b) => b.active);
}

export function getAllProducts(): Product[] {
  return readStore().products;
}

export function getProductBySlug(slug: string): Product | null {
  return getAllProducts().find((p) => p.slug === slug) ?? null;
}

export function getProductsByCategory(category: CategorySlug): Product[] {
  return getAllProducts().filter((p) => p.category === category);
}

export function getPopularProducts(limit = 8): Product[] {
  return [...getAllProducts()].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

export function getNewProducts(limit = 8): Product[] {
  return [...getAllProducts()]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return getAllProducts()
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

export function filterProducts(filters: ProductFilters): Product[] {
  let results = getAllProducts();

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

export function getAllSizes(): string[] {
  const sizes = new Set<string>();
  getAllProducts().forEach((p) => p.sizes.forEach((s) => sizes.add(s)));
  return Array.from(sizes);
}

export function getAllColors(): string[] {
  const colors = new Set<string>();
  getAllProducts().forEach((p) => p.colors.forEach((c) => colors.add(c)));
  return Array.from(colors);
}
