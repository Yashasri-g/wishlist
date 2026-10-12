"use client";

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { PRODUCTS } from "@/data/products";
import type { Product } from "@/types";
import Preloader from "./Preloader";
import { startPageTransition } from "@/components/layout/PageTransition";

const HEADLINE = "Dressed like it's already on your wishlist.".split(" ");

const RAIL_ITEMS = 6;
const CAPTION_H = 172; // px reserved at the bottom for the focused-piece caption

/** Alternate WISHLIST (Western) / PREMIUM (Ethnic), skipping repeated photos. */
function pickItems(): Product[] {
  const w = PRODUCTS.filter((p) => p.brand === "WISHLIST");
  const e = PRODUCTS.filter((p) => p.brand === "WISHLIST PREMIUM");
  const out: Product[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < Math.max(w.length, e.length); i++) {
    for (const p of [w[i], e[i]]) {
      if (p && !seen.has(p.images[0])) {
        seen.add(p.images[0]);
        out.push(p);
      }
    }
  }
  return out.slice(0, RAIL_ITEMS);
}

/** Give a hanging piece an impulse: it swings out, then settles like a pendulum. */
function kick(el: Element | null, deg: number, delay = 0) {
  if (!el) return;
  gsap.to(el, {
    keyframes: [
      { rotation: deg, duration: 0.2, ease: "power2.out" },
      { rotation: 0, duration: 1.8, ease: "elastic.out(1, 0.28)" },
    ],
    delay,
    overwrite: "auto",
  });
}

