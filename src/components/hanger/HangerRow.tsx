"use client";

import React, { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { kick, tickRail } from "@/lib/physics";
import Hanger from "./Hanger";

/** One metal rail with pieces hanging from it. */
export function HangerRow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative pt-[22px] ${className}`}>
      <div aria-hidden="true" className="hanger-bar pointer-events-none absolute inset-x-[6px] top-[18px] z-0 h-[7px] rounded-full bg-gradient-to-b from-white via-[#cfc9c1] to-[#8f8982] shadow-[0_8px_12px_-5px_rgba(20,17,15,0.4)]">
        <span className="absolute -left-2 -top-[7px] h-[21px] w-[11px] rounded-[3px] bg-gradient-to-b from-[#ece7e0] via-[#aaa49c] to-[#78726b]" />
        <span className="absolute -right-2 -top-[7px] h-[21px] w-[11px] rounded-[3px] bg-gradient-to-b from-[#ece7e0] via-[#aaa49c] to-[#78726b]" />
      </div>
      <div className="relative z-10 flex items-start">{children}</div>
    </div>
  );
}

export interface HangingApi {
  /** Lift the piece off the rail (swing, fall, fade), then run `done`. */
  detach: (done: () => void) => void;
}

const HangingContext = createContext<HangingApi>({ detach: (done) => done() });

/** Called from inside a <HangingItem> card to lift it off the rail before removing it. */
export function useDetach() {
  return useContext(HangingContext).detach;
}

/**
 * A piece hanging from a rail: drops in, sways, swings when brushed, falls away when detached.
 * Cards call `useDetach()` to trigger the lift-off animation from their own buttons.
 */
export default function HangingItem({
  premium = false,
  index = 0,
  className = "",
  children,
}: {
  premium?: boolean;
  index?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const swing = useRef<HTMLDivElement>(null);
  const sway = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const bar = root.current?.closest(".relative")?.querySelector(".hanger-bar");
      gsap.set(swing.current, { transformOrigin: "50% 0%" });
      gsap.set(sway.current, { transformOrigin: "50% 0%" });
      // drop onto the rail, then settle like a pendulum
      gsap.fromTo(root.current, { yPercent: -110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.05 + index * 0.08, onComplete: () => tickRail(bar) });
      gsap.fromTo(swing.current, { rotation: index % 2 ? 11 : -11 }, { rotation: 0, duration: 2.4, ease: "elastic.out(1, 0.3)", delay: 0.35 + index * 0.08 });
      const idle = gsap.fromTo(sway.current, { rotation: -1.4 }, { rotation: 1.4, duration: 2.6 + (index % 3) * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: index * 0.2 });
      return () => {
        idle.kill();
      };
    }, root);
    return () => mm.revert();
  }, [index]);

  const onEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    kick(swing.current, (index % 2 ? 1 : -1) * 4);
  };

  const detach = useCallback((done: () => void) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = root.current;
    if (reduce || !el) return done();
    const bar = el.closest(".relative")?.querySelector(".hanger-bar");
    gsap.killTweensOf([swing.current, sway.current]);
    gsap
      .timeline({ onComplete: done })
      .to(swing.current, { rotation: 16, duration: 0.22, ease: "power2.out" })
      .add(() => tickRail(bar), 0.1)
      .to(el, { y: 140, rotation: -8, opacity: 0, duration: 0.65, ease: "power3.in" }, 0.18);
  }, []);
  const api = useMemo<HangingApi>(() => ({ detach }), [detach]);

  return (
    <div ref={root} className={`relative ${className}`} onPointerEnter={onEnter}>
      <div ref={swing}>
        <div ref={sway}>
          <div className="-mb-[3px] mx-auto w-[78%]">
            <Hanger premium={premium} />
          </div>
          <HangingContext.Provider value={api}>{children}</HangingContext.Provider>
        </div>
      </div>
    </div>
  );
}

/** Splits `items` into rows that fit the current column count. */
export function useColumns(breakpoints: { min: number; cols: number }[], fallback = 1) {
  const [cols, setCols] = React.useState(fallback);
  React.useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      const hit = [...breakpoints].sort((a, b) => b.min - a.min).find((b) => w >= b.min);
      setCols(hit ? hit.cols : fallback);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return cols;
}

export function chunk<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}
