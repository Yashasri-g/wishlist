"use client";

import { gsap } from "./gsap";

export type FlyTarget = "cart" | "wishlist";

/** Swing a header icon from its top edge, as if bumped on a rail. */
export function bump(target: FlyTarget) {
  const el = document.querySelector<HTMLElement>(`[data-fly-target="${target}"]`);
  if (!el) return;
  gsap.killTweensOf(el);
  gsap.set(el, { transformOrigin: "50% 0%" });
  gsap.to(el, {
    keyframes: [
      { rotation: -22, duration: 0.12, ease: "power2.out" },
      { rotation: 16, duration: 0.14 },
      { rotation: -9, duration: 0.14 },
      { rotation: 4, duration: 0.14 },
      { rotation: 0, duration: 0.2 },
    ],
  });
  const badge = el.querySelector("[data-badge]");
  if (badge) gsap.fromTo(badge, { scale: 1.9 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
}

/**
 * A small copy of the product photo arcs from `from` to the header icon, then the icon swings.
 * Skipped (icon still bumps) for reduced-motion users or when the target isn't on screen.
 */
export function flyToTarget(from: Element | null, image: string, target: FlyTarget) {
  const dest = document.querySelector<HTMLElement>(`[data-fly-target="${target}"]`);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!from || !dest || reduce) {
    bump(target);
    return;
  }
  const r = from.getBoundingClientRect();
  const t = dest.getBoundingClientRect();
  const W = 70;
  const H = 94;

  const el = document.createElement("div");
  Object.assign(el.style, {
    position: "fixed",
    left: "0",
    top: "0",
    width: `${W}px`,
    height: `${H}px`,
    backgroundImage: `url("${image}")`,
    backgroundSize: "cover",
    backgroundPosition: "top",
    boxShadow: "0 0 0 3px #fff, 0 18px 30px -10px rgba(20,17,15,.45)",
    zIndex: "9999",
    pointerEvents: "none",
  } as CSSStyleDeclaration);
  document.body.appendChild(el);

  const sx = r.left + r.width / 2 - W / 2;
  const sy = r.top + r.height / 2 - H / 2;
  const tx = t.left + t.width / 2 - W / 2;
  const ty = t.top + t.height / 2 - H / 2;
  gsap.set(el, { x: sx, y: sy, scale: 0.6, opacity: 0, rotation: -6 });

  const tl = gsap.timeline({
    onComplete: () => {
      el.remove();
      bump(target);
    },
  });
  tl.to(el, { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" })
    .to(el, { x: tx, duration: 0.95, ease: "power1.inOut" }, 0)
    .to(el, { y: Math.min(sy, ty) - 70, duration: 0.38, ease: "power2.out" }, 0)
    .to(el, { y: ty, duration: 0.57, ease: "power2.in" }, 0.38)
    .to(el, { scale: 0.22, rotation: 18, duration: 0.95, ease: "power2.in" }, 0)
    .to(el, { opacity: 0, duration: 0.15 }, 0.82);
}
