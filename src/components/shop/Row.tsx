"use client";

import React, { Children, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/gsap";

interface RowProps {
  title: string;
  eyebrow?: string;
  href?: string;
  hrefLabel?: string;
  children: React.ReactNode;
  /** Slowly runs by itself (loops). Pauses on hover / touch / drag. */
  auto?: boolean;
  /** Pixels per frame at 60fps when `auto`. */
  speed?: number;
  /** Big Top-10 style numerals behind each item. */
  ranked?: boolean;
  /** Tailwind width classes for each item. */
  itemClass?: string;
  /** Dark section (for premium rows). */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Netflix-style row: arrows on hover, drag to scroll, neighbours dim on hover, scroll progress,
 * stagger-in when scrolled into view, optional endless auto-run.
 */
export default function Row({
  title,
  eyebrow,
  href,
  hrefLabel = "View all",
  children,
  auto = false,
  speed = 0.45,
  ranked = false,
  itemClass = "w-[44vw] sm:w-[30vw] md:w-[22vw] lg:w-[17vw] xl:w-[15vw] 2xl:w-[14vw]",
  tone = "light",
  className = "",
}: RowProps) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const paused = useRef(false);
  const [edge, setEdge] = useState({ start: true, end: false });
  const dark = tone === "dark";

  const items = Children.toArray(children);
  const list = auto ? [...items, ...items] : items;

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = auto ? (el.scrollLeft % (el.scrollWidth / 2)) / (el.scrollWidth / 2) : max > 0 ? el.scrollLeft / max : 0;
    if (progress.current) progress.current.style.transform = `scaleX(${Math.max(0.04, Math.min(1, p || 0.04))})`;
    setEdge((prev) => {
      const next = { start: el.scrollLeft < 8, end: el.scrollLeft > max - 8 };
      return prev.start === next.start && prev.end === next.end ? prev : next;
    });
  }, [auto]);

  // entrance: title mask + items stagger in
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      gsap.set(q(".row-title-in"), { yPercent: 110 });
      gsap.set(q(".nf-item"), { y: 46, opacity: 0 });
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top 86%",
        once: true,
        onEnter: () => {
          gsap.to(q(".row-title-in"), { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 });
          gsap.to(q(".nf-item"), {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "expo.out",
            stagger: { each: 0.06, from: "start" },
            clearProps: "opacity,transform",
          });
        },
      });
      return () => st.kill();
    }, root);
    return () => mm.revert();
  }, []);

  // auto-run
  useEffect(() => {
    if (!auto) return;
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let pos = el.scrollLeft;
    let last = performance.now();
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    const step = (t: number) => {
      const dt = Math.min(40, t - last);
      last = t;
      if (visible && !paused.current) {
        const half = el.scrollWidth / 2;
        pos += (speed * dt) / 16.67;
        if (pos >= half) pos -= half;
        el.scrollLeft = pos;
      } else {
        pos = el.scrollLeft;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [auto, speed]);

  useEffect(() => {
    update();
  }, [update, items.length]);

  // drag to scroll (mouse); suppress the click that ends a drag
  const drag = useRef({ x: 0, left: 0, active: false });
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { x: e.clientX, left: track.current?.scrollLeft ?? 0, active: true };
    dragged.current = false;
    paused.current = true;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active || !track.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) {
      dragged.current = true;
      track.current.style.scrollSnapType = "none";
    }
    if (dragged.current) track.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    drag.current.active = false;
    if (track.current) track.current.style.scrollSnapType = "";
    setTimeout(() => (dragged.current = false), 0);
  };

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    paused.current = true;
    el.scrollBy({ left: dir * el.clientWidth * 0.82, behavior: "smooth" });
    window.setTimeout(() => (paused.current = false), 1600);
  };

  const arrow =
    "absolute top-[38%] z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[0_10px_30px_-8px_rgba(20,17,15,0.5)] transition-all duration-300 hover:bg-ink hover:text-ivory md:flex opacity-0 group-hover/row:opacity-100";

  return (
    <section ref={root} className={`nf-row group/row relative ${dark ? "dark-row bg-ink text-ivory" : ""} ${className}`} aria-label={title}>
      <div className="mx-auto flex max-w-[1800px] items-end justify-between gap-4 px-4 sm:px-8">
        <div>
          {eyebrow && (
            <p className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] ${dark ? "text-gold" : "text-raspberry"}`}>{eyebrow}</p>
          )}
          <h2 className="overflow-hidden pb-1 font-display text-[1.9rem] font-medium leading-[1.05] tracking-tight sm:text-4xl md:text-[2.8rem]">
            <span className="row-title-in inline-block">{title}</span>
          </h2>
        </div>
        {href && (
          <Link
            href={href}
            className={`group/all mb-1 inline-flex shrink-0 items-center gap-2 border-b pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
              dark ? "border-ivory/50 hover:text-gold hover:border-gold" : "border-ink hover:text-raspberry hover:border-raspberry"
            }`}
          >
            {hrefLabel}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/all:translate-x-1" />
          </Link>
        )}
      </div>

      <div className="relative mt-6 md:mt-8">
        {!edge.start && (
          <button type="button" aria-label="Scroll left" onClick={() => scrollBy(-1)} className={`${arrow} left-3`}>
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        {!edge.end && (
          <button type="button" aria-label="Scroll right" onClick={() => scrollBy(1)} className={`${arrow} right-3`}>
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        <div
          ref={track}
          onScroll={update}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={() => {
            endDrag();
            paused.current = false;
          }}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") paused.current = true;
          }}
          onTouchStart={() => (paused.current = true)}
          onTouchEnd={() => window.setTimeout(() => (paused.current = false), 2500)}
          onClickCapture={(e) => {
            if (dragged.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          className={`nf-track flex gap-3 overflow-x-auto scroll-pl-4 px-4 pb-4 sm:scroll-pl-8 sm:gap-4 sm:px-8 md:gap-5 ${auto ? "" : "snap-x snap-mandatory"} cursor-grab active:cursor-grabbing`}
          tabIndex={0}
          role="list"
          aria-label={`${title} — scroll horizontally`}
        >
          {list.map((child, i) => {
            const real = i % items.length;
            const dupe = auto && i >= items.length;
            return (
              <div
                key={i}
                role="listitem"
                aria-hidden={dupe || undefined}
                className={`nf-item shrink-0 ${auto ? "" : "snap-start"} ${itemClass} ${ranked ? "relative pl-[3.6rem] md:pl-[5rem]" : ""}`}
              >
                {ranked && (
                  <span aria-hidden="true" className={`rank-num pointer-events-none absolute left-0 top-[14%] text-[8rem] md:text-[11rem] ${dark ? "[-webkit-text-stroke-color:var(--color-gold)]" : ""}`}>
                    {real + 1}
                  </span>
                )}
                <div className="relative z-10">{child}</div>
              </div>
            );
          })}
        </div>

        {/* edge fades + progress */}
        <div aria-hidden="true" className={`pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r ${dark ? "from-ink" : "from-ivory"} to-transparent sm:w-12`} />
        <div aria-hidden="true" className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l ${dark ? "from-ink" : "from-ivory"} to-transparent sm:w-12`} />
      </div>
      <div className="mx-auto mt-1 max-w-[1800px] px-4 sm:px-8" aria-hidden="true">
        <div className={`h-[2px] w-full ${dark ? "bg-ivory/15" : "bg-ink/10"}`}>
          <div ref={progress} className={`h-full origin-left ${dark ? "bg-gold" : "bg-raspberry"}`} style={{ transform: "scaleX(0.04)" }} />
        </div>
      </div>
    </section>
  );
}
