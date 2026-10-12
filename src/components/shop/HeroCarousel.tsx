"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { img, PICK } from "@/data/images";
import { shopHref } from "@/data/taxonomy";

const DURATION = 6.5; // seconds per slide

interface Slide {
  key: string;
  eyebrow: string;
  title: string[]; // one entry per line
  copy: string;
  bg: string; // tailwind bg class
  ink: string; // tailwind text colour class
  accent: string;
  cta: { label: string; href: string };
  cta2: { label: string; href: string };
  images: [number, number, number];
}

const SLIDES: Slide[] = [
  {
    key: "wishlist",
    eyebrow: "WISHLIST · Western",
    title: ["Dress up.", "Show up."],
    copy: "Dresses, co-ords, blazers and denim, made for the days you want to be seen.",
    bg: "bg-blush",
    ink: "text-ink",
    accent: "text-raspberry",
    cta: { label: "Shop Western", href: "/wishlist" },
    cta2: { label: "Under ₹3,000", href: shopHref({ price: "u3" }) },
    images: [PICK.denimCoord, PICK.amethystDress, PICK.redBlazer],
  },
  {
    key: "wedding",
    eyebrow: "PREMIUM · Ethnic",
    title: ["The wedding", "edit."],
    copy: "Lehengas and bridal sets for the days you want remembered.",
    bg: "bg-ink",
    ink: "text-ivory",
    accent: "text-gold",
    cta: { label: "Shop Lehengas", href: shopHref({ cat: "Ethnic", sub: "Lehengas" }) },
    cta2: { label: "Wedding occasion", href: shopHref({ occ: "Wedding" }) },
    images: [PICK.bridalLehenga, PICK.marigoldLehenga, PICK.ivoryLehenga],
  },
  {
    key: "sarees",
    eyebrow: "PREMIUM · Sarees",
    title: ["Drape", "stories."],
    copy: "Silk, chiffon and georgette sarees, from everyday to festive.",
    bg: "bg-sand",
    ink: "text-ink",
    accent: "text-raspberry",
    cta: { label: "Shop Sarees", href: shopHref({ cat: "Ethnic", sub: "Sarees" }) },
    cta2: { label: "Silk edit", href: shopHref({ fab: "Silk" }) },
    images: [PICK.tealSaree, PICK.greenSaree, PICK.ivorySaree],
  },
  {
    key: "new",
    eyebrow: "Just in",
    title: ["New", "arrivals."],
    copy: "Fresh from both labels. Workwear, weekend dresses and festive sets.",
    bg: "bg-[#efe3d2]",
    ink: "text-ink",
    accent: "text-raspberry",
    cta: { label: "Shop New In", href: shopHref({ col: "new" }) },
    cta2: { label: "Best sellers", href: shopHref({ col: "best" }) },
    images: [PICK.shirtDress, PICK.beigeBlazer, PICK.floralCoord],
  },
];

/**
 * Home hero: a full-width carousel. Each slide has its own colour world; images wipe in under masks,
 * zoom slowly, and drift with the mouse. Autoplay uses the progress bars and pauses on hover / drag.
 */
