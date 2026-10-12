"use client";

import React from "react";
import Image from "next/image";
import { INSTAGRAM_POSTS } from "@/data/campaigns";
import { PRODUCTS } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import { Heart, ShoppingBag } from "lucide-react";

export default function InstagramGrid() {
  const { setQuickViewProduct } = useShop();

  return (
    <section className="py-16 md:py-24 bg-[#FAF8F5] dark:bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#B8975A] mb-2">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>As Seen On Instagram</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-wide text-[#121212] dark:text-white">
            @the_wishlist_premium & @the_wishlist_81
          </h2>
          <p className="text-xs sm:text-sm text-[#666] dark:text-[#AAA] mt-2">
            Tag your runway & street looks for a chance to be featured in our official gallery.
          </p>
        </div>

        {/* 4 Photo Social Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INSTAGRAM_POSTS.map((post) => {
            const taggedProduct = PRODUCTS.find((p) => p.id === post.taggedProductId);

            return (
              <div
                key={post.id}
                className="group relative aspect-[4/5] rounded-sm overflow-hidden bg-[#1A1A1A] border border-[#E3DDD3] dark:border-[#222] shadow-xl"
              >
                <Image
                  src={post.imageUrl}
                  alt={post.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 text-white" />

                {/* Always visible handle pill */}
                <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                  {post.handle}
                </div>

                {/* Hover Content Overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#B8975A] font-bold">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{post.likes} likes</span>
                  </div>

                  <p className="text-xs text-white/90 line-clamp-2 leading-relaxed font-sans">
                    {post.caption}
                  </p>

                  {taggedProduct && (
                    <button
                      onClick={() => setQuickViewProduct(taggedProduct)}
                      className="w-full bg-[#B8975A] hover:bg-[#B8975A] text-black font-semibold text-xs uppercase tracking-wider py-2.5 rounded-sm flex items-center justify-center gap-2 transition-colors shadow-none"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Shop Look • ₹{taggedProduct.price.toLocaleString("en-IN")}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
