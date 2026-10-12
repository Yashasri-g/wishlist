"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useShop } from "@/context/ShopContext";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { toggleWishlist, isWishlisted, addToCart, setQuickViewProduct } = useShop();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const isSaved = isWishlisted(product.id);
  const isPremium = product.brand === "WISHLIST PREMIUM";

  return (
    <div className="group relative flex flex-col bg-transparent">
      {/* Image Container */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2EFE9] dark:bg-[#1A1A1A]"
        onMouseEnter={() => {
          if (product.images.length > 1) setCurrentImageIndex(1);
        }}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <Image
            src={product.images[currentImageIndex] || product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isPremium ? (
            <span className="inline-flex items-center gap-1 bg-[#121212] text-[#E8D8B5] text-[9px] font-medium tracking-[0.18em] px-2.5 py-1 uppercase">
              <span>PREMIUM</span>
            </span>
          ) : (
            <span className="inline-flex items-center bg-white text-[#121212] text-[9px] font-medium tracking-[0.18em] px-2.5 py-1 uppercase">
              WISHLIST
            </span>
          )}

          {product.badge && (
            <span className="inline-flex items-center bg-[#6B1E36] text-white text-[9px] font-medium tracking-[0.18em] px-2.5 py-1 uppercase">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
            isSaved
              ? "bg-[#6B1E36] text-white shadow-none scale-110"
              : "bg-white/80 dark:bg-black/60 text-[#121212] dark:text-white hover:bg-white hover:scale-110"
          }`}
          aria-label={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
        >
          <Heart className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
        </button>

        {/* Floating Quick Action Overlay Bar */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setQuickViewProduct(product)}
            className="flex-1 bg-white/90 dark:bg-black/90 text-xs font-semibold py-2.5 px-3 rounded-sm backdrop-blur-md text-current hover:bg-[#121212] hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center gap-1.5 shadow-none"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          <button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="bg-[#B8975A] hover:bg-[#B8975A] text-black p-2.5 rounded-sm shadow-none transition-transform active:scale-95"
            aria-label="Quick Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Size Picker Modal Overlay */}
        {showQuickAdd && (
          <div className="absolute inset-x-0 bottom-0 bg-[#121212]/95 backdrop-blur-md p-4 text-white z-20 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#B8975A]">
                Select Size & Add
              </span>
              <button
                onClick={() => setShowQuickAdd(false)}
                className="text-xs text-[#888] hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-2.5 py-1 text-xs font-bold rounded border transition-colors ${
                    selectedSize === size
                      ? "border-[#B8975A] bg-[#B8975A] text-black"
                      : "border-[#444] hover:border-white text-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                addToCart(product, selectedSize, product.colors[0]);
                setShowQuickAdd(false);
              }}
              className="w-full bg-[#B8975A] hover:bg-[#B8975A] text-black text-xs font-bold py-2 rounded uppercase tracking-wider transition-colors"
            >
              Add {selectedSize} to Bag
            </button>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="pt-4 pb-2 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#777] mb-1">
            <span className="uppercase tracking-widest font-semibold">
              {product.subcategory}
            </span>
            <div className="flex items-center gap-1 text-[#B8975A]">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating}</span>
            </div>
          </div>

          <Link
            href={`/product/${product.id}`}
            className="font-serif text-lg md:text-xl font-medium text-current hover:text-[#B8975A] transition-colors line-clamp-1 mb-2"
          >
            {product.name}
          </Link>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-sm font-semibold text-current">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#888888] line-through font-light">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {product.discountPercent && (
            <span className="text-[10px] font-semibold tracking-wider text-[#6B1E36]">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
