"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { useShop } from "@/context/ShopContext";
import { IMG } from "@/data/site";

/** Two brand "doors". On desktop the hovered/focused door grows; on mobile they stack. */
export default function BrandDoors() {
  const root = useRef<HTMLElement>(null);
  const { setBrandMode } = useShop();

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(".door", {
        clipPath: "inset(12% 12% 12% 12%)",
        opacity: 0,
        duration: 1.4,
        ease: "expo.out",
        stagger: 0.18,
        scrollTrigger: { trigger: root.current, start: "top 78%" },
      });
      gsap.from(".door-img", {
        scale: 1.25,
        duration: 1.8,
        ease: "expo.out",
        stagger: 0.18,
        scrollTrigger: { trigger: root.current, start: "top 78%" },
      });
    }, root);
    return () => mm.revert();
  }, []);

  const doorBase =
    "door group relative overflow-hidden flex flex-col justify-between p-6 md:p-10 min-h-[520px] lg:min-h-[78vh] lg:flex-1 lg:hover:flex-[1.55] lg:focus-within:flex-[1.55] transition-[flex] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]";

  return (
    <section ref={root} aria-label="Our two labels" className="px-4 sm:px-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
        {/* WISHLIST */}
        <Link
          href="/wishlist"
          onClick={() => setBrandMode("WISHLIST")}
          className={`${doorBase} bg-raspberry text-ivory`}
        >
          <Image
            src={IMG.doorWishlist}
            alt="WISHLIST — Western look (placeholder imagery)"
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="door-img object-cover object-top mix-blend-multiply opacity-80 transition-transform duration-[1400ms] ease-out group-hover:scale-105"
          />
          <div className="relative flex justify-between text-[11px] tracking-[0.3em] uppercase">
            <span>Label 01</span>
            <span>Western</span>
          </div>
          <div className="relative">
            <h3 className="font-display italic text-6xl md:text-8xl leading-[0.9]">Wishlist</h3>
            <p className="mt-4 max-w-xs text-sm text-ivory/85">
              Contemporary, trend-led Western wear.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] uppercase border-b border-current pb-1">
              Enter <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </div>
        </Link>

        {/* PREMIUM */}
        <Link
          href="/wishlist-premium"
          onClick={() => setBrandMode("WISHLIST PREMIUM")}
          className={`${doorBase} bg-ink text-ivory`}
        >
          <Image
            src={IMG.doorPremium}
            alt="WISHLIST PREMIUM — ethnic look (placeholder imagery)"
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="door-img object-cover object-top opacity-60 transition-transform duration-[1400ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          <div className="relative flex justify-between text-[11px] tracking-[0.3em] uppercase text-gold">
            <span>Label 02</span>
            <span>Ethnic</span>
          </div>
          <div className="relative">
            <h3 className="font-display text-6xl md:text-8xl leading-[0.9]">
              Wishlist <span className="italic text-gold">Premium</span>
            </h3>
            <p className="mt-4 max-w-xs text-sm text-ivory/80">
              Elevated ethnic wear: sarees, lehengas and more.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] uppercase text-gold border-b border-current pb-1">
              Enter <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
