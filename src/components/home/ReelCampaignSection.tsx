"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { PRODUCTS } from "@/data/products";
import {
  Heart,
  ShoppingBag,
  Volume2,
  VolumeX,
  Sparkles,
  Share2,
  ChevronUp,
  ChevronDown,
  Check,
} from "lucide-react";

const REEL_STORIES = [
  {
    id: "reel-01",
    handle: "@the_wishlist_premium",
    audioTrack: "Siren in Silk • Original Runway Audio",
    likes: "14.8k",
    comments: "342",
    shares: "1.2k",
    badge: "COUTURE REEL",
    videoBg:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
    productId: "prem-eth-01",
    tagline: "Royal Heritage Chanderi Silk Saree with Zardozi Work",
  },
  {
    id: "reel-02",
    handle: "@the_wishlist_81",
    audioTrack: "Viral Denim Drop • Gen Z Beats",
    likes: "28.4k",
    comments: "890",
    shares: "3.4k",
    badge: "VIRAL DROP",
    videoBg:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    productId: "wl-west-01",
    tagline: "Cyber Corset & Wide-Leg Denim Co-ord Set",
  },
  {
    id: "reel-03",
    handle: "@the_wishlist_81",
    audioTrack: "60-Sec Instant Saree • Festive House",
    likes: "32.1k",
    comments: "1.1k",
    shares: "5.8k",
    badge: "INSTANT DRAWER",
    videoBg:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
    productId: "wl-eth-01",
    tagline: "Botanical Pre-Stitched Chiffon Saree + Corset",
  },
];

export default function ReelCampaignSection() {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  const { setQuickViewProduct, showToast } = useShop();
  const currentReel = REEL_STORIES[activeReelIndex];
  const taggedProduct = PRODUCTS.find((p) => p.id === currentReel.productId);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReelIndex((prev) => (prev + 1) % REEL_STORIES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleDoubleTap = () => {
    setLikedReels((prev) => ({ ...prev, [currentReel.id]: true }));
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 1000);
  };

  const toggleLike = () => {
    const nextState = !likedReels[currentReel.id];
    setLikedReels((prev) => ({ ...prev, [currentReel.id]: nextState }));
    if (nextState) showToast("Liked Reel story!");
  };

  return (
    <section className="py-20 bg-[#0A090B] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6B1E36]/20 border border-[#6B1E36]/50 text-[#E9D3D8] text-[10px] font-bold tracking-[0.3em] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#A33A5C] animate-pulse" />
            <span>Interactive Fashion Reel</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-wide">
            Runway in Motion
          </h2>

          <p className="text-xs sm:text-sm text-[#AAA]">
            Experience our viral Instagram campaign reels. Tap to inspect product tags or double-tap to like.
          </p>
        </div>

        {/* Main Reel Viewer Container */}
        <div className="max-w-md mx-auto relative aspect-[9/16] rounded-sm overflow-hidden shadow-none border-2 border-[#6B1E36]/40 bg-[#121212] select-none">
          {/* Background Media */}
          <div className="relative w-full h-full" onDoubleClick={handleDoubleTap}>
            <Image
              src={currentReel.videoBg}
              alt={currentReel.tagline}
              fill
              priority
              sizes="500px"
              className="object-cover filter contrast-[1.08]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
          </div>

          {/* Top Story Progress Bars */}
          <div className="absolute top-3 inset-x-3 z-30 flex gap-1.5">
            {REEL_STORIES.map((r, idx) => (
              <button
                key={r.id}
                onClick={() => setActiveReelIndex(idx)}
                className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden"
              >
                <div
                  className={`h-full bg-white transition-all duration-300 ${
                    idx === activeReelIndex ? "w-full" : idx < activeReelIndex ? "w-full" : "w-0"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Top Info Bar */}
          <div className="absolute top-7 inset-x-4 z-30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6B1E36] to-[#B8975A] p-0.5 flex items-center justify-center">
                <span className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold">
                  W
                </span>
              </span>
              <div>
                <span className="text-xs font-bold tracking-wider block text-white">
                  {currentReel.handle}
                </span>
                <span className="text-[9px] text-[#E9D3D8] font-semibold uppercase tracking-widest">
                  {currentReel.badge}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Double Tap Heart Explosion Overlay */}
          {showHeartAnim && (
            <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none animate-in zoom-in fade-in duration-300">
              <Heart className="w-24 h-24 text-[#A33A5C] fill-[#A33A5C] drop-shadow-none animate-ping" />
            </div>
          )}

          {/* Right Action Bar (Instagram Reel Style) */}
          <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-5">
            {/* Like */}
            <button
              onClick={toggleLike}
              className="group flex flex-col items-center gap-1"
            >
              <div
                className={`w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                  likedReels[currentReel.id]
                    ? "bg-[#6B1E36] text-white scale-110 shadow-none"
                    : "bg-black/50 text-white hover:bg-black/80"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    likedReels[currentReel.id] ? "fill-white" : ""
                  }`}
                />
              </div>
              <span className="text-[10px] font-bold text-white shadow">
                {currentReel.likes}
              </span>
            </button>

            {/* Share */}
            <button
              onClick={() => showToast("Reel link copied to clipboard!")}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-white shadow">
                {currentReel.shares}
              </span>
            </button>

            {/* Next / Prev Nav */}
            <div className="flex flex-col gap-1 pt-2">
              <button
                onClick={() =>
                  setActiveReelIndex(
                    (activeReelIndex - 1 + REEL_STORIES.length) % REEL_STORIES.length
                  )
                }
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setActiveReelIndex((activeReelIndex + 1) % REEL_STORIES.length)
                }
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Caption & Product Tag Bar */}
          <div className="absolute bottom-4 inset-x-4 z-30 space-y-3">
            <p className="text-xs text-white/90 font-sans font-medium line-clamp-2 drop-shadow">
              {currentReel.tagline}
            </p>

            {/* Audio Ticker */}
            <div className="flex items-center gap-2 text-[10px] text-white/70">
              <span className="animate-spin-slow">♫</span>
              <span className="truncate">{currentReel.audioTrack}</span>
            </div>

            {/* Tagged Product CTA Button */}
            {taggedProduct && (
              <button
                onClick={() => setQuickViewProduct(taggedProduct)}
                className="w-full bg-[#6B1E36] hover:bg-[#852A48] text-white font-semibold text-xs uppercase tracking-wider py-3 rounded-sm flex items-center justify-center gap-2 shadow-none transition-transform active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Outfit • ₹{taggedProduct.price.toLocaleString("en-IN")}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
