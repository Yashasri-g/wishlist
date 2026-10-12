"use client";

import React, { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/gsap";

/**
 * Infinite ticker. Speed follows scroll velocity and the strip reverses when you scroll up.
 * Content is duplicated once so a -50% shift loops seamlessly. Static for reduced-motion users.
 */
export default function Marquee({
  items,
  className = "",
  reverse = false,
  duration = 38,
}: {
  items: string[];
  className?: string;
  reverse?: boolean;
  duration?: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const base = reverse ? -1 : 1;
      const tween = gsap.fromTo(
        track.current,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration, ease: "none", repeat: -1 }
      );
      const st = ScrollTrigger.create({
        trigger: document.documentElement,
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const dir = self.direction * base;
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 220, 7);
          gsap.to(tween, { timeScale: dir * boost, duration: 0.25, overwrite: true });
          gsap.to(tween, { timeScale: dir, duration: 1.4, delay: 0.3, ease: "power2.out", overwrite: false });
        },
      });
      return () => {
        st.kill();
        tween.kill();
      };
    }, wrap);
    return () => mm.revert();
  }, [duration, reverse]);

  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="px-8">{t}</span>
          <span className="text-[0.5em]" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div ref={wrap} className={`overflow-hidden ${className}`}>
      <div ref={track} className="flex w-max will-change-transform">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
