"use client";

import React, { useLayoutEffect, useRef } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";

const TEXT =
  "Two labels, one wardrobe. WISHLIST for Western wear made for the days you want to be seen, and WISHLIST PREMIUM for ethnic wear made for the ones you want remembered.";

/** Words light up from faint to ink as the section scrolls through. */
export default function Statement() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const words = gsap.utils.toArray<HTMLElement>(".st-word", root.current);
      gsap.fromTo(
        words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
            end: "bottom 55%",
            scrub: true,
          },
        }
      );
    }, root);
    return () => mm.revert();
  }, []);

  return (
    <section
      id="house"
      ref={root}
      className="px-4 sm:px-8 py-12 md:py-16 max-w-[1600px] mx-auto grid md:grid-cols-[1fr_3fr] gap-4 md:gap-10 items-start border-b border-ink/10"
    >
      <p className="text-[11px] tracking-[0.35em] uppercase text-raspberry font-semibold md:pt-2">The house</p>
      <p className="font-display text-[1.65rem] sm:text-3xl lg:text-[2.4rem] leading-[1.15] tracking-tight max-w-[34ch] md:max-w-4xl">
        {TEXT.split(" ").map((w, i) => (
          <span key={i} className="st-word inline-block mr-[0.26em]">
            {w}
          </span>
        ))}
      </p>
    </section>
  );
}
