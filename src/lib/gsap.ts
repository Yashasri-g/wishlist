"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/** Media query used everywhere so motion is skipped for reduced-motion users. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MOTION_OK_DESKTOP = "(prefers-reduced-motion: no-preference) and (min-width: 768px)";
