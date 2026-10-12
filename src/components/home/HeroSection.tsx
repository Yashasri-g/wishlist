"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Play } from "lucide-react";
import { useShop } from "@/context/ShopContext";

const HERO_SLIDES = [
  {
    id: 1,
    title: "Siren in Silk",
    subtitle: "WISHLIST PREMIUM AUTUMN / WINTER 2026",
    tagline: "Imperial Indian weaves meet razor-sharp contemporary drapes.",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1800&auto=format&fit=crop",
    brand: "WISHLIST PREMIUM",
    ctaLink: "/wishlist-premium",
    ctaText: "Discover Couture Collection",
    badge: "AUTUMN COUTURE",
  },
  {
    id: 2,
    title: "Cyber Velvet & Metal",
    subtitle: "WISHLIST VIRAL GEN Z DROP",
    tagline: "Subversive corsets, metallic cut-outs & oversized street denim.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1800&auto=format&fit=crop",
    brand: "WISHLIST",
    ctaLink: "/wishlist",
    ctaText: "Explore Gen Z Edit",
    badge: "NEW ARRIVALS",
  },
  {
    id: 3,
    title: "Instant Pre-Stitched Drapes",
    subtitle: "ETHNIC FASHION REIMAGINED",
    tagline: "Ready-to-wear chiffon sarees & embroidered bustier corsets.",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1800&auto=format&fit=crop",
    brand: "WISHLIST",
    ctaLink: "/wishlist?cat=Ethnic",
    ctaText: "Shop Ethnic Trends",
    badge: "FESTIVE SPOTLIGHT",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setBrandMode } = useShop();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative w-full h-[78vh] min-h-[560px] sm:h-[85vh] bg-[#0D0D0E] text-white overflow-hidden flex flex-col justify-between">
      {/* Background Slides with Motion Reveal */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top filter brightness-[0.75]"
          />
          {/* Subtle Dark Editorial Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0E] via-[#0D0D0E]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0E]/80 via-transparent to-[#0D0D0E]/40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 flex items-center justify-end text-[11px] tracking-[0.25em] uppercase font-medium text-white/80">
        <span>0{currentSlide + 1}</span>
        <span className="mx-2 text-white/40">/</span>
        <span className="text-white/40">0{HERO_SLIDES.length}</span>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-end">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl space-y-4"
          >
            {/* Category Tag */}
            <div className="inline-flex items-center gap-2 text-[#E8D8B5] text-[11px] font-medium tracking-[0.3em] uppercase">
              <span>{slide.badge}</span>
              <span>•</span>
              <span className="text-white">{slide.brand}</span>
            </div>

            {/* Oversized Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-8xl font-medium tracking-tight text-white leading-[1]">
              {slide.title}
            </h1>

            {/* Subtitle / Tagline */}
            <p className="text-sm sm:text-lg text-white/90 font-sans font-light tracking-wide max-w-xl leading-relaxed">
              {slide.tagline}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href={slide.ctaLink}
                onClick={() => {
                  if (slide.brand === "WISHLIST PREMIUM") setBrandMode("WISHLIST PREMIUM");
                  else setBrandMode("WISHLIST");
                }}
                className="bg-white hover:bg-[#F2EFE9] text-[#121212] font-semibold text-[11px] uppercase tracking-[0.22em] px-8 py-4 rounded-none flex items-center gap-3 transition-transform active:scale-95"
              >
                <span>{slide.ctaText}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <a
                href="#reels"
                className="text-white border border-white/50 hover:bg-white/10 font-medium text-[11px] uppercase tracking-[0.22em] px-6 py-4 rounded-none flex items-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Campaign Reel</span>
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Carousel Controls & Indicator Lines */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8 flex items-center justify-between border-t border-white/10 pt-4">
        <div className="flex gap-3">
          {HERO_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className="group py-2 flex flex-col items-start gap-1"
            >
              <div
                className={`h-0.5 rounded-full transition-all duration-500 ${
                  currentSlide === idx
                    ? "w-16 bg-[#B8975A]"
                    : "w-8 bg-white/30 group-hover:bg-white/60"
                }`}
              />
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/50 group-hover:text-white transition-colors">
                {s.brand}
              </span>
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/60">
          <span>Scroll to Explore</span>
          <div className="w-4 h-4 border border-white/40 rounded-full flex items-center justify-center animate-bounce">
            ↓
          </div>
        </div>
      </div>
    </section>
  );
}