/** The bar shudders slightly when a hanger lands on it or slides along it. */
function tickRail(sec: HTMLElement | null) {
  const bar = sec?.querySelector(".rail-bar");
  if (bar) gsap.fromTo(bar, { y: 0 }, { y: 2.5, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.out", overwrite: "auto" });
}

function Hanger({ premium }: { premium: boolean }) {
  return (
    <svg
      viewBox="0 0 120 40"
      className={`relative z-10 block w-full h-auto drop-shadow-[0_5px_3px_rgba(20,17,15,0.22)] ${premium ? "text-gold" : "text-raspberry"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M60 17V12.5C60 6 69 5 69 10.5" />
      <path d="M60 17L9 35.5C5.5 36.8 6.5 38 9 38H111C113.5 38 114.5 36.8 111 35.5L60 17Z" />
      {/* specular highlight */}
      <path d="M58 19.5L14 35" stroke="white" strokeOpacity="0.55" strokeWidth="0.9" />
      <path d="M62 19.5L106 35" stroke="white" strokeOpacity="0.3" strokeWidth="0.9" />
    </svg>
  );
}

/**
 * Hero: a clothing rail. Pieces hang from hangers and sway; click one and it slides to the
 * centre while the rest blur away, with a caption and prev / next controls.
 * (Interaction inspired by the supplied reference reel; visuals are original.)
 */
export default function RailHero() {
  const items = useMemo(() => pickItems(), []);
  const root = useRef<HTMLElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLLIElement | null)[]>([]);
  const swayTweens = useRef<gsap.core.Tween[]>([]);
  const introTl = useRef<gsap.core.Timeline | null>(null);
  const ready = useRef(false);
  const [focus, setFocus] = useState<number | null>(null);
  const reduce = useRef(false);
  const focusRef = useRef<number | null>(null);
  const hoverRef = useRef<number | null>(null); // piece currently under the cursor

  const total = items.length;
  const active = focus !== null ? items[focus] : null;

  // ── Focus choreography ──
  const applyFocus = useCallback(
    (index: number | null) => {
      const sec = root.current;
      if (!sec) return;
      const dur = reduce.current ? 0 : 0.95;
      const secRect = sec.getBoundingClientRect();
      const secCenter = secRect.left + secRect.width / 2;

      const capDur = dur ? 0.6 : 0;
      const capDefault = sec.querySelector(".cap-default");
      const capFocus = sec.querySelector(".cap-focus");
      if (capDefault)
        gsap.to(capDefault, { opacity: index === null ? 1 : 0, y: index === null ? 0 : 24, duration: capDur, ease: "power3.out", overwrite: "auto" });
      if (capFocus)
        gsap.to(capFocus, { opacity: index === null ? 0 : 1, y: index === null ? 24 : 0, duration: capDur, ease: "power3.out", overwrite: "auto" });

      if (dur) gsap.delayedCall(dur * 0.5, () => tickRail(sec));

      cardEls.current.forEach((el, i) => {
        if (!el) return;
        const swing = el.querySelector(".swing");
        if (index === null) {
          if (dur) kick(swing, (i % 2 ? 1 : -1) * 3, i * 0.05);
          gsap.set(el, { zIndex: 1 });
          gsap.to(el, { x: 0, scale: 1, opacity: 1, filter: "blur(0px)", duration: dur, ease: "expo.out", overwrite: "auto" });
          swayTweens.current[i]?.play();
        } else if (i === index) {
          const curX = Number(gsap.getProperty(el, "x")) || 0;
          const curS = Number(gsap.getProperty(el, "scale")) || 1;
          const r = el.getBoundingClientRect();
          const baseW = r.width / curS;
          const baseCenter = r.left + r.width / 2 - curX;
          const baseH = r.height / curS;
          const room = secRect.height - 84 - CAPTION_H - 30;
          const s = Math.min(window.innerWidth < 768 ? 1.5 : 1.95, room / baseH);
          void baseW;
          gsap.set(el, { zIndex: 20 });
          // weight: the piece leans into its travel, then settles
          if (dur) kick(swing, Math.sign(secCenter - baseCenter || 1) * 10);
          gsap.to(el, { x: secCenter - baseCenter, scale: Math.max(1, s), opacity: 1, filter: "blur(0px)", duration: dur, ease: "expo.out", overwrite: "auto" });
          swayTweens.current[i]?.pause();
          const sway = el.querySelector(".sway");
          if (sway) gsap.to(sway, { rotation: 0, duration: dur ? 0.7 : 0, ease: "power3.out", overwrite: "auto" });
        } else {
          gsap.set(el, { zIndex: 1 });
          // neighbours get nudged away from the piece being pulled off the rail
          if (dur) kick(swing, Math.sign(i - index) * (8 / (1 + Math.abs(i - index) * 0.6)), 0.12);
          gsap.to(el, { x: 0, scale: 0.94, opacity: 0.16, filter: "blur(6px)", duration: dur, ease: "expo.out", overwrite: "auto" });
          swayTweens.current[i]?.play();
        }
      });
    },
    []
  );

  const open = useCallback((i: number) => setFocus(i), []);
  const close = useCallback(() => setFocus(null), []);
  const step = useCallback(
    (d: number) => setFocus((f) => (f === null ? 0 : (f + d + total) % total)),
    [total]
  );

  useEffect(() => {
    focusRef.current = focus;
    const label = root.current?.querySelector(".hero-cursor span");
    if (label && hoverRef.current !== null) label.textContent = focus === hoverRef.current ? "Close" : "View";
    applyFocus(focus);
    if (scroller.current) scroller.current.style.overflowX = focus === null ? "" : "hidden";
  }, [focus, applyFocus]);

  // Esc / arrow keys
  useEffect(() => {
    if (focus === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focus, close, step]);

  // Deep link: /?piece=3 opens that piece (also handy for QA)
  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get("piece"));
    if (!Number.isFinite(n) || n < 1 || n > total) return;
    const t = window.setTimeout(() => setFocus(n - 1), 2800);
    return () => window.clearTimeout(t);
  }, [total]);

  // ── Intro, idle sway, pointer "wind" ──
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    mm.add(MOTION_OK, () => {
      const cards = cardEls.current.filter(Boolean) as HTMLLIElement[];
      const q = gsap.utils.selector(root);

      gsap.set(cards, { yPercent: -130, opacity: 0, transformOrigin: "50% 0%" });
      gsap.set(q(".rail-bar"), { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(q(".rh-fade"), { opacity: 0, y: 24 });
      gsap.set(q(".hw"), { yPercent: 118 });
      gsap.set(q(".sway"), { transformOrigin: "50% 0%" });
      gsap.set(q(".swing"), { transformOrigin: "50% 0%", rotation: (i: number) => (i % 2 ? 1 : -1) * 13 });

      const tl = gsap
        .timeline({ paused: true })
        .to(q(".rail-bar"), { scaleX: 1, duration: 1.3, ease: "expo.out" }, 0)
        .to(cards, { yPercent: 0, opacity: 1, duration: 1.1, ease: "power3.out", stagger: 0.12 }, 0.35)
        .to(q(".swing"), { rotation: 0, duration: 2.6, ease: "elastic.out(1, 0.3)", stagger: 0.12 }, 0.8)
        .to(q(".hw"), { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.07 }, 1.05)
        .to(q(".rh-fade"), { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.1 }, 1.0);
      cards.forEach((_, i) => tl.add(() => tickRail(root.current), 1.1 + i * 0.12));
      introTl.current = tl;

      // a glint of light travels along the metal every few seconds
      const glint = gsap.fromTo(
        q(".rail-glint"),
        { xPercent: -120 },
        { xPercent: 1200, duration: 1.9, ease: "power2.inOut", repeat: -1, repeatDelay: 4.5, delay: 3.2 }
      );
      if (ready.current) tl.play();

      // slow-drifting colour blobs behind the rail
      const blobs = q(".blob").map((el, i) =>
        gsap.to(el, {
          x: (i % 2 ? -1 : 1) * 90,
          y: (i % 2 ? 1 : -1) * 60,
          scale: 1.18,
          duration: 9 + i * 2.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      );

      // idle sway, each hanger on its own phase so the rail feels alive
      swayTweens.current = q(".sway").map((el, i) =>
        gsap.fromTo(
          el,
          { rotation: -1.8 },
          { rotation: 1.8, duration: 2.6 + (i % 3) * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.25 }
        )
      );

      // pointer system (fine pointers only): brush-swing, "View" cursor, 3D tilt + glare, magnetic buttons
      let cleanup: (() => void) | undefined;
      if (window.matchMedia("(pointer: fine)").matches && root.current) {
        const sec = root.current;
        const lastKick: number[] = [];
        let lastX = 0;

        const bubble = q(".hero-cursor")[0] as HTMLElement | undefined;
        const bubbleLabel = bubble?.querySelector("span") ?? null;
        if (bubble) gsap.set(bubble, { scale: 0, opacity: 0 });
        const bx = bubble ? gsap.quickTo(bubble, "x", { duration: 0.45, ease: "power3.out" }) : null;
        const by = bubble ? gsap.quickTo(bubble, "y", { duration: 0.45, ease: "power3.out" }) : null;

        const magnets = (q(".magnet") as HTMLElement[]).map((el) => ({
          el,
          x: gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" }),
        }));

        const move = (e: PointerEvent) => {
          const sr = sec.getBoundingClientRect();
          bx?.(e.clientX - sr.left);
          by?.(e.clientY - sr.top);

          magnets.forEach((m) => {
            const r = m.el.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            const near = Math.hypot(dx, dy) < 110;
            m.x(near ? dx * 0.3 : 0);
            m.y(near ? dy * 0.3 : 0);
          });

          const vx = e.clientX - lastX;
          lastX = e.clientX;
          if (focusRef.current !== null || Math.abs(vx) < 6) return;
          const now = performance.now();
          cardEls.current.forEach((li, i) => {
            if (!li) return;
            const r = li.getBoundingClientRect();
            if (e.clientY < r.top - 30 || e.clientY > r.bottom) return;
            if (e.clientX < r.left - 10 || e.clientX > r.right + 10) return;
            if (now - (lastKick[i] ?? 0) < 500) return;
            lastKick[i] = now;
            kick(li.querySelector(".swing"), Math.max(-11, Math.min(11, vx * 0.5)));
          });
        };
        const leaveSection = () => {
          magnets.forEach((m) => {
            m.x(0);
            m.y(0);
          });
        };
        sec.addEventListener("pointermove", move);
        sec.addEventListener("pointerleave", leaveSection);

        // per-piece: cursor label + 3D tilt with a moving highlight
        const offs: Array<() => void> = [];
        (q(".sway") as HTMLElement[]).forEach((btn, i) => {
          const fig = btn.querySelector("figure") as HTMLElement | null;
          if (!fig) return;
          const enter = () => {
            hoverRef.current = i;
            if (bubbleLabel) bubbleLabel.textContent = focusRef.current === i ? "Close" : "View";
            if (bubble) gsap.to(bubble, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)", overwrite: "auto" });
          };
          const tilt = (e: PointerEvent) => {
            const r = fig.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(fig, { rotationY: px * 14, rotationX: -py * 14, transformPerspective: 700, duration: 0.45, ease: "power2.out", overwrite: "auto" });
            fig.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
            fig.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
          };
          const leave = () => {
            if (hoverRef.current === i) hoverRef.current = null;
            if (bubble) gsap.to(bubble, { scale: 0, opacity: 0, duration: 0.25, ease: "power2.in", overwrite: "auto" });
            gsap.to(fig, { rotationX: 0, rotationY: 0, duration: 0.9, ease: "elastic.out(1, 0.45)", overwrite: "auto" });
          };
          btn.addEventListener("pointerenter", enter);
          btn.addEventListener("pointermove", tilt);
          btn.addEventListener("pointerleave", leave);
          offs.push(() => {
            btn.removeEventListener("pointerenter", enter);
            btn.removeEventListener("pointermove", tilt);
            btn.removeEventListener("pointerleave", leave);
          });
        });

        cleanup = () => {
          sec.removeEventListener("pointermove", move);
          sec.removeEventListener("pointerleave", leaveSection);
          offs.forEach((f) => f());
        };
      }

      return () => {
        cleanup?.();
        glint.kill();
        blobs.forEach((b) => b.kill());
        swayTweens.current.forEach((t) => t.kill());
        swayTweens.current = [];
        introTl.current = null;
      };
    }, root);

    return () => mm.revert();
  }, []);

  const start = useCallback(() => {
    ready.current = true;
    introTl.current?.play();
  }, []);

  /** Hero → product: the focused photo grows to fill the screen, then the product page is revealed. */
  const goProduct = (e: React.MouseEvent) => {
    if (focus === null || !active || reduce.current) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const fig = cardEls.current[focus]?.querySelector("figure");
    if (!fig) return;
    e.preventDefault();
    const r = fig.getBoundingClientRect();
    startPageTransition({
      href: `/product/${active.id}`,
      src: active.images[0],
      rect: { left: r.left, top: r.top, width: r.width, height: r.height },
    });
  };

  const focused = focus !== null;

  return (
    <>
      <Preloader onDone={start} />

      <section
        ref={root}
        aria-label="Shop the rail"
        className="grain relative isolate overflow-hidden bg-ivory h-[calc(100svh-7.5rem)] min-h-[680px] max-h-[980px]"
      >
        {/* dotted studio backdrop + soft blush glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(circle,rgba(20,17,15,0.13)_1px,transparent_1.2px)] [background-size:22px_22px]"
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 w-[86vw] h-[56vw] max-w-[1400px] max-h-[760px] rounded-full bg-blush/80 blur-3xl -z-10"
        />

        <div aria-hidden="true" className="blob absolute -left-[8vw] bottom-[6%] w-[34vw] h-[34vw] max-w-[520px] max-h-[520px] rounded-full bg-raspberry/[0.14] blur-3xl -z-10" />
        <div aria-hidden="true" className="blob absolute -right-[6vw] top-[8%] w-[30vw] h-[30vw] max-w-[460px] max-h-[460px] rounded-full bg-gold/25 blur-3xl -z-10" />

        {/* ghost wordmark */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-[-2vw] z-0 text-center font-display font-medium leading-[0.8] tracking-[-0.02em] text-[21vw] text-raspberry/[0.055] select-none whitespace-nowrap"
        >
          WISHLIST
        </div>

        {/* custom cursor, shown over pieces on fine pointers */}
        <div
          aria-hidden="true"
          className="hero-cursor pointer-events-none absolute left-0 top-0 z-40 -ml-9 -mt-9 hidden md:flex w-[72px] h-[72px] rounded-full bg-raspberry text-ivory items-center justify-center text-[10px] tracking-[0.2em] uppercase font-semibold"
          style={{ opacity: 0 }}
        >
          <span>View</span>
        </div>

        {/* ── The rail ── */}
        <div
          ref={scroller}
          className="relative z-10 h-full overflow-x-auto no-scrollbar snap-x snap-mandatory md:snap-none md:overflow-x-visible"
          tabIndex={-1}
        >
          <ul className="relative flex w-max min-w-full items-start justify-between gap-[5vw] md:gap-[1.6vw] px-[6vw] md:px-[4vw] pt-[64px] md:pt-[78px]">
            {/* metal bar */}
            <li aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[70px] md:top-[84px] z-0 list-none">
              <div className="rail-bar relative mx-[2vw] h-[7px] rounded-full bg-gradient-to-b from-white via-[#cfc9c1] to-[#8f8982] shadow-[0_8px_12px_-5px_rgba(20,17,15,0.4)]">
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <span className="rail-glint absolute inset-y-0 left-0 w-[8%] bg-gradient-to-r from-transparent via-white to-transparent" />
                </div>
                {/* end caps + wall mounts */}
                <span className="absolute -left-2 -top-[7px] h-[21px] w-[11px] rounded-[3px] bg-gradient-to-b from-[#ece7e0] via-[#aaa49c] to-[#78726b]" />
                <span className="absolute -right-2 -top-[7px] h-[21px] w-[11px] rounded-[3px] bg-gradient-to-b from-[#ece7e0] via-[#aaa49c] to-[#78726b]" />
                <span className="absolute -left-[22px] -top-[2px] h-[11px] w-[16px] rounded-sm bg-[#cfc9c1] shadow-[0_3px_6px_-2px_rgba(20,17,15,0.4)]" />
                <span className="absolute -right-[22px] -top-[2px] h-[11px] w-[16px] rounded-sm bg-[#cfc9c1] shadow-[0_3px_6px_-2px_rgba(20,17,15,0.4)]" />
              </div>
            </li>

            {items.map((p, i) => {
              const premium = p.brand === "WISHLIST PREMIUM";
              return (
                <li
                  key={p.id}
                  ref={(el) => {
                    cardEls.current[i] = el;
                  }}
                  className="card relative z-10 shrink-0 snap-center w-[46vw] sm:w-[30vw] md:w-[13.4vw] md:max-w-[250px] list-none will-change-transform"
                >
                  <div className="swing" style={{ transformOrigin: "50% 0%" }}>
                    <button
                      type="button"
                      onClick={() => (focus === i ? close() : open(i))}
                      aria-label={`${focus === i ? "Close" : "View"} ${p.name}`}
                      aria-pressed={focus === i}
                      className="sway group block w-full text-left cursor-pointer [@media(pointer:fine)]:cursor-none focus-visible:outline-offset-8"
                    >
                      <div className="-mb-[3px]">
                        <Hanger premium={premium} />
                      </div>
                      <figure className="relative aspect-[3/4] overflow-hidden bg-sand shadow-[0_24px_40px_-18px_rgba(20,17,15,0.45)] ring-4 ring-white transition-[translate] duration-700 ease-out group-hover:-translate-y-1.5">
                        <Image
                          src={p.images[0]}
                          alt={`${p.name} (placeholder imagery)`}
                          fill
                          priority={i < 4}
                          sizes="(max-width: 768px) 46vw, 15vw"
                          className="object-cover object-top transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),rgba(255,255,255,0.4),transparent_55%)]"
                        />
                      </figure>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Default caption: headline + CTAs ── */}
        <div
          className={`cap-default absolute inset-x-0 bottom-0 z-20 px-4 sm:px-8 pb-8 md:pb-10 max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-5 ${
            focused ? "pointer-events-none" : ""
          }`}
        >
          <div>
            <p className="rh-fade text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-raspberry font-semibold mb-3">
              Two labels · One wardrobe — tap a piece
            </p>
            <h1 aria-label="Dressed like it's already on your wishlist." className="font-display italic text-[2.1rem] sm:text-5xl lg:text-[4rem] leading-[0.98] max-w-[16ch]">
              {HEADLINE.map((w, i) => (
                <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-top pb-[0.14em] -mb-[0.14em] mr-[0.22em]">
                  <span className="hw inline-block">{w}</span>
                </span>
              ))}
            </h1>
          </div>
          <div className="rh-fade flex flex-wrap gap-3">
            <Link
              href="/wishlist"
              className="magnet group inline-flex items-center gap-2 bg-ink text-ivory text-[11px] font-semibold tracking-[0.2em] uppercase px-6 py-3.5 hover:bg-raspberry transition-colors duration-500"
            >
              Shop WISHLIST
              <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/wishlist-premium"
              className="magnet group inline-flex items-center gap-2 border border-ink bg-ivory/60 text-ink text-[11px] font-semibold tracking-[0.2em] uppercase px-6 py-3.5 hover:bg-ink hover:text-gold transition-colors duration-500"
            >
              Shop Premium
              <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* ── Focused caption ── */}
        <div
          aria-live="polite"
          className={`cap-focus absolute inset-x-0 bottom-0 z-30 px-4 sm:px-8 pb-6 md:pb-8 flex flex-col items-center text-center ${
            focused ? "" : "pointer-events-none"
          }`}
          style={{ minHeight: CAPTION_H, opacity: 0 }}
        >
          {active && (
            <>
              <span className="text-[10px] tracking-[0.3em] uppercase text-ink/50 tabular-nums">
                {String((focus ?? 0) + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                <span className="mx-2">·</span>
                <span className={active.brand === "WISHLIST PREMIUM" ? "text-gold" : "text-raspberry"}>
                  {active.brand === "WISHLIST PREMIUM" ? "Premium · Ethnic" : "WISHLIST · Western"}
                </span>
              </span>
              <h2 className="mt-2 font-display italic text-3xl md:text-4xl leading-tight">{active.name}</h2>
              <p className="mt-1 text-sm text-ink/70">₹{active.price.toLocaleString("en-IN")}</p>
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous piece"
                  className="magnet w-11 h-11 rounded-full border border-ink/30 flex items-center justify-center hover:bg-ink hover:text-ivory transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <Link
                  href={`/product/${active.id}`}
                  onClick={goProduct}
                  className="magnet group inline-flex items-center gap-2 bg-ink text-ivory text-[11px] font-semibold tracking-[0.22em] uppercase px-7 py-3.5 hover:bg-raspberry transition-colors duration-500"
                >
                  View product
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next piece"
                  className="magnet w-11 h-11 rounded-full border border-ink/30 flex items-center justify-center hover:bg-ink hover:text-ivory transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {focused && (
          <button
            type="button"
            onClick={close}
            className="absolute z-40 top-4 right-4 md:top-6 md:right-8 inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase font-semibold hover:text-raspberry transition-colors"
          >
            Close <X className="w-4 h-4" />
          </button>
        )}
      </section>
    </>
  );
}
