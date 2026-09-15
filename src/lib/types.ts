export type CategorySlug = "bijoux" | "parfums" | "vetements";

export type SubCategorySlug =
  | "chaines"
  | "bracelets"
  | "boucles-oreilles"
  | "parfum-homme"
  | "parfum-femme"
  | "debardeurs"
  | "tshirts"
  | "polos"
  | "boxers";

export type Gender = "homme" | "femme" | "mixte";

export type Badge = "nouveau" | "populaire" | "promo";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  subCategory: SubCategorySlug;
  gender: Gender;
  price: number;
  oldPrice?: number;
  images: string[]; // URLs vides ou externes ; un placeholder visuel est affiché si absent
  description: string;
  shortDescription: string;
  sizes: string[];
  colors: string[];
  customizable: boolean;
  customizationNote?: string;
  stock: number;
  badges: Badge[];
  rating: number;
  reviewsCount: number;
  popularity: number;
  createdAt: string;
}

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  city: string;
  demo: true;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  active: boolean;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number | null; // null = à configurer
  delay: string; // ex: "24-48h" ou "À configurer"
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  active: boolean;
}

export interface StoreSettings {
  shopName: string;
  tagline: string;
  whatsappNumber: string;
  phoneNumber: string;
  whatsappLink: string;
  email: string;
  address: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
  deliveryZones: DeliveryZone[];
  promoCodes: PromoCode[];
  paymentMethods: { name: string; enabled: boolean }[];
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  customization?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number | null;
  total: number;
  status: "nouvelle" | "confirmee" | "expediee" | "livree" | "annulee";
  channel: "whatsapp" | "site";
}

export interface StoreData {
  settings: StoreSettings;
  categories: CategoryInfo[];
  products: Product[];
  testimonials: Testimonial[];
  banners: Banner[];
  orders: Order[];
}
