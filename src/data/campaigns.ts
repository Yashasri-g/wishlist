import { CampaignStory } from "@/types";

export const CAMPAIGNS: CampaignStory[] = [
  {
    id: "camp-01",
    title: "Siren in Silk",
    subtitle: "WISHLIST PREMIUM COUTURE 2026",
    tagline: "Architectural draping meets imperial Indian craftsmanship.",
    brand: "WISHLIST PREMIUM",
    heroImage:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop",
    accentColor: "#D4AF37",
    season: "AUTUMN / WINTER COUTURE",
    featuredProductIds: ["prem-eth-01", "prem-eth-03", "prem-west-02"],
  },
  {
    id: "camp-02",
    title: "Midnight Velvet & Metal",
    subtitle: "GEN Z TREND EDIT",
    tagline: "Subversive tailoring for the fearless modern woman.",
    brand: "WISHLIST",
    heroImage:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop",
    accentColor: "#121212",
    season: "PRE-SPRING 2026",
    featuredProductIds: ["wl-west-01", "wl-west-02", "wl-eth-01"],
  },
  {
    id: "camp-03",
    title: "The Heritage Modernist",
    subtitle: "ETHNIC REIMAGINED",
    tagline: "Instant pre-stitched drapes and corset blouses designed to move.",
    brand: "WISHLIST",
    heroImage:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop",
    accentColor: "#C5A059",
    season: "FESTIVE SPOTLIGHT",
    featuredProductIds: ["wl-eth-01", "wl-eth-02", "wl-eth-03"],
  },
];

export const INSTAGRAM_POSTS = [
  {
    id: "ig-01",
    imageUrl:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop",
    handle: "@the_wishlist_premium",
    caption:
      "Golden hour in our hand-loomed Chanderi Silk Saree. Luxury in every fold. #WishlistPremium #Couture",
    likes: "4.2k",
    taggedProductId: "prem-eth-01",
  },
  {
    id: "ig-02",
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    handle: "@the_wishlist_81",
    caption:
      "Denim on denim with silver hardware. Viral corset co-ord in stock now! #WishlistFashion #GenZStyle",
    likes: "8.9k",
    taggedProductId: "wl-west-01",
  },
  {
    id: "ig-03",
    imageUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop",
    handle: "@the_wishlist_premium",
    caption:
      "Sharp lines. Italian virgin wool trench coat from the Autumn campaign. #WishlistPremium",
    likes: "3.5k",
    taggedProductId: "prem-west-01",
  },
  {
    id: "ig-04",
    imageUrl:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    handle: "@the_wishlist_81",
    caption:
      "Ready in 60 seconds with our Pre-Stitched Chiffon Saree & Corset. #WishlistEthnic",
    likes: "12.1k",
    taggedProductId: "wl-eth-01",
  },
];
