"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { useShop } from "@/context/ShopContext";
import { flyToTarget } from "@/lib/fly";
import { gsap } from "@/lib/gsap";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/**
 * Product card used by every row and grid.
 * Hover: second photo fades in, quick-add sizes slide up. Heart + bag fly to the header.
 */
export default function ProductTile({
  product,
  priority = false,
  sizes = "(max-width: 640px) 46vw, (max-width: 1024px) 28vw, 18vw",
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
}) {
  const { toggleWishlist, isWishlisted, addToCart } = useShop();
  const imgBox = useRef<HTMLDivElement>(null);
  const heart = useRef<HTMLButtonElement>(null);
  const [quick, setQuick] = useState(false);
  const saved = isWishlisted(product.id);
  const premium = product.brand === "WISHLIST PREMIUM";
  const second = product.images[1];

  const onHeart = (e: React.MouseEvent) => {
    e.preventDefault();
    const adding = !saved;
    toggleWishlist(product.id);
    if (heart.current)
      gsap.fromTo(heart.current, { scale: 0.6 }, { scale: 1, duration: 0.7, ease: "elastic.out(1.1, 0.4)" });
    if (adding) flyToTarget(imgBox.current, product.images[0], "wishlist");
  };

  const add = (size: string) => {
    addToCart(product, size, product.colors[0], 1);
    flyToTarget(imgBox.current, product.images[0], "cart");
    setQuick(false);
  };

  const badge = !product.inStock
    ? { t: "Sold out", c: "bg-ink text-ivory" }
    : product.isNew
    ? { t: "New", c: "bg-ivory text-ink" }
    : product.discountPercent
    ? { t: `${product.discountPercent}% off`, c: "bg-raspberry text-white" }
    : product.isBestseller
    ? { t: "Best seller", c: "bg-ivory text-ink" }
    : null;

  return (
    <article className="group relative">
      <div ref={imgBox} className="relative aspect-[3/4] overflow-hidden bg-sand">
        <Link href={`/product/${product.id}`} className="absolute inset-0 block" aria-label={product.name} draggable={false}>
          <Image
            src={product.images[0]}
            alt={`${product.name} (placeholder imagery)`}
            fill
            sizes={sizes}
            priority={priority}
            draggable={false}
            className="object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          />
          {second && (
            <Image
              src={second}
              alt=""
              fill
              sizes={sizes}
              draggable={false}
              className="object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </Link>

        {badge && (
          <span className={`absolute left-2 top-2 z-10 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] ${badge.c}`}>
            {badge.t}
          </span>
        )}

        <button
          ref={heart}
          type="button"
          onClick={onHeart}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={saved}
          className={`absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-colors ${
            saved ? "bg-raspberry text-white" : "bg-white/85 text-ink hover:bg-white"
          }`}
        >
          <Heart className={`h-[18px] w-[18px] ${saved ? "fill-current" : ""}`} />
        </button>

        {/* quick add */}
        {product.inStock && (
          <>
            <button
              type="button"
              onClick={() => (product.sizes.length === 1 ? add(product.sizes[0]) : setQuick((q) => !q))}
              aria-label="Quick add to bag"
              className="absolute bottom-2 right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-ivory transition-colors hover:bg-raspberry md:hidden"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
            <div
              className={`absolute inset-x-0 bottom-0 z-10 bg-white/95 px-3 py-3 backdrop-blur transition-transform duration-500 ease-out ${
                quick ? "translate-y-0" : "translate-y-full md:group-hover:translate-y-0"
              }`}
            >
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-ink/60">Quick add · select size</p>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => add(s)}
                    className="min-w-9 border border-ink/25 px-2 py-1.5 text-[11px] font-medium transition-colors hover:border-ink hover:bg-ink hover:text-ivory"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="pt-3">
        <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${premium ? "text-gold" : "text-raspberry"}`}>
          {premium ? "Premium" : "Wishlist"} <span className="text-ink/35">·</span>{" "}
          <span className="text-ink/50">{product.subcategory}</span>
        </p>
        <Link href={`/product/${product.id}`} className="mt-1 line-clamp-1 text-[15px] font-medium leading-snug hover:text-raspberry transition-colors" draggable={false}>
          {product.name}
        </Link>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <span className="text-sm font-semibold">{inr(product.price)}</span>
          {product.originalPrice && <span className="text-xs text-ink/45 line-through">{inr(product.originalPrice)}</span>}
          {product.discountPercent ? <span className="text-xs font-semibold text-raspberry">{product.discountPercent}% off</span> : null}
        </div>
        {product.colors.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5" aria-label="Colours">
            {product.colors.slice(0, 4).map((c) => (
              <span key={c.name} title={c.name} className="h-3 w-3 rounded-full ring-1 ring-ink/20" style={{ background: c.hex }} />
            ))}
            {product.colors.length > 4 && <span className="text-[10px] text-ink/50">+{product.colors.length - 4}</span>}
          </div>
        )}
      </div>
    </article>
  );
}
