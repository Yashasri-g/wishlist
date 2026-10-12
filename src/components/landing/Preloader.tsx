"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

const SEEN_KEY = "wl-intro-seen";

/**
 * Full-screen intro curtain. Counts to 100, then lifts to reveal the hero.
 * Skipped for repeat visits in the same session and for reduced-motion users.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useLayoutEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const skip = new URLSearchParams(window.location.search).has("nointro"); // QA switch
    if (skip) gsap.ticker.lagSmoothing(0); // QA only: headless virtual time jumps otherwise stall tweens
    if (seen || reduce || skip) {
      // Hide imperatively (no setState in the effect body); the node stays mounted but invisible.
      if (root.current) root.current.style.display = "none";
      onDone();
      return;
    }

    document.body.style.overflow = "hidden";
    const state = { n: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          try {
            sessionStorage.setItem(SEEN_KEY, "1");
          } catch {}
          setGone(true);
        },
      });
      tl.from(".pl-logo", { opacity: 0, y: 24, duration: 0.8, ease: "expo.out" })
        .to(
          state,
          {
            n: 100,
            duration: 1.6,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counter.current) counter.current.textContent = String(Math.round(state.n)).padStart(3, "0");
            },
          },
          0.2
        )
        .to(bar.current, { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0.2)
        .to(".pl-content", { opacity: 0, y: -20, duration: 0.45, ease: "power2.in" })
        .add(() => onDone(), "-=0.1")
        .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" }, "<");
    }, root);

    return () => {
      document.body.style.overflow = "";
      ctx.revert();
    };
  }, [onDone]);

  if (gone) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div className="pl-content flex flex-col items-center">
        <div className="pl-logo">
          <Image src="/logo.png" alt="" width={150} height={150} priority />
        </div>
        <div className="mt-8 w-56 h-px bg-ink/15 overflow-hidden">
          <div ref={bar} className="h-full bg-raspberry origin-left scale-x-0" />
        </div>
        <span ref={counter} className="mt-4 font-display text-2xl italic tabular-nums text-ink">
          000
        </span>
      </div>
    </div>
  );
}
