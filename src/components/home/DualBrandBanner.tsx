"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { Sparkles, ArrowRight, Zap, Gem } from "lucide-react";

export default function DualBrandBanner() {
  const { setBrandMode } = useShop();

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B8975A] block mb-2">
          Two Distinct Brand Universes
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#121212] dark:text-white mb-4">
          One Cohesive Ecosystem
        </h2>
        <p className="text-xs sm:text-sm text-[#666] dark:text-[#AAA] leading-relaxed">
          From viral Gen Z street trends to hand-loomed heritage couture, explore the two fashion houses of WISHLIST.
        </p>
      </div>

      {/* Dual Interactive Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CARD 1: WISHLIST (Contemporary / Youthful) */}
        <div className="group relative rounded-sm overflow-hidden bg-[#121212] text-white p-8 md:p-12 min-h-[460px] flex flex-col justify-between shadow-none border border-[#6B1E36]/40">
          {/* Background Image */}
          <Image
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
            alt="WISHLIST Contemporary"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-top opacity-40 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Top Label */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 bg-[#6B1E36]/30 backdrop-blur-md border border-[#6B1E36]/60 text-[#E9D3D8] text-[10px] font-bold tracking-[0.2em] px-3.5 py-1.5 rounded-full uppercase">
              <Zap className="w-3.5 h-3.5 text-[#A33A5C]" />
              <span>YOUTH & TREND-LED</span>
            </span>
            <span className="text-xs font-mono text-[#E9D3D8]">01</span>
          </div>

          {/* Bottom Content */}
          <div className="relative z-10 space-y-4 pt-20">
            <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-widest text-white block">
              WISHLIST
            </span>
            <p className="text-xs sm:text-sm text-white/80 font-sans font-light leading-relaxed max-w-md">
              Expressive, viral, trend-focused fashion. Boned denim corsets, asymmetric cut-outs, sculpted blazers, and ready-to-wear 60-second chiffons.
            </p>

            <Link
              href="/wishlist"
              onClick={() => setBrandMode("WISHLIST")}
              className="inline-flex items-center gap-3 bg-[#6B1E36] hover:bg-[#852A48] text-white font-semibold text-xs uppercase tracking-[0.2em] px-6 py-3.5 rounded-sm shadow-none transition-all hover:gap-4"
            >
              <span>Explore WISHLIST Drop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* CARD 2: WISHLIST PREMIUM (Elevated Luxury Couture) */}
        <div className="group relative rounded-sm overflow-hidden bg-[#0F0F10] text-[#B8975A] p-8 md:p-12 min-h-[460px] flex flex-col justify-between shadow-none border border-[#B8975A]/30">
          {/* Background Image */}
          <Image
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop"
            alt="WISHLIST PREMIUM"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-top opacity-40 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F10] via-[#0F0F10]/50 to-transparent" />

          {/* Top Label */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 bg-[#B8975A]/20 backdrop-blur-md border border-[#B8975A]/50 text-[#B8975A] text-[10px] font-bold tracking-[0.25em] px-3.5 py-1.5 rounded-full uppercase">
              <Gem className="w-3.5 h-3.5 text-[#B8975A]" />
              <span>HIGH-FASHION COUTURE</span>
            </span>
            <span className="text-xs font-mono text-[#B8975A]/60">02</span>
          </div>

          {/* Bottom Content */}
          <div className="relative z-10 space-y-4 pt-20">
            <div>
              <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-widest text-white block">
                WISHLIST
              </span>
              <span className="text-xs tracking-[0.4em] font-sans font-bold text-[#B8975A] uppercase block mt-1">
                P R E M I U M
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white/80 font-sans font-light leading-relaxed max-w-md">
              Elevated, luxury couture. Hand-loomed Chanderi silks, Maharani velvet lehengas, Italian virgin wool trench coats, and liquid Mulberry silk gowns.
            </p>

            <Link
              href="/wishlist-premium"
              onClick={() => setBrandMode("WISHLIST PREMIUM")}
              className="inline-flex items-center gap-3 bg-[#B8975A] hover:bg-white text-black font-semibold text-xs uppercase tracking-[0.2em] px-6 py-3.5 rounded-sm shadow-none transition-all hover:gap-4"
            >
              <span>Discover WISHLIST PREMIUM</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
