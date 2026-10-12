"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const CATEGORY_TILES = [
  {
    id: "ethnic-sarees",
    title: "Heritage & Instant Sarees",
    category: "Ethnic",
    subcategory: "Sarees",
    count: "14 Designs",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop",
    link: "/wishlist?cat=Ethnic&sub=Sarees",
    size: "col-span-1 md:col-span-2 lg:col-span-2 aspect-[16/9]",
  },
  {
    id: "western-coords",
    title: "Viral Co-ords & Corsets",
    category: "Western",
    subcategory: "Co-ords",
    count: "18 Styles",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    link: "/wishlist?cat=Western&sub=Co-ords",
    size: "col-span-1 aspect-[3/4]",
  },
  {
    id: "premium-lehengas",
    title: "Bridal & Couture Lehengas",
    category: "Ethnic",
    subcategory: "Lehengas",
    count: "8 Masterpieces",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop",
    link: "/wishlist-premium?cat=Ethnic&sub=Lehengas",
    size: "col-span-1 aspect-[3/4]",
  },
  {
    id: "western-outerwear",
    title: "Sculpted Suits & Outerwear",
    category: "Western",
    subcategory: "Outerwear & Jackets",
    count: "10 Pieces",
    image:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop",
    link: "/wishlist?cat=Western&sub=Outerwear",
    size: "col-span-1 md:col-span-2 lg:col-span-2 aspect-[16/9]",
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B8975A] block mb-2">
            Curated Category Edits
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-wide">
            Explore Western & Ethnic Silhouettes
          </h2>
        </div>
        <Link
          href="/wishlist"
          className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest text-[#121212] dark:text-white hover:text-[#B8975A] transition-colors flex items-center gap-1"
        >
          <span>View All Categories</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORY_TILES.map((tile) => (
          <Link
            key={tile.id}
            href={tile.link}
            className={`group relative rounded-sm overflow-hidden bg-[#121212] text-white flex flex-col justify-end p-6 md:p-8 shadow-xl border border-[#E3DDD3]/40 ${tile.size}`}
          >
            <Image
              src={tile.image}
              alt={tile.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-top opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            <div className="relative z-10 flex items-end justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#B8975A] block mb-1">
                  {tile.category} • {tile.count}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-wide text-white group-hover:text-[#B8975A] transition-colors">
                  {tile.title}
                </h3>
              </div>

              <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-[#B8975A] group-hover:text-black text-white backdrop-blur-md flex items-center justify-center transition-all duration-300 transform group-hover:rotate-45">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
