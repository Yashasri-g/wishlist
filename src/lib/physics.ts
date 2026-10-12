"use client";

import { gsap } from "./gsap";

/** Give a hanging piece an impulse: it swings out, then settles like a pendulum. */
export function kick(el: Element | null | undefined, deg: number, delay = 0) {
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

/** The rail shudders slightly when a hanger lands on it or slides along it. */
export function tickRail(bar: Element | null | undefined) {
  if (!bar) return;
  gsap.fromTo(bar, { y: 0 }, { y: 2.5, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.out", overwrite: "auto" });
}
