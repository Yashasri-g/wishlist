import type { ClothingCategory, Product, Subcategory } from "@/types";
import { PRODUCTS } from "./products";
import { img, PICK } from "./images";

/* ───────────────────────── Catalogue (with derived attributes) ───────────────────────── */

const FABRIC_KEYWORDS: [string, string][] = [
  ["chanderi", "Silk"],
  ["silk", "Silk"],
  ["mulberry", "Silk"],
  ["chiffon", "Chiffon"],
  ["georgette", "Georgette"],
  ["velvet", "Velvet"],
  ["denim", "Denim"],
  ["linen", "Linen"],
  ["satin", "Satin"],
  ["wool", "Wool Blend"],
  ["net", "Net"],
  ["cotton", "Cotton"],
];

const DEFAULT_OCCASIONS: Record<Subcategory, string[]> = {
  Sarees: ["Festive", "Wedding"],
  Lehengas: ["Wedding", "Festive"],
  "Kurtas & Sets": ["Festive", "Casual"],
  Dresses: ["Party", "Brunch"],
  "Co-ords": ["Casual", "Party"],
  "Blazers & Suits": ["Work", "Party"],
  "Tops & Corsets": ["Party", "Casual"],
  "Outerwear & Jackets": ["Casual", "Party"],
};

function enrich(p: Product): Product {
  if (p.fabric && p.occasions) return p;
  // trust the product name first, then the first detail line ("Fabric: ..."), then the description
  const find = (text: string) => FABRIC_KEYWORDS.find(([k]) => text.toLowerCase().includes(k))?.[1];
  const fabric = p.fabric ?? find(p.name) ?? find(p.details[0] ?? "") ?? find(p.description) ?? "Cotton";
  return { ...p, fabric, occasions: p.occasions ?? DEFAULT_OCCASIONS[p.subcategory] };
}

/** Every product, with fabric + occasions guaranteed. Use this everywhere in the UI. */
export const CATALOG: Product[] = PRODUCTS.map(enrich);

export const getProduct = (id: string) => CATALOG.find((p) => p.id === id);

/* ───────────────────────── Groupings ───────────────────────── */

export interface ShopFilters {
  cat?: ClothingCategory;
  sub?: Subcategory;
  occ?: string;
  fab?: string;
  price?: PriceBandKey;
  col?: CollectionKey;
  q?: string;
  size?: string;
  stock?: string; // "1" = in stock only
}

