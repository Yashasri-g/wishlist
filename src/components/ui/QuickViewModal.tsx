"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { X, Star, Heart, ShoppingBag, Check, ShieldCheck, Truck } from "lucide-react";

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isWishlisted } = useShop();

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);

  const isSaved = isWishlisted(product.id);

  return (
    <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] dark:bg-[#121212] text-[#121212] dark:text-white rounded-sm overflow-hidden shadow-none border border-[#B8975A]/30 max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 dark:bg-black/80 hover:bg-[#B8975A] hover:text-black transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Gallery */}
        <div className="w-full md:w-1/2 bg-[#F2EFE9] dark:bg-[#1A1A1A] p-4 flex flex-col justify-between">
          <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden mb-4">
            <Image
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover object-top"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-14 h-16 rounded-sm overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? "border-[#B8975A] scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="Thumb" fill className="object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] tracking-[0.2em] font-bold uppercase px-2 py-0.5 rounded bg-[#121212] text-white dark:bg-white dark:text-black">
                {product.brand}
              </span>
              <span className="text-xs text-[#888]">{product.subcategory}</span>
            </div>

            <h2 className="font-serif text-2xl md:text-3xl font-medium mb-3 tracking-wide">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-sans text-2xl font-bold">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#888] line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              {product.discountPercent && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 px-2 py-0.5 rounded">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#666] dark:text-[#AAA] leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Colors */}
            <div className="mb-4">
              <label className="block text-xs uppercase font-bold tracking-widest text-[#888] mb-2">
                Color: {selectedColor.name}
              </label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform ${
                      selectedColor.name === color.name
                        ? "border-[#B8975A] scale-110 shadow"
                        : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase font-bold tracking-widest text-[#888]">
                  Select Size
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-xs font-bold rounded-sm border transition-all ${
                      selectedSize === size
                        ? "border-[#B8975A] bg-[#B8975A] text-black shadow-md"
                        : "border-[#E3DDD3] dark:border-[#333] hover:border-[#121212] dark:hover:border-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-4 mb-6">
              <label className="text-xs uppercase font-bold tracking-widest text-[#888]">
                Quantity
              </label>
              <div className="flex items-center border border-[#E3DDD3] dark:border-[#333] rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-[#E3DDD3] dark:border-[#222]">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  addToCart(product, selectedSize, selectedColor, quantity);
                  setQuickViewProduct(null);
                }}
                className="flex-1 bg-[#121212] dark:bg-white text-white dark:text-black font-semibold text-xs uppercase tracking-widest py-3.5 px-4 rounded-sm flex items-center justify-center gap-2 hover:bg-[#B8975A] dark:hover:bg-[#B8975A] hover:text-black transition-colors shadow-none"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag • ₹{(product.price * quantity).toLocaleString("en-IN")}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-sm border transition-colors ${
                  isSaved
                    ? "bg-[#B8975A] border-[#B8975A] text-black"
                    : "border-[#E3DDD3] dark:border-[#333] hover:border-[#121212]"
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isSaved ? "fill-black" : ""}`} />
              </button>
            </div>

            <Link
              href={`/product/${product.id}`}
              onClick={() => setQuickViewProduct(null)}
              className="block text-center text-xs uppercase tracking-widest font-semibold text-[#888] hover:text-[#B8975A] transition-colors py-1"
            >
              View Full Product Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
