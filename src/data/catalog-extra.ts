import type { ClothingCategory, ColorOption, Product, Subcategory } from "@/types";
import { img } from "./images";

/**
 * Extra DEMO catalogue so every grouping on the site has real depth.
 * Names, prices, fabrics and flags are placeholders. Replace with the brand's real data
 * (or a Shopify feed later). Ratings / review counts are intentionally 0 and never displayed.
 */

type Row = {
  id: string;
  name: string;
  sub: Subcategory;
  price: number;
  was?: number;
  fabric: string;
  occ: string[];
  colors: ColorOption[];
  imgs: number[]; // indexes into the vetted image registry
  flags?: Partial<Pick<Product, "isNew" | "isBestseller" | "isTrending" | "isExclusive">>;
  badge?: string;
  out?: boolean;
};

const C = (name: string, hex: string): ColorOption => ({ name, hex });

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const SINGULAR: Record<Subcategory, string> = {
  Sarees: "saree",
  Lehengas: "lehenga",
  "Kurtas & Sets": "kurta set",
  Dresses: "dress",
  "Co-ords": "co-ord set",
  "Blazers & Suits": "blazer",
  "Tops & Corsets": "top",
  "Outerwear & Jackets": "jacket",
};
const SINGULAR_ARTICLE: Record<Subcategory, string> = { ...Object.fromEntries(Object.keys(SINGULAR).map((k) => [k, "a"])) } as Record<Subcategory, string>;

const ETHNIC: Subcategory[] = ["Sarees", "Lehengas", "Kurtas & Sets"];

const FABRIC_CARE: Record<string, string[]> = {
  Silk: ["Dry clean only", "Store folded in a muslin cover"],
  Chiffon: ["Hand wash cold or dry clean", "Do not wring"],
  Georgette: ["Dry clean recommended", "Steam on low heat"],
  Velvet: ["Dry clean only", "Hang to store"],
  Cotton: ["Machine wash cold, gentle cycle", "Iron on medium heat"],
  Denim: ["Machine wash cold, inside out", "Wash with similar colours"],
  Linen: ["Machine wash cold", "Iron while slightly damp"],
  Satin: ["Hand wash cold or dry clean", "Do not tumble dry"],
  Net: ["Dry clean only", "Store with tissue between layers"],
  "Wool Blend": ["Dry clean only", "Brush gently, steam to refresh"],
};

function make(row: Row, i: number): Product {
  const category: ClothingCategory = ETHNIC.includes(row.sub) ? "Ethnic" : "Western";
  const brand = category === "Ethnic" ? "WISHLIST PREMIUM" : "WISHLIST";
  const sizes =
    row.sub === "Sarees"
      ? ["One Size"]
      : category === "Ethnic"
      ? ["S", "M", "L", "XL", "XXL"]
      : ["XS", "S", "M", "L", "XL"];
  const day = String(1 + ((i * 7) % 27)).padStart(2, "0");
  const month = i % 2 ? "10" : "09";
  return {
    id: row.id,
    name: row.name,
    slug: slug(row.name),
    brand,
    category,
    subcategory: row.sub,
    price: row.price,
    originalPrice: row.was,
    discountPercent: row.was ? Math.round(((row.was - row.price) / row.was) * 100) : undefined,
    rating: 0,
    reviewCount: 0,
    images: row.imgs.map((n) => img(n, 1100)),
    sizes,
    colors: row.colors,
    description: `${row.name}: ${SINGULAR_ARTICLE[row.sub]} ${row.fabric.toLowerCase()} ${SINGULAR[row.sub]} from the ${
      brand === "WISHLIST" ? "WISHLIST" : "WISHLIST PREMIUM"
    } edit. Demo description, to be replaced with the brand's product copy.`,
    details: [`Fabric: ${row.fabric}`, `Suited to: ${row.occ.join(", ")}`, "Demo product: details to be supplied by the brand"],
    fabricCare: FABRIC_CARE[row.fabric] ?? ["Care instructions to be supplied by the brand"],
    isNew: row.flags?.isNew,
    isBestseller: row.flags?.isBestseller,
    isTrending: row.flags?.isTrending,
    isExclusive: row.flags?.isExclusive,
    badge: row.badge,
    fabric: row.fabric,
    occasions: row.occ,
    inStock: !row.out,
    stockCount: row.out ? 0 : 6 + ((i * 5) % 30),
    createdAt: `2026-${month}-${day}`,
  };
}

