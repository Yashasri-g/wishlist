export type BrandCategory = "WISHLIST" | "WISHLIST PREMIUM";
export type ClothingCategory = "Western" | "Ethnic";
export type Subcategory =
  | "Dresses"
  | "Co-ords"
  | "Blazers & Suits"
  | "Tops & Corsets"
  | "Sarees"
  | "Lehengas"
  | "Kurtas & Sets"
  | "Outerwear & Jackets";

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: BrandCategory;
  category: ClothingCategory;
  subcategory: Subcategory;
  price: number; // in INR ₹
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  sizes: string[];
  colors: ColorOption[];
  description: string;
  details: string[];
  fabricCare: string[];
  stylingNotes?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  isTrending?: boolean;
  isExclusive?: boolean;
  fabric?: string;
  occasions?: string[];
  badge?: string;
  inStock: boolean;
  stockCount: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: ColorOption;
  quantity: number;
}

export interface FilterState {
  brand: "ALL" | BrandCategory;
  category: "ALL" | ClothingCategory;
  subcategories: Subcategory[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  sortBy: "featured" | "newest" | "price-low" | "price-high" | "rating";
  searchQuery: string;
  inStockOnly: boolean;
}

export interface CampaignStory {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  brand: BrandCategory;
  heroImage: string;
  accentColor: string;
  season: string;
  featuredProductIds: string[];
}
