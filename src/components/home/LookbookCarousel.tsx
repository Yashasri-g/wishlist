"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CAMPAIGNS } from "@/data/campaigns";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

export default function LookbookCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevCampaign = () => {
    setActiveIndex((prev) => (prev === 0 ? CAMPAIGNS.length - 1 : prev - 1));
  };

  const nextCampaign = () => {
    setActiveIndex((prev) => (prev + 1) % CAMPAIGNS.length);
  };

  const campaign = CAMPAIGNS[activeIndex];

  return (
    <section id="lookbook" className="py-20 bg-[#0F0F10] text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#333] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#B8975A] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Editorial Campaign Lookbook</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-white">
              Motion & High-Fashion Art Direction
            </h2>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button
              onClick={prevCampaign}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-[#B8975A] flex items-center justify-center text-white hover:text-[#B8975A] transition-colors"
              aria-label="Previous Lookbook Story"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextCampaign}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-[#B8975A] flex items-center justify-center text-white hover:text-[#B8975A] transition-colors"
              aria-label="Next Lookbook Story"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Campaign Hero Story Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#18181A] rounded-sm p-6 sm:p-10 border border-[#B8975A]/30 shadow-none">
          {/* Image */}
          <div className="lg:col-span-7 relative aspect-[4/3] rounded-sm overflow-hidden shadow-none">
            <Image
              src={campaign.heroImage}
              alt={campaign.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-top filter contrast-[1.08]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-sm text-[10px] uppercase font-bold tracking-widest text-[#B8975A] border border-[#B8975A]/40">
              {campaign.season}
            </div>
          </div>

          {/* Text & Story Details */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase font-bold tracking-[0.3em] text-[#B8975A]">
              {campaign.subtitle}
            </span>

            <h3 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-white leading-tight">
              {campaign.title}
            </h3>

            <p className="font-serif italic text-lg sm:text-xl text-[#DDD] leading-relaxed border-l-2 border-[#B8975A] pl-4">
              "{campaign.tagline}"
            </p>

            <div className="pt-4 space-y-3">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[#888] block">
                Brand Identity
              </span>
              <div className="inline-block bg-[#B8975A]/10 text-[#B8975A] border border-[#B8975A]/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                {campaign.brand}
              </div>
            </div>

            <div className="pt-4">
              <Link
                href={
                  campaign.brand === "WISHLIST PREMIUM"
                    ? "/wishlist-premium"
                    : "/wishlist"
                }
                className="inline-flex items-center gap-3 bg-[#B8975A] hover:bg-white text-black font-semibold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-sm shadow-xl transition-all"
              >
                <span>Shop Campaign Edit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