export default function HeroCarousel() {
  const root = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const prevIdx = useRef(0);
  const progressTween = useRef<gsap.core.Tween | null>(null);
  const reduce = useRef(false);
  const hovering = useRef(false);
  const first = useRef(true);

  const go = useCallback((n: number) => setIdx((n + SLIDES.length) % SLIDES.length), []);

  // slide transition + autoplay
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const slides = el.querySelectorAll<HTMLElement>(".hs");
    const incoming = slides[idx];
    const outgoing = slides[prevIdx.current];

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(incoming);
      gsap.set(slides, { zIndex: 0 });
      gsap.set(incoming, { zIndex: 2, autoAlpha: 1 });
      if (outgoing && outgoing !== incoming) gsap.set(outgoing, { zIndex: 1 });

      if (reduce.current) {
        slides.forEach((s, i) => gsap.set(s, { autoAlpha: i === idx ? 1 : 0 }));
      } else {
        const tl = gsap.timeline({
          onComplete: () => {
            if (outgoing && outgoing !== incoming) gsap.set(outgoing, { autoAlpha: 0 });
          },
        });
        const delay = first.current ? 0.1 : 0;
        tl.fromTo(incoming, { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: first.current ? 0.01 : 1.15, ease: "expo.inOut" }, delay)
          .fromTo(q(".hs-title"), { yPercent: 115 }, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.1 }, delay + 0.45)
          .fromTo(q(".hs-fade"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.08 }, delay + 0.65)
          .fromTo(q(".hs-mask"), { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "expo.inOut", stagger: 0.14 }, delay + 0.3)
          .fromTo(q(".hs-img"), { scale: 1.4 }, { scale: 1.06, duration: 2, ease: "expo.out", stagger: 0.14 }, delay + 0.3)
          .to(q(".hs-img"), { scale: 1.16, duration: DURATION + 1, ease: "none" }, delay + 2.2);
        if (outgoing && outgoing !== incoming)
          gsap.to(outgoing.querySelectorAll(".hs-fade, .hs-title"), { opacity: 0, duration: 0.4, ease: "power2.in" });
      }
      first.current = false;

      // autoplay driven by the progress bar
      progressTween.current?.kill();
      const bars = el.querySelectorAll<HTMLElement>(".hs-bar");
      bars.forEach((b, i) => gsap.set(b, { scaleX: i < idx ? 1 : 0 }));
      if (!reduce.current) {
        progressTween.current = gsap.to(bars[idx], {
          scaleX: 1,
          duration: DURATION,
          ease: "none",
          onComplete: () => go(idx + 1),
        });
        if (hovering.current) progressTween.current.pause();
      }
    }, el);

    prevIdx.current = idx;
    return () => {
      ctx.revert();
    };
  }, [idx, go]);

  // pause on hover, drag to change slide, keyboard, mouse parallax
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const enter = () => {
      hovering.current = true;
      progressTween.current?.pause();
    };
    const leave = () => {
      hovering.current = false;
      progressTween.current?.play();
    };
    let startX = 0;
    let down = false;
    const pd = (e: PointerEvent) => {
      down = true;
      startX = e.clientX;
    };
    const pu = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 60) go(idx + (dx < 0 ? 1 : -1));
    };
    const key = (e: KeyboardEvent) => {
      if (!el.contains(document.activeElement)) return;
      if (e.key === "ArrowRight") go(idx + 1);
      if (e.key === "ArrowLeft") go(idx - 1);
    };

    let cleanupMove: (() => void) | undefined;
    if (!reduce.current && window.matchMedia("(pointer: fine)").matches) {
      const move = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        el.querySelectorAll<HTMLElement>(".hs:not([style*='visibility: hidden']) .hs-drift").forEach((n) => {
          const d = Number(n.dataset.depth ?? 1);
          gsap.to(n, { x: nx * -26 * d, y: ny * -18 * d, duration: 1.2, ease: "power3.out", overwrite: "auto" });
        });
      };
      el.addEventListener("pointermove", move);
      cleanupMove = () => el.removeEventListener("pointermove", move);
    }

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", pd);
    window.addEventListener("pointerup", pu);
    window.addEventListener("keydown", key);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", pd);
      window.removeEventListener("pointerup", pu);
      window.removeEventListener("keydown", key);
      cleanupMove?.();
    };
  }, [idx, go]);

  // initial (pre-hydration) state: only the first slide is visible
  const initialHidden = (i: number) => (i === 0 ? undefined : { visibility: "hidden" as const, opacity: 0 });

  return (
    <section ref={root} aria-roledescription="carousel" aria-label="Featured collections" className="relative isolate h-[clamp(580px,calc(100svh-9.5rem),780px)] overflow-hidden bg-ink">
      {SLIDES.map((s, i) => (
        <div
          key={s.key}
          className={`hs absolute inset-0 ${s.bg} ${s.ink}`}
          style={initialHidden(i)}
          aria-hidden={i !== idx}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${SLIDES.length}`}
        >
          <div className="relative mx-auto grid h-full max-w-[1800px] grid-rows-[auto_1fr] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:grid-rows-1">
            {/* copy */}
            <div className="relative z-10 flex flex-col justify-center px-5 pb-4 pt-10 sm:px-10 md:pb-0 md:pl-14 lg:pl-20">
              <p className={`hs-fade mb-4 text-[10px] font-semibold uppercase tracking-[0.34em] md:text-[11px] ${s.accent}`}>{s.eyebrow}</p>
              <h1 className="font-display text-[3.1rem] font-medium leading-[0.92] tracking-tight sm:text-7xl lg:text-[6.4rem]" aria-label={s.title.join(" ")}>
                {s.title.map((line, li) => (
                  <span key={li} aria-hidden="true" className="block overflow-hidden pb-[0.08em]">
                    <span className={`hs-title block ${li === s.title.length - 1 ? `italic ${s.accent}` : ""}`}>{line}</span>
                  </span>
                ))}
              </h1>
              <p className="hs-fade mt-5 max-w-[34ch] text-[15px] leading-relaxed opacity-80 md:text-base">{s.copy}</p>
              <div className="hs-fade mt-7 flex flex-wrap gap-3">
                <Link
                  href={s.cta.href}
                  className={`group inline-flex items-center gap-2 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-500 ${
                    s.bg === "bg-ink" ? "bg-gold text-ink hover:bg-ivory" : "bg-ink text-ivory hover:bg-raspberry"
                  }`}
                >
                  {s.cta.label}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={s.cta2.href}
                  className="inline-flex items-center gap-2 border border-current px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-500 hover:bg-current/10"
                >
                  {s.cta2.label}
                </Link>
              </div>
            </div>

            {/* images */}
            <div className="relative min-h-0">
              <div className="absolute inset-0 grid grid-cols-3 items-end gap-3 px-4 pb-14 sm:gap-5 sm:px-8 md:pb-20 md:pr-14 lg:gap-6 lg:pr-20">
                {s.images.map((n, k) => (
                  <div key={k} className={`hs-drift ${k === 1 ? "h-full pt-0 md:h-[96%]" : k === 0 ? "h-[78%] md:h-[78%]" : "h-[66%] md:h-[70%]"}`} data-depth={k === 1 ? 1.2 : k === 0 ? 0.7 : 1}>
                    <div className="hs-mask relative h-full w-full overflow-hidden bg-black/10">
                      <Image
                        src={img(n, 900)}
                        alt={`${s.eyebrow} (placeholder imagery)`}
                        fill
                        priority={i === 0}
                        sizes="(max-width: 768px) 30vw, 22vw"
                        className="hs-img object-cover object-top"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* controls */}
      <div className={`absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-4 px-5 pb-5 sm:px-10 md:pl-14 md:pr-14 lg:pl-20 lg:pr-20 ${SLIDES[idx].ink}`}>
        <div className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
          {SLIDES.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={i === idx}
              aria-label={`Show slide ${i + 1}: ${s.eyebrow}`}
              onClick={() => go(i)}
              className="group h-8 w-12 sm:w-16"
            >
              <span className="relative mt-3.5 block h-[3px] w-full overflow-hidden bg-current/20 transition-all group-hover:h-[5px] group-hover:mt-[13px]">
                <span className="hs-bar absolute inset-0 origin-left bg-raspberry" style={{ transform: i < idx ? "scaleX(1)" : "scaleX(0)" }} />
              </span>
            </button>
          ))}
        </div>
        <div className="relative z-10 flex items-center gap-2">
          <button type="button" onClick={() => go(idx - 1)} aria-label="Previous slide" className={`flex h-11 w-11 items-center justify-center rounded-full border border-current transition-colors ${SLIDES[idx].bg === "bg-ink" ? "hover:bg-ivory hover:text-ink" : "hover:bg-ink hover:text-ivory"}`}>
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => go(idx + 1)} aria-label="Next slide" className={`flex h-11 w-11 items-center justify-center rounded-full border border-current transition-colors ${SLIDES[idx].bg === "bg-ink" ? "hover:bg-ivory hover:text-ink" : "hover:bg-ink hover:text-ivory"}`}>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
