"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  X,
  Check,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { CURATED_LOOKS, CuratedLook, CuratedLookItemRef } from "@/data/curated-looks";
import { CATALOG, shopHref } from "@/data/taxonomy";
import { useShop } from "@/context/ShopContext";
import { Product } from "@/types";

export default function CuratedLooksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedLook, setSelectedLook] = useState<CuratedLook | null>(null);

  const count = CURATED_LOOKS.length;

  const nextLook = useCallback(() => {
    if (count <= 1) return;
    setActiveIndex((prev) => (prev + 1) % count);
  }, [count]);

  const prevLook = useCallback(() => {
    if (count <= 1) return;
    setActiveIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Touch swipe handling
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) prevLook();
      else nextLook();
    }
    touchStartX.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedLook) return; // ignore if modal is open
      if (e.key === "ArrowLeft") prevLook();
      if (e.key === "ArrowRight") nextLook();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevLook, nextLook, selectedLook]);

  return (
    <section
      id="new-arrivals"
      className="relative select-none"
      aria-label="New arrivals"
    >
      {/* Site-standard section heading */}
      <div className="mx-auto flex max-w-[1800px] items-end justify-between gap-4 px-4 sm:px-8 mb-6 md:mb-8">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-raspberry">
            Just landed
          </p>
          <h2 className="overflow-hidden pb-1 font-display text-[1.9rem] font-medium leading-[1.05] tracking-tight sm:text-4xl md:text-[2.8rem]">
            New arrivals
          </h2>
        </div>
        <Link
          href={shopHref({ col: "new" })}
          className="group/all mb-1 inline-flex shrink-0 items-center gap-2 border-b border-ink pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors hover:text-raspberry hover:border-raspberry"
        >
          See all
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/all:translate-x-1" />
        </Link>
      </div>

      <div className="relative mx-auto max-w-[1800px] px-4 sm:px-8">

        {/* 3D Coverflow Carousel Stage */}
        <div
          className="relative mx-auto flex h-[520px] sm:h-[580px] md:h-[640px] items-center justify-center select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={prevLook}
            aria-label="Previous curated look"
            className="absolute left-2 sm:left-6 z-40 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/95 text-ink shadow-[0_10px_25px_rgba(20,17,15,0.18)] border border-ink/10 transition-all duration-300 hover:scale-110 hover:bg-raspberry hover:text-white hover:border-raspberry active:scale-95"
          >
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>

          <button
            type="button"
            onClick={nextLook}
            aria-label="Next curated look"
            className="absolute right-2 sm:right-6 z-40 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/95 text-ink shadow-[0_10px_25px_rgba(20,17,15,0.18)] border border-ink/10 transition-all duration-300 hover:scale-110 hover:bg-raspberry hover:text-white hover:border-raspberry active:scale-95"
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>

          {/* Render Cards in 5-Position Perspective */}
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
            {CURATED_LOOKS.map((look, i) => {
              // Calculate circular relative distance to active card
              let dist = i - activeIndex;
              if (dist > count / 2) dist -= count;
              if (dist < -count / 2) dist += count;

              // Only render visible cards within window [-2, 2]
              const isVisible = Math.abs(dist) <= 2;
              if (!isVisible) return null;

              const isActive = dist === 0;

              // Styles based on offset
              let transformClass = "translate-x-0 scale-100 z-30 opacity-100";
              let cardHeight = "h-[470px] sm:h-[530px] md:h-[590px]";
              const cardWidth = "w-[290px] sm:w-[350px] md:w-[390px] lg:w-[420px]";

              if (dist === -1) {
                transformClass =
                  "-translate-x-[68%] sm:-translate-x-[75%] md:-translate-x-[82%] scale-[0.88] z-20 opacity-85 hover:opacity-100 cursor-pointer";
                cardHeight = "h-[420px] sm:h-[480px] md:h-[530px]";
              } else if (dist === 1) {
                transformClass =
                  "translate-x-[68%] sm:translate-x-[75%] md:translate-x-[82%] scale-[0.88] z-20 opacity-85 hover:opacity-100 cursor-pointer";
                cardHeight = "h-[420px] sm:h-[480px] md:h-[530px]";
              } else if (dist === -2) {
                transformClass =
                  "-translate-x-[130%] sm:-translate-x-[145%] md:-translate-x-[155%] scale-[0.75] z-10 opacity-45 hover:opacity-75 cursor-pointer";
                cardHeight = "h-[360px] sm:h-[420px] md:h-[460px]";
              } else if (dist === 2) {
                transformClass =
                  "translate-x-[130%] sm:translate-x-[145%] md:translate-x-[155%] scale-[0.75] z-10 opacity-45 hover:opacity-75 cursor-pointer";
                cardHeight = "h-[360px] sm:h-[420px] md:h-[460px]";
              }

              return (
                <div
                  key={look.id}
                  onClick={() => {
                    if (isActive) {
                      setSelectedLook(look);
                    } else {
                      setActiveIndex(i);
                    }
                  }}
                  className={`group absolute transition-all duration-500 ease-out will-change-transform ${transformClass} ${cardWidth} ${cardHeight}`}
                  style={{ transformOrigin: "center center" }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${look.title} - ${look.tagline}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      if (isActive) setSelectedLook(look);
                      else setActiveIndex(i);
                    }
                  }}
                >
                  <div
                    className={`relative h-full w-full overflow-hidden rounded-2xl bg-sand transition-shadow duration-500 ${
                      isActive
                        ? "shadow-[0_25px_50px_-12px_rgba(20,17,15,0.32)] ring-1 ring-black/10"
                        : "shadow-md hover:shadow-xl"
                    }`}
                  >
                    {/* Background Image */}
                    <Image
                      src={look.heroImage}
                      alt={look.title}
                      fill
                      sizes="(max-width: 640px) 300px, (max-width: 1024px) 400px, 440px"
                      priority={isActive}
                      className={`object-cover object-top transition-transform duration-700 ease-out ${
                        isActive ? "group-hover:scale-105" : ""
                      }`}
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md shadow-sm ${
                          look.brand === "WISHLIST PREMIUM"
                            ? "bg-ink/80 text-gold border border-gold/40"
                            : "bg-white/90 text-raspberry border border-raspberry/20"
                        }`}
                      >
                        {look.brand}
                      </span>
                      <span className="rounded-full bg-ink/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                        {look.season}
                      </span>
                    </div>

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Bottom Metadata & Floating "Shop All" Button */}
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white z-10 flex flex-col items-center text-center">
                      <p className="text-[10px] uppercase font-semibold tracking-[0.28em] text-white/75 mb-1">
                        {look.occasion}
                      </p>

                      <h3 className="font-display text-xl sm:text-2xl italic leading-tight text-white line-clamp-1 mb-1">
                        {look.title}
                      </h3>

                      <p className="text-xs text-white/80 line-clamp-1 max-w-[90%] mb-4 hidden sm:block">
                        {look.tagline}
                      </p>

                      {/* Pantaloons-Style Floating Pill Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLook(look);
                        }}
                        className="mt-1 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-ink shadow-lg transition-all duration-300 hover:bg-raspberry hover:text-white hover:scale-105 hover:shadow-xl active:scale-95"
                        aria-label={`Shop All pieces for ${look.title}`}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>Shop All</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Indicators / Pagination Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {CURATED_LOOKS.map((look, idx) => (
            <button
              key={look.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Jump to look ${idx + 1}`}
              className={`h-2 transition-all duration-300 rounded-full ${
                activeIndex === idx
                  ? "w-8 bg-raspberry"
                  : "w-2 bg-ink/20 hover:bg-ink/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Interactive "Shop This Look" Modal / Drawer */}
      {selectedLook && (
        <CuratedLookModal
          look={selectedLook}
          onClose={() => setSelectedLook(null)}
        />
      )}
    </section>
  );
}

/**
 * Slide-over / Modal for the selected Curated Look
 * Shows full ensemble imagery + itemized list of all products in this look with 1-click Add to Bag
 */
function CuratedLookModal({
  look,
  onClose,
}: {
  look: CuratedLook;
  onClose: () => void;
}) {
  const { addToCart, setIsCartOpen } = useShop();

  // Resolve products from catalog
  const resolvedItems = useMemo(() => {
    return look.itemRefs
      .map((ref) => {
        const prod = CATALOG.find((p) => p.id === ref.productId);
        return {
          ...ref,
          product: prod,
        };
      })
      .filter((item): item is CuratedLookItemRef & { product: Product } => !!item.product);
  }, [look]);

  // Selected sizes for each item
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    resolvedItems.forEach((it) => {
      map[it.product.id] = it.product.sizes[0] || "M";
    });
    return map;
  });

  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [addedAll, setAddedAll] = useState(false);

  // Total ensemble price
  const totalLookPrice = useMemo(() => {
    return resolvedItems.reduce((acc, it) => acc + it.product.price, 0);
  }, [resolvedItems]);

  const handleAddSingleItem = (product: Product) => {
    const size = selectedSizes[product.id] || product.sizes[0] || "M";
    addToCart(product, size, product.colors[0], 1);
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const handleAddEntireLook = () => {
    resolvedItems.forEach((it) => {
      const size = selectedSizes[it.product.id] || it.product.sizes[0] || "M";
      addToCart(it.product, size, it.product.colors[0], 1);
    });
    setAddedAll(true);
    setTimeout(() => {
      setAddedAll(false);
      setIsCartOpen(true);
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Shop Look: ${look.title}`}
    >
      <div
        className="relative flex flex-col md:flex-row w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-2xl bg-ivory text-ink shadow-2xl border border-ink/15"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-md transition-colors hover:bg-raspberry hover:text-white"
          aria-label="Close look details"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Column: Full Editorial Photo & Story */}
        <div className="relative md:w-[42%] shrink-0 h-[260px] md:h-auto min-h-[300px] bg-sand">
          <Image
            src={look.heroImage}
            alt={look.title}
            fill
            sizes="(max-width: 768px) 100vw, 42vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white mb-2">
              {look.brand}
            </span>
            <h3 className="font-display text-2xl italic text-white leading-tight">
              {look.title}
            </h3>
            <p className="mt-1 text-xs text-white/80 line-clamp-2">
              {look.stylingTip}
            </p>
          </div>
        </div>

        {/* Right Column: Complete Look Products Breakdown */}
        <div className="flex flex-1 flex-col overflow-y-auto p-5 sm:p-8">
          <div className="border-b border-ink/10 pb-4 mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-raspberry">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Complete Outfit Styling ({resolvedItems.length} Pieces)</span>
            </div>
            <h4 className="font-display text-2xl sm:text-3xl italic mt-1 text-ink">
              Shop This Curated Look
            </h4>
            <p className="text-xs text-ink/70 mt-1">
              Select your sizes and add individual pieces or purchase the complete matching ensemble.
            </p>
          </div>

          {/* List of Outfitted Items */}
          <div className="space-y-4 flex-1">
            {resolvedItems.map((item) => {
              const prod = item.product;
              const isAdded = addedItems[prod.id];
              const selectedSize = selectedSizes[prod.id] || prod.sizes[0] || "M";

              return (
                <div
                  key={prod.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-ink/10 bg-white p-3.5 shadow-sm transition-all hover:border-ink/25"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-sand border border-ink/10">
                      <Image
                        src={prod.images[0]}
                        alt={prod.name}
                        fill
                        sizes="64px"
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                        {item.label}
                      </span>
                      <Link
                        href={`/product/${prod.id}`}
                        onClick={onClose}
                        className="block font-semibold text-sm text-ink hover:text-raspberry transition-colors line-clamp-1"
                      >
                        {prod.name}
                      </Link>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-semibold text-sm text-ink">
                          ₹{prod.price.toLocaleString("en-IN")}
                        </span>
                        {prod.originalPrice && (
                          <span className="text-xs text-ink/40 line-through">
                            ₹{prod.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                        {prod.discountPercent && (
                          <span className="text-[10px] font-bold text-raspberry">
                            {prod.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Size Selector & Add to Bag */}
                  <div className="flex items-center gap-2.5 sm:self-center">
                    {prod.sizes.length > 1 && (
                      <select
                        value={selectedSize}
                        onChange={(e) =>
                          setSelectedSizes((prev) => ({
                            ...prev,
                            [prod.id]: e.target.value,
                          }))
                        }
                        className="rounded-lg border border-ink/20 bg-ivory px-2.5 py-1.5 text-xs font-semibold text-ink outline-none focus:border-raspberry"
                      >
                        {prod.sizes.map((s: string) => (
                          <option key={s} value={s}>
                            Size {s}
                          </option>
                        ))}
                      </select>
                    )}

                    <button
                      type="button"
                      onClick={() => handleAddSingleItem(prod)}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                        isAdded
                          ? "bg-emerald-700 text-white"
                          : "bg-ink text-ivory hover:bg-raspberry"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>Add Piece</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Actions Bar */}
          <div className="mt-6 border-t border-ink/15 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink/60">
                Complete Ensemble Value
              </span>
              <span className="font-display text-2xl sm:text-3xl font-semibold text-raspberry">
                ₹{totalLookPrice.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddEntireLook}
              className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] transition-all duration-300 shadow-md ${
                addedAll
                  ? "bg-emerald-700 text-white scale-105"
                  : "bg-raspberry text-white hover:bg-ink hover:scale-102"
              }`}
            >
              {addedAll ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Entire Look Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>Buy Complete Look ({resolvedItems.length} Pieces)</span>
                </>
              )}
            </button>
          </div>

          {/* Guarantees */}
          <div className="mt-4 flex items-center justify-center gap-6 text-[11px] text-ink/50 border-t border-ink/5 pt-3">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-gold" /> 100% Authentic Fabric
            </span>
            <span className="inline-flex items-center gap-1">
              <RotateCcw className="h-3.5 w-3.5 text-gold" /> Easy 7-Day Returns
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