const ROWS: Row[] = [
  // ───────── WISHLIST PREMIUM · Sarees ─────────
  { id: "x-sar-01", name: "Teal Pre-Draped Saree", sub: "Sarees", price: 8499, was: 10999, fabric: "Georgette", occ: ["Party", "Festive"], colors: [C("Teal", "#0f6b73"), C("Navy", "#14284b")], imgs: [9], flags: { isNew: true, isTrending: true } },
  { id: "x-sar-02", name: "Dove Grey Handloom Saree", sub: "Sarees", price: 4299, fabric: "Cotton", occ: ["Casual", "Work"], colors: [C("Dove Grey", "#b9b6b0")], imgs: [4], flags: { isBestseller: true } },
  { id: "x-sar-03", name: "Ivory Blush Chiffon Saree", sub: "Sarees", price: 6999, was: 8999, fabric: "Chiffon", occ: ["Festive", "Party"], colors: [C("Ivory", "#f1e9dc")], imgs: [10], flags: { isTrending: true } },
  { id: "x-sar-04", name: "Emerald & Marigold Silk Saree", sub: "Sarees", price: 14999, was: 18999, fabric: "Silk", occ: ["Wedding", "Festive"], colors: [C("Emerald", "#0b4e36"), C("Marigold", "#e0a21c")], imgs: [13], flags: { isBestseller: true, isExclusive: true }, badge: "FESTIVE EDIT" },
  { id: "x-sar-05", name: "Plum Magenta Silk Saree", sub: "Sarees", price: 11999, fabric: "Silk", occ: ["Festive", "Wedding"], colors: [C("Plum", "#6a1f56")], imgs: [3], flags: { isNew: true } },

  // ───────── WISHLIST PREMIUM · Lehengas ─────────
  { id: "x-leh-01", name: "Blush Bridal Lehenga Set", sub: "Lehengas", price: 38999, was: 46999, fabric: "Net", occ: ["Wedding"], colors: [C("Blush Pink", "#e7a9b4")], imgs: [14], flags: { isExclusive: true, isTrending: true }, badge: "BRIDAL" },
  { id: "x-leh-02", name: "Crimson Flared Lehenga Gown", sub: "Lehengas", price: 16999, fabric: "Georgette", occ: ["Party", "Wedding"], colors: [C("Crimson", "#9b1030")], imgs: [15], flags: { isNew: true, isBestseller: true } },
  { id: "x-leh-03", name: "Marigold Embroidered Lehenga", sub: "Lehengas", price: 27999, was: 32999, fabric: "Silk", occ: ["Wedding", "Festive"], colors: [C("Marigold", "#e0a21c")], imgs: [16], flags: { isBestseller: true } },
  { id: "x-leh-04", name: "Lilac Garden Lehenga", sub: "Lehengas", price: 21999, fabric: "Net", occ: ["Festive", "Party"], colors: [C("Lilac", "#b9a2cf")], imgs: [19], flags: { isNew: true } },
  { id: "x-leh-05", name: "Ivory & Gold Lehenga Set", sub: "Lehengas", price: 24999, fabric: "Silk", occ: ["Wedding", "Festive"], colors: [C("Ivory Gold", "#e9dcc3")], imgs: [20], flags: { isTrending: true } },
  { id: "x-leh-06", name: "Mustard Crop-Top Lehenga", sub: "Lehengas", price: 13999, was: 16999, fabric: "Georgette", occ: ["Festive", "Party"], colors: [C("Mustard", "#d79a1f")], imgs: [23], flags: { isTrending: true, isNew: true } },
  { id: "x-leh-07", name: "Scarlet Bridal Lehenga", sub: "Lehengas", price: 44999, fabric: "Velvet", occ: ["Wedding"], colors: [C("Scarlet", "#a50e1f")], imgs: [21], flags: { isExclusive: true }, badge: "BRIDAL", out: true },
  { id: "x-leh-08", name: "Ivory Dupatta Lehenga Set", sub: "Lehengas", price: 15999, fabric: "Chiffon", occ: ["Festive", "Wedding"], colors: [C("Ivory", "#efe7da")], imgs: [22, 24, 26] },
  { id: "x-leh-09", name: "Teal Tiered Lehenga Skirt", sub: "Lehengas", price: 12499, fabric: "Georgette", occ: ["Party", "Festive"], colors: [C("Teal", "#0f6b73")], imgs: [18] },

  // ───────── WISHLIST PREMIUM · Kurtas & Sets ─────────
  { id: "x-kur-01", name: "Maroon Chikankari Kurta", sub: "Kurtas & Sets", price: 3299, fabric: "Cotton", occ: ["Casual", "Festive"], colors: [C("Maroon", "#6e1830")], imgs: [27, 28, 29], flags: { isBestseller: true } },
  { id: "x-kur-02", name: "Emerald Sharara Set", sub: "Kurtas & Sets", price: 7499, was: 8999, fabric: "Georgette", occ: ["Festive", "Party"], colors: [C("Emerald", "#118a4d")], imgs: [31], flags: { isNew: true } },
  { id: "x-kur-03", name: "Navy Bandhani Kurta with Dupatta", sub: "Kurtas & Sets", price: 3999, fabric: "Cotton", occ: ["Casual", "Work"], colors: [C("Navy", "#14284b")], imgs: [32, 33], flags: { isTrending: true } },
  { id: "x-kur-04", name: "Ruby Kurta with Printed Dupatta", sub: "Kurtas & Sets", price: 4499, was: 5499, fabric: "Cotton", occ: ["Festive", "Casual"], colors: [C("Ruby", "#c4122f")], imgs: [34, 36, 35], flags: { isBestseller: true } },
  { id: "x-kur-05", name: "Aqua Floral Co-ord Kurta Set", sub: "Kurtas & Sets", price: 2999, fabric: "Cotton", occ: ["Casual", "Brunch"], colors: [C("Aqua", "#6dc3c1")], imgs: [38], flags: { isNew: true, isTrending: true } },
  { id: "x-kur-06", name: "Midnight Floral Kurta Co-ord", sub: "Kurtas & Sets", price: 3499, fabric: "Cotton", occ: ["Work", "Casual"], colors: [C("Midnight", "#1d2140")], imgs: [39] },

  // ───────── WISHLIST · Dresses ─────────
  { id: "x-drs-01", name: "Sage Printed Shirt Dress", sub: "Dresses", price: 2999, fabric: "Satin", occ: ["Work", "Brunch"], colors: [C("Sage", "#9db3a2")], imgs: [43], flags: { isNew: true } },
  { id: "x-drs-02", name: "Cream Swing Dress", sub: "Dresses", price: 2499, was: 3199, fabric: "Cotton", occ: ["Casual", "Brunch"], colors: [C("Cream", "#efe6d6")], imgs: [44], flags: { isBestseller: true } },
  { id: "x-drs-03", name: "Aubergine Sequin Slit Gown", sub: "Dresses", price: 7999, was: 9999, fabric: "Velvet", occ: ["Party"], colors: [C("Aubergine", "#4a1a58")], imgs: [45], flags: { isTrending: true, isNew: true } },
  { id: "x-drs-04", name: "Amethyst One-Shoulder Dress", sub: "Dresses", price: 4999, fabric: "Satin", occ: ["Party"], colors: [C("Amethyst", "#6a3fa0")], imgs: [47], flags: { isBestseller: true } },
  { id: "x-drs-05", name: "Tropical Print Beach Dress", sub: "Dresses", price: 1999, fabric: "Cotton", occ: ["Vacation", "Casual"], colors: [C("Sunshine", "#f0c419")], imgs: [49], flags: { isTrending: true } },

  // ───────── WISHLIST · Blazers & Suits ─────────
  { id: "x-blz-01", name: "Dove Grey Check Blazer", sub: "Blazers & Suits", price: 4999, fabric: "Wool Blend", occ: ["Work"], colors: [C("Grey Check", "#a7a7a7")], imgs: [50] },
  { id: "x-blz-02", name: "Midnight Tailored Suit Set", sub: "Blazers & Suits", price: 8999, was: 10999, fabric: "Wool Blend", occ: ["Work", "Party"], colors: [C("Midnight", "#16202e")], imgs: [51], flags: { isBestseller: true } },
  { id: "x-blz-03", name: "Sand Blazer & Trouser Set", sub: "Blazers & Suits", price: 6499, fabric: "Linen", occ: ["Work", "Brunch"], colors: [C("Sand", "#cdb79a")], imgs: [52], flags: { isNew: true, isTrending: true } },
  { id: "x-blz-04", name: "Noir Oversized Blazer", sub: "Blazers & Suits", price: 5499, fabric: "Wool Blend", occ: ["Work", "Party"], colors: [C("Noir", "#171717")], imgs: [53], flags: { isBestseller: true } },
  { id: "x-blz-05", name: "Slate Single-Button Blazer", sub: "Blazers & Suits", price: 4799, fabric: "Wool Blend", occ: ["Work"], colors: [C("Slate", "#6a6d75")], imgs: [54] },
  { id: "x-blz-06", name: "Check Blazer Co-ord", sub: "Blazers & Suits", price: 7299, fabric: "Wool Blend", occ: ["Work", "Party"], colors: [C("Check", "#8f8f95")], imgs: [55], flags: { isTrending: true } },
  { id: "x-blz-07", name: "Power Black Blazer", sub: "Blazers & Suits", price: 5999, was: 7499, fabric: "Wool Blend", occ: ["Work", "Party"], colors: [C("Black", "#0f0f0f")], imgs: [56] },
  { id: "x-blz-08", name: "Scarlet Statement Blazer", sub: "Blazers & Suits", price: 5299, fabric: "Wool Blend", occ: ["Party", "Work"], colors: [C("Scarlet", "#c8102e")], imgs: [57], flags: { isNew: true, isTrending: true } },
  { id: "x-blz-09", name: "Ivory Relaxed Blazer", sub: "Blazers & Suits", price: 4999, fabric: "Linen", occ: ["Work", "Brunch"], colors: [C("Ivory", "#f2ece0")], imgs: [58, 59], flags: { isBestseller: true } },
  { id: "x-blz-10", name: "Tweed Office Blazer", sub: "Blazers & Suits", price: 5699, fabric: "Wool Blend", occ: ["Work"], colors: [C("Charcoal Tweed", "#444248")], imgs: [60] },

  // ───────── WISHLIST · Co-ords ─────────
  { id: "x-crd-01", name: "Denim Crop Jacket & Skirt Co-ord", sub: "Co-ords", price: 4499, was: 5499, fabric: "Denim", occ: ["Casual", "Party"], colors: [C("Indigo", "#2f4b7c")], imgs: [65], flags: { isTrending: true, isBestseller: true } },
  { id: "x-crd-02", name: "Indigo Blazer & Straight Jeans", sub: "Co-ords", price: 5299, fabric: "Denim", occ: ["Casual", "Work"], colors: [C("Indigo", "#2f4b7c")], imgs: [62], flags: { isNew: true } },
  { id: "x-crd-03", name: "Retro Jersey & Wide-Leg Jeans", sub: "Co-ords", price: 3799, fabric: "Denim", occ: ["Casual"], colors: [C("Light Wash", "#9ab6d6")], imgs: [67] },
  { id: "x-crd-04", name: "Cloud Hoodie & Baggy Jeans", sub: "Co-ords", price: 3999, fabric: "Cotton", occ: ["Casual"], colors: [C("Cloud", "#eeeeee")], imgs: [69], flags: { isTrending: true, isNew: true } },

  // ───────── WISHLIST · Tops & Corsets ─────────
  { id: "x-top-01", name: "Corset Top & Straight Denim", sub: "Tops & Corsets", price: 3299, fabric: "Cotton", occ: ["Party", "Casual"], colors: [C("White", "#f5f5f5")], imgs: [63], flags: { isTrending: true } },
  { id: "x-top-02", name: "Graphic Tee & Ripped Denim", sub: "Tops & Corsets", price: 2199, fabric: "Cotton", occ: ["Casual"], colors: [C("Black", "#141414")], imgs: [64] },
  { id: "x-top-03", name: "Ivory Cropped Overshirt", sub: "Tops & Corsets", price: 2299, fabric: "Cotton", occ: ["Work", "Casual"], colors: [C("Ivory", "#efe6d6")], imgs: [70], flags: { isNew: true } },

  // ───────── WISHLIST · Outerwear & Jackets ─────────
  { id: "x-out-01", name: "Denim Jacket with Cargo Set", sub: "Outerwear & Jackets", price: 4699, fabric: "Denim", occ: ["Casual"], colors: [C("Indigo", "#2f4b7c")], imgs: [61], flags: { isTrending: true } },
  { id: "x-out-02", name: "Washed Denim Jacket", sub: "Outerwear & Jackets", price: 2999, was: 3799, fabric: "Denim", occ: ["Casual"], colors: [C("Washed Blue", "#8fb0d0")], imgs: [66], flags: { isBestseller: true } },
  { id: "x-out-03", name: "Cropped Denim Jacket & Jeans", sub: "Outerwear & Jackets", price: 4299, fabric: "Denim", occ: ["Casual", "Party"], colors: [C("Mid Wash", "#6e8fb5")], imgs: [68] },
];

export const EXTRA_PRODUCTS: Product[] = ROWS.map(make);
