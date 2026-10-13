import { BrandCategory } from "@/types";

export interface CuratedLookItemRef {
  productId: string;
  role: "primary" | "secondary" | "accessory";
  label: string; // e.g. "Core Saree Piece", "Blouse & Drape", "Fine Jewellery"
}

export interface CuratedLook {
  id: string;
  title: string;
  tagline: string;
  season: string;
  brand: BrandCategory;
  category: "Western" | "Ethnic" | "Fusion";
  occasion: string;
  heroImage: string;
  stylingTip: string;
  itemRefs: CuratedLookItemRef[];
}

export const CURATED_LOOKS: CuratedLook[] = [
  {
    id: "look-01",
    title: "Royal Heritage Chanderi",
    tagline: "Handcrafted pure chanderi silk with regal zardozi borders.",
    season: "AW '26 Couture",
    brand: "WISHLIST PREMIUM",
    category: "Ethnic",
    occasion: "Wedding & Soirée",
    heroImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
    stylingTip: "Pair with polki gold earrings and an emerald satin potli for royal evening nuptials.",
    itemRefs: [
      {
        productId: "prem-eth-01",
        role: "primary",
        label: "Royal Chanderi Silk Saree",
      },
      {
        productId: "prem-eth-03",
        role: "secondary",
        label: "Organza Silk Dupatta Accent",
      },
      {
        productId: "x-sar-04",
        role: "accessory",
        label: "Marigold Silk Contrast Shawl",
      },
    ],
  },
  {
    id: "look-02",
    title: "Sculpted Hourglass Suiting",
    tagline: "Sharp tailored lines meeting Gen-Z architectural proportion.",
    season: "Autumn City Edit",
    brand: "WISHLIST",
    category: "Western",
    occasion: "Cocktail & Gallery",
    heroImage: "https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?q=80&w=1200&auto=format&fit=crop",
    stylingTip: "Style over bare shoulders with pointed leather slingbacks and structured clutch.",
    itemRefs: [
      {
        productId: "wl-west-03",
        role: "primary",
        label: "Cropped Blazer & Pleated Skirt Set",
      },
      {
        productId: "wl-west-01",
        role: "secondary",
        label: "Cyber Boned Corset Top",
      },
      {
        productId: "prem-west-01",
        role: "accessory",
        label: "Wool Overcoat Layer",
      },
    ],
  },
  {
    id: "look-03",
    title: "Maharani Velvet Crimson",
    tagline: "Opulent micro-velvet kalis crowned with mukaish embroidery.",
    season: "Bridal Festive Edit",
    brand: "WISHLIST PREMIUM",
    category: "Ethnic",
    occasion: "Royal Sangeet & Reception",
    heroImage: "https://images.unsplash.com/photo-1601432093209-8af1fd74b054?q=80&w=1200&auto=format&fit=crop",
    stylingTip: "Drape the second dupatta diagonally across the shoulder with heirloom kundan choker.",
    itemRefs: [
      {
        productId: "prem-eth-02",
        role: "primary",
        label: "Maharani Velvet Embroidered Lehenga",
      },
      {
        productId: "x-leh-02",
        role: "secondary",
        label: "Flared Velvet Gown Duo",
      },
      {
        productId: "wl-eth-02",
        role: "accessory",
        label: "Mirror-Work Artisanal Stole",
      },
    ],
  },
  {
    id: "look-04",
    title: "Liquid Silk Midnight Drape",
    tagline: "Pure bias-cut mulberry silk with sensual fluid lines.",
    season: "Black Tie Soirée",
    brand: "WISHLIST",
    category: "Western",
    occasion: "Gala & Red Carpet",
    heroImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop",
    stylingTip: "Keep accessories ultra-minimal: diamond ear cuffs and sleek stiletto sandals.",
    itemRefs: [
      {
        productId: "prem-west-02",
        role: "primary",
        label: "Liquid Silk Draped Evening Gown",
      },
      {
        productId: "wl-west-02",
        role: "secondary",
        label: "Metallic Party Mini Shrug",
      },
    ],
  },
  {
    id: "look-05",
    title: "Botanical Chiffon Pre-Draped",
    tagline: "Modern effortless saree styling with contemporary corset fit.",
    season: "Destination Wedding",
    brand: "WISHLIST PREMIUM",
    category: "Ethnic",
    occasion: "Mehendi & Sunlit Brunch",
    heroImage: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop",
    stylingTip: "Pre-pleated for zero-fuss wear in 30 seconds; pair with fresh floral hair accents.",
    itemRefs: [
      {
        productId: "wl-eth-01",
        role: "primary",
        label: "Chiffon Pre-Stitched Saree with Corset",
      },
      {
        productId: "x-sar-03",
        role: "secondary",
        label: "Blush Chiffon Second Drape",
      },
    ],
  },
  {
    id: "look-06",
    title: "Cyber Denim & Structured Trench",
    tagline: "Streetwear luxury merging Japanese raw denim with tailored wool.",
    season: "Off-Duty Runway",
    brand: "WISHLIST",
    category: "Western",
    occasion: "Casual & Travel",
    heroImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop",
    stylingTip: "Cinch the belt high at the natural waist with chunky combat sole loafers.",
    itemRefs: [
      {
        productId: "prem-west-01",
        role: "primary",
        label: "Architectural Wool Tailored Trench",
      },
      {
        productId: "wl-west-01",
        role: "secondary",
        label: "Corset & Wide-Leg Denim Co-ord",
      },
    ],
  },
  {
    id: "look-07",
    title: "Zari Sharara Golden Hour",
    tagline: "Mirror-work luminescence crafted for festive celebrations.",
    season: "Festive Joy '26",
    brand: "WISHLIST PREMIUM",
    category: "Ethnic",
    occasion: "Diwali & Festive",
    heroImage: "https://images.unsplash.com/photo-1760287363878-1a09af715b80?q=80&w=1200&auto=format&fit=crop",
    stylingTip: "Style with antique silver chandbalis and embroidered raw-silk juttis.",
    itemRefs: [
      {
        productId: "wl-eth-02",
        role: "primary",
        label: "Zari Mirror-Work Kurta & Sharara",
      },
      {
        productId: "prem-eth-01",
        role: "secondary",
        label: "Pure Zari Metallic Stole",
      },
    ],
  },
];
