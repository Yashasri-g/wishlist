"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";

export interface PageTransitionDetail {
  href: string;
  src: string;
  rect: { left: number; top: number; width: number; height: number };
}

/** Fire this from anywhere to run the shared-element transition into `href`. */
export function startPageTransition(detail: PageTransitionDetail) {
  window.dispatchEvent(new CustomEvent<PageTransitionDetail>("wl:go", { detail }));
}

/**
 * Shared-element page transition.
 * The clicked photo grows from its exact on-screen rectangle to fill the viewport,
 * the route changes underneath, then the photo wipes upward to reveal the new page.
 */
export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [job, setJob] = useState<PageTransitionDetail | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const startPath = useRef(pathname);
  const waiting = useRef(false);

  useEffect(() => {
    const on = (e: Event) => setJob((e as CustomEvent<PageTransitionDetail>).detail);
    window.addEventListener("wl:go", on);
    return () => window.removeEventListener("wl:go", on);
  }, []);

  // 1) cover: grow the photo to fill the screen, then navigate
  useEffect(() => {
    if (!job || !box.current) return;
    startPath.current = pathname;
    waiting.current = true;
    const el = box.current;
    gsap.set(el, {
      left: job.rect.left,
      top: job.rect.top,
      width: job.rect.width,
      height: job.rect.height,
      clipPath: "inset(0% 0% 0% 0%)",
    });
    gsap.to(el, {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      duration: 0.95,
      ease: "expo.inOut",
      onComplete: () => router.push(job.href),
    });
    // safety net: never leave the overlay stuck on screen
    const bail = window.setTimeout(() => setJob(null), 7000);
    return () => window.clearTimeout(bail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job]);

  // 2) reveal: once the new route is in place, wipe the photo away
  useEffect(() => {
    if (!job || !box.current || !waiting.current || pathname === startPath.current) return;
    waiting.current = false;
    gsap.to(box.current, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 1.05,
      ease: "expo.inOut",
      delay: 0.3,
      onComplete: () => setJob(null),
    });
  }, [pathname, job]);

  if (!job) return null;
  return (
    <div ref={box} aria-hidden="true" className="fixed z-[95] overflow-hidden bg-sand">
      <Image src={job.src} alt="" fill sizes="100vw" unoptimized className="object-cover object-top" />
    </div>
  );
}
