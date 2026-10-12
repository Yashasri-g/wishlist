"use client";

import React, { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, MOTION_OK_DESKTOP } from "@/lib/gsap";
import { PRODUCTS } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";

/**
 * Horizontal editorial rail.
 * Desktop (motion allowed): section pins and scroll drives the track sideways.
 * Mobile / reduced motion: a native, swipeable, snap-scrolling row.
 */
export default function NewArrivalsRail() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  const items = [...PRODUCTS].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew)).slice(0, 8);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK_DESKTOP, () => {
      const el = track.current;
      if (!el || !section.current) return;
      const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          pin: true,
          scrub: 0.8,
          start: "top top",
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, []);

  return (
    <section ref={section} aria-label="New arrivals" className="relative bg-ivory-deep py-20 md:py-0 md:h-screen md:flex md:items-center overflow-hidden">
      <div className="w-full">
        <div className="px-4 sm:px-8 max-w-[1600px] mx-auto flex items-end justify-between mb-8 md:mb-10">
          <div>
            <p className="text-[11px] tracking-[0.35em] uppercase text-raspberry font-semibold mb-3">Just in</p>
            <h2 className="font-display text-5xl md:text-7xl italic leading-none">New arrivals</h2>
          </div>
          <Link href="/wishlist" className="text-[11px] font-semibold tracking-[0.25em] uppercase border-b border-ink pb-1 hover:text-raspberry hover:border-raspberry transition-colors">
            Shop all
          </Link>
        </div>

        <div
          ref={track}
          className="flex gap-5 md:gap-8 px-4 sm:px-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none no-scrollbar will-change-transform"
          tabIndex={0}
          aria-label="Scrollable list of new arrivals"
        >
          {items.map((p, i) => (
            <div key={p.id} className="snap-start shrink-0 w-[68vw] sm:w-[42vw] md:w-[24vw] md:max-w-[380px]">
              <ProductCard product={p} priority={i < 3} />
            </div>
          ))}
          <div className="shrink-0 w-[8vw]" aria-hidden="true" />
        </div>

        <div className="hidden md:block px-8 max-w-[1600px] mx-auto mt-10" aria-hidden="true">
          <div className="h-px bg-ink/15">
            <div ref={bar} className="h-px bg-raspberry origin-left scale-x-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