export function shopHref(f: ShopFilters = {}): string {
  const sp = new URLSearchParams();
  (Object.keys(f) as (keyof ShopFilters)[]).forEach((k) => f[k] && sp.set(k, String(f[k])));
  const qs = sp.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export type CollectionKey = "new" | "best" | "trending" | "sale" | "exclusive";
export const COLLECTIONS: { key: CollectionKey; label: string; blurb: string; test: (p: Product) => boolean }[] = [
  { key: "new", label: "New Arrivals", blurb: "Just landed", test: (p) => !!p.isNew },
  { key: "best", label: "Best Sellers", blurb: "Most loved pieces", test: (p) => !!p.isBestseller },
  { key: "trending", label: "Trending Now", blurb: "What everyone is wearing", test: (p) => !!p.isTrending },
  { key: "sale", label: "Sale", blurb: "Marked down", test: (p) => !!p.discountPercent },
  { key: "exclusive", label: "Exclusive", blurb: "Only at The Wishlist", test: (p) => !!p.isExclusive },
];

export type PriceBandKey = "u3" | "3to5" | "5to10" | "10p";
export const PRICE_BANDS: { key: PriceBandKey; label: string; short: string; min: number; max: number }[] = [
  { key: "u3", label: "Under ₹3,000", short: "Under ₹3K", min: 0, max: 3000 },
  { key: "3to5", label: "₹3,000 – ₹5,000", short: "₹3K–₹5K", min: 3000, max: 5000 },
  { key: "5to10", label: "₹5,000 – ₹10,000", short: "₹5K–₹10K", min: 5000, max: 10000 },
  { key: "10p", label: "Above ₹10,000", short: "₹10K+", min: 10000, max: Infinity },
];

export const OCCASIONS: { label: string; image: string }[] = [
  { label: "Wedding", image: img(PICK.bridalLehenga, 700) },
  { label: "Festive", image: img(PICK.greenSaree, 700) },
  { label: "Party", image: img(PICK.sequinGown, 700) },
  { label: "Work", image: img(PICK.blackBlazer, 700) },
  { label: "Casual", image: img(PICK.creamDress, 700) },
  { label: "Brunch", image: img(PICK.shirtDress, 700) },
  { label: "Vacation", image: img(PICK.beachDress, 700) },
];

export const FABRICS: { label: string; image: string }[] = [
  { label: "Silk", image: img(PICK.greenSaree, 500) },
  { label: "Chiffon", image: img(PICK.ivorySaree, 500) },
  { label: "Georgette", image: img(PICK.crimsonGown, 500) },
  { label: "Net", image: img(PICK.lilacLehenga, 500) },
  { label: "Velvet", image: img(PICK.redBridal, 500) },
  { label: "Cotton", image: img(PICK.greySaree, 500) },
  { label: "Denim", image: img(PICK.denimCoord, 500) },
  { label: "Linen", image: img(PICK.beigeBlazer, 500) },
  { label: "Satin", image: img(PICK.amethystDress, 500) },
  { label: "Wool Blend", image: img(PICK.blackBlazer, 500) },
];

export const SUBCATEGORIES: {
  sub: Subcategory;
  cat: ClothingCategory;
  label: string;
  image: string;
}[] = [
  { sub: "Dresses", cat: "Western", label: "Dresses", image: img(PICK.amethystDress, 700) },
  { sub: "Co-ords", cat: "Western", label: "Co-ords", image: img(PICK.denimCoord, 700) },
  { sub: "Blazers & Suits", cat: "Western", label: "Blazers & Suits", image: img(PICK.beigeBlazer, 700) },
  { sub: "Tops & Corsets", cat: "Western", label: "Tops & Corsets", image: img(PICK.corset, 700) },
  { sub: "Outerwear & Jackets", cat: "Western", label: "Jackets", image: img(PICK.denimJacket, 700) },
  { sub: "Sarees", cat: "Ethnic", label: "Sarees", image: img(PICK.tealSaree, 700) },
  { sub: "Lehengas", cat: "Ethnic", label: "Lehengas", image: img(PICK.marigoldLehenga, 700) },
  { sub: "Kurtas & Sets", cat: "Ethnic", label: "Kurtas & Sets", image: img(PICK.maroonKurta, 700) },
];

export const CATEGORY_TREE = {
  Western: { brand: "WISHLIST", href: "/wishlist", subs: SUBCATEGORIES.filter((s) => s.cat === "Western") },
  Ethnic: { brand: "WISHLIST PREMIUM", href: "/wishlist-premium", subs: SUBCATEGORIES.filter((s) => s.cat === "Ethnic") },
} as const;

/* ───────────────────────── Selectors ───────────────────────── */

export function filterProducts(f: ShopFilters, list: Product[] = CATALOG): Product[] {
  const band = f.price ? PRICE_BANDS.find((b) => b.key === f.price) : undefined;
  const col = f.col ? COLLECTIONS.find((c) => c.key === f.col) : undefined;
  const q = f.q?.trim().toLowerCase();
  return list.filter((p) => {
    if (f.cat && p.category !== f.cat) return false;
    if (f.sub && p.subcategory !== f.sub) return false;
    if (f.occ && !p.occasions?.includes(f.occ)) return false;
    if (f.fab && p.fabric !== f.fab) return false;
    if (band && !(p.price >= band.min && p.price < band.max)) return false;
    if (col && !col.test(p)) return false;
    if (f.size && !p.sizes.includes(f.size)) return false;
    if (f.stock === "1" && !p.inStock) return false;
    if (q && !`${p.name} ${p.subcategory} ${p.category} ${p.fabric} ${p.colors.map((c) => c.name).join(" ")}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

export const byCollection = (key: CollectionKey, list: Product[] = CATALOG) => filterProducts({ col: key }, list);

export const newestFirst = (list: Product[]) => [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const countFor = (f: ShopFilters) => filterProducts(f).length;
