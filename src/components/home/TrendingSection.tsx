"use client";

import React, { useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { PRODUCTS } from "@/data/products";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TrendingSection() {
  const [activeTab, setActiveTab] = useState<
    "ALL" | "WISHLIST" | "WISHLIST PREMIUM" | "Ethnic" | "Western"
  >("ALL");

  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "WISHLIST") return p.brand === "WISHLIST";
    if (activeTab === "WISHLIST PREMIUM") return p.brand === "WISHLIST PREMIUM";
    if (activeTab === "Ethnic") return p.category === "Ethnic";
    if (activeTab === "Western") return p.category === "Western";
    return true;
  }).slice(0, 8);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#B8975A] mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Curated Fashion Edits</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-wide">
            Trending & New Arrivals
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-[#E3DDD3]/40 dark:bg-[#1A1A1A] rounded-sm border border-[#E3DDD3]/60 dark:border-[#333]">
          {(
            [
              { id: "ALL", label: "All Items" },
              { id: "WISHLIST", label: "WISHLIST Trends" },
              { id: "WISHLIST PREMIUM", label: "PREMIUM Couture" },
              { id: "Ethnic", label: "Ethnic Edit" },
              { id: "Western", label: "Western Edit" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all ${
                activeTab === tab.id
                  ? "bg-[#121212] text-white dark:bg-white dark:text-black shadow"
                  : "text-[#666] dark:text-[#AAA] hover:text-[#121212] dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {filteredProducts.map((product, idx) => (
          <ProductCard key={product.id} product={product} priority={idx < 4} />
        ))}
      </div>

      {/* View Full Collection Button */}
      <div className="text-center pt-12">
        <Link
          href="/wishlist"
          className="inline-flex items-center gap-3 bg-[#121212] dark:bg-white text-white dark:text-black font-semibold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-sm hover:bg-[#B8975A] dark:hover:bg-[#B8975A] hover:text-black transition-colors shadow-none"
        >
          <span>Discover Entire Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
