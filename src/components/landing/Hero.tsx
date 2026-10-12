"use client";

import React, { useCallback, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/gsap";
import { IMG } from "@/data/site";
import Preloader from "./Preloader";

const WORD = "WISHLIST".split("");

/** Layered campaign frames. depth drives mouse + scroll parallax strength. */
const FRAMES = [
  {
    key: "center",
    src: IMG.heroCenter,
    alt: "Model in a silk saree (placeholder imagery)",
    depth: 1,
    pos: "left-1/2 -translate-x-1/2 bottom-[27%] w-[44vw] md:left-[44%] xl:left-[31%] md:translate-x-0 md:bottom-[31%] md:w-[24vw] z-[12]",
    shape: "",
    label: "Premium · Ethnic",
  },
  {
    key: "left",
    src: IMG.heroLeft,
    alt: "Model in a draped ethnic look (placeholder imagery)",
    depth: 0.55,
    pos: "left-[3%] bottom-[24%] w-[30vw] md:left-auto md:right-[24%] xl:right-[31%] md:bottom-auto md:top-[6%] md:w-[15vw] z-[11]",
    shape: "rounded-t-[999px]",
    label: "Premium · Ethnic",
  },
  {
    key: "right",
    src: IMG.heroRight,
    alt: "Model in a contemporary Western look (placeholder imagery)",
    depth: 0.8,
    pos: "right-[3%] bottom-[30%] w-[28vw] md:right-[4%] xl:right-[5%] md:bottom-[29%] md:w-[19vw] z-[10]",
    shape: "",
    label: "WISHLIST · Western",
  },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const introTl = useRef<gsap.core.Timeline | null>(null);
  const ready = useRef(false); // preloader finished (may happen before the timeline exists)

  // Build everything once; the intro timeline is paused until the preloader finishes.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      { motion: MOTION_OK },
      (ctx) => {
        const { motion } = ctx.conditions as { motion: boolean };
        const q = gsap.utils.selector(root);

        if (!motion) {
          return;
        }

        // ── Intro timeline ──
        gsap.set(q(".h-letter"), { yPercent: 115 });
        gsap.set(q(".h-mask"), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(q(".h-img"), { scale: 1.4 });
        gsap.set(q(".h-fade"), { opacity: 0, y: 28 });
        gsap.set(q(".h-badge"), { scale: 0, rotate: -90 });

        const tl = gsap
          .timeline({ paused: true, defaults: { ease: "expo.out" } })
          .to(q(".h-mask"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, stagger: 0.16 }, 0)
          .to(q(".h-img"), { scale: 1, duration: 1.8, stagger: 0.16 }, 0)
          .to(q(".h-letter"), { yPercent: 0, duration: 1.4, stagger: 0.07 }, 0.25)
          .to(q(".h-fade"), { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 0.8)
          .to(q(".h-badge"), { scale: 1, rotate: 0, duration: 1.2, ease: "back.out(1.6)" }, 1.1);
        introTl.current = tl;
        if (ready.current) tl.play();

        // ── Scroll parallax (scroll layer only — mouse uses a different layer) ──
        q(".h-scroll").forEach((el) => {
          const depth = Number((el as HTMLElement).dataset.depth ?? 0.5);
          gsap.to(el, {
            yPercent: -18 * depth,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
          });
        });
        gsap.to(q(".h-word"), {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
        });

        // ── Mouse parallax (fine pointers only) ──
        const fine = window.matchMedia("(pointer: fine)").matches;
        let cleanupPointer: (() => void) | undefined;
        if (fine && root.current) {
          const movers = q(".h-mouse").map((el) => {
            const depth = Number((el as HTMLElement).dataset.depth ?? 0.5);
            return {
              depth,
              x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3.out" }),
              y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3.out" }),
            };
          });
          const wordX = gsap.quickTo(q(".h-word-mouse")[0], "x", { duration: 1.4, ease: "power3.out" });
          const onMove = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            movers.forEach((m) => {
              m.x(nx * 46 * m.depth);
              m.y(ny * 30 * m.depth);
            });
            wordX(nx * -40);
          };
          root.current.addEventListener("pointermove", onMove);
          const el = root.current;
          cleanupPointer = () => el.removeEventListener("pointermove", onMove);
        }

        return () => {
          cleanupPointer?.();
          introTl.current = null;
        };
      },
      root
    );

    return () => mm.revert();
  }, []);

  const start = useCallback(() => {
    ready.current = true;
    introTl.current?.play();
  }, []);

  return (
    <>
      <Preloader onDone={start} />

      <section
        ref={root}
        aria-label="Campaign"
        className="grain relative isolate overflow-hidden bg-ivory h-[calc(100svh-7.5rem)] min-h-[640px] max-h-[1000px]"
      >
        {/* Soft blush glow behind the frames */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[1000px] max-h-[1000px] rounded-full bg-blush/70 blur-3xl -z-10"
        />

        {/* Copy block */}
        <div className="relative z-30 px-4 sm:px-8 pt-8 md:pt-12 max-w-[1600px] mx-auto">
          <p className="h-fade text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-raspberry font-semibold mb-4">
            Two labels · One wardrobe
          </p>
          <h1 className="h-fade font-display italic text-[2.1rem] sm:text-5xl md:text-[2.9rem] lg:text-[3.6rem] xl:text-[4rem] leading-[0.98] max-w-[12ch] md:max-w-[11ch]">
            Dressed like it&apos;s already on your wishlist.
          </h1>
          <div className="h-fade mt-6 flex flex-wrap gap-3">
            <Link
              href="/wishlist"
              className="group inline-flex items-center gap-2 bg-ink text-ivory text-[11px] font-semibold tracking-[0.2em] uppercase px-5 md:px-7 py-3.5 hover:bg-raspberry transition-colors duration-500"
            >
              Shop WISHLIST
              <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/wishlist-premium"
              className="group inline-flex items-center gap-2 border border-ink text-ink text-[11px] font-semibold tracking-[0.2em] uppercase px-5 md:px-7 py-3.5 hover:bg-ink hover:text-gold transition-colors duration-500"
            >
              Shop Premium
              <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Rotating badge */}
        <Link
          href="/wishlist"
          aria-label="Shop the new season"
          className="h-badge absolute z-30 right-4 top-6 md:right-[4%] md:top-10 w-24 h-24 md:w-36 md:h-36 rounded-full bg-raspberry text-ivory flex items-center justify-center hover:bg-ink transition-colors duration-500"
        >
          <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full animate-spin-slow" aria-hidden="true">
            <defs>
              <path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
            </defs>
            <text fontSize="10.5" fill="currentColor" fontFamily="var(--font-jakarta)" fontWeight="600">
              <textPath href="#circ" textLength="283" lengthAdjust="spacing">NEW SEASON • SHOP NOW • NEW SEASON •</textPath>
            </text>
          </svg>
          <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8" />
        </Link>

        {/* Full-bleed masthead, masked per letter. Sits behind the frames, which only kiss its top edge. */}
        <div className="h-scroll absolute inset-x-0 bottom-0 z-[5] flex justify-center" data-depth="0.12">
          <div className="h-word-mouse w-full">
            <h2
              aria-label="Wishlist"
              className="h-word font-display font-medium leading-[0.82] tracking-[-0.02em] text-[21vw] text-ink whitespace-nowrap flex justify-center pb-[0.5vw]"
            >
              {WORD.map((ch, i) => (
                <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] px-[0.04em] -mx-[0.04em]">
                  <span className={`h-letter inline-block ${i === 0 ? "text-raspberry" : ""}`}>{ch}</span>
                </span>
              ))}
            </h2>
          </div>
        </div>

        {/* Layered image frames */}
        {FRAMES.map((f) => (
          <div key={f.key} className={`absolute z-10 ${f.pos}`}>
            <div className="h-scroll" data-depth={f.depth}>
              <div className="h-mouse" data-depth={f.depth}>
                <figure className="group relative">
                  <div className={`h-mask relative aspect-[3/4] overflow-hidden bg-sand ${f.shape}`}>
                    <Image
                      src={f.src}
                      alt={f.alt}
                      fill
                      priority
                      sizes="(max-width: 768px) 48vw, 26vw"
                      className="h-img object-cover object-top"
                    />
                  </div>

                </figure>
              </div>
            </div>
          </div>
        ))}

        {/* Scroll cue */}
        <div className="h-fade absolute z-20 left-4 sm:left-8 bottom-4 hidden md:flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-ink/60">
          <span className="block w-10 h-px bg-current" />
          Scroll
        </div>
      </section>
    </>
  );
}

// Keep ScrollTrigger refreshed after fonts/images settle so pinned sections below measure correctly.
if (typeof window !== "undefined") {
  window.addEventListener("load", () => ScrollTrigger.refresh());
}
