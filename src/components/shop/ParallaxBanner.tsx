"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap, MOTION_OK } from "@/lib/gsap";

/** Full-bleed banner: the photo drifts against the scroll, the headline rises from a mask. */
export default function ParallaxBanner({
  image,
  eyebrow,
  title,
  cta,
  href,
  position = "50% 30%",
}: {
  image: string;
  eyebrow: string;
  title: string[];
  cta: string;
  href: string;
  position?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(".pb-img", { yPercent: -12 }, { yPercent: 12, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.from(".pb-line", { yPercent: 115, duration: 1.2, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: root.current, start: "top 65%" } });
      gsap.from(".pb-fade", { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1, delay: 0.3, scrollTrigger: { trigger: root.current, start: "top 65%" } });
    }, root);
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative isolate flex min-h-[520px] items-center overflow-hidden bg-ink text-ivory md:min-h-[640px]">
      <div className="pb-img absolute -inset-y-[14%] inset-x-0 -z-10">
        <Image src={image} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: position }} />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/80 via-ink/35 to-transparent" />
      <div className="mx-auto w-full max-w-[1800px] px-5 sm:px-10 lg:px-20">
        <p className="pb-fade mb-4 text-[11px] font-semibold uppercase tracking-[0.34em] text-gold">{eyebrow}</p>
        <h2 className="font-display text-5xl font-medium leading-[0.95] tracking-tight sm:text-7xl lg:text-[6.2rem]" aria-label={title.join(" ")}>
          {title.map((l, i) => (
            <span key={i} aria-hidden="true" className="block overflow-hidden pb-[0.08em]">
              <span className={`pb-line block ${i === title.length - 1 ? "italic text-blush" : ""}`}>{l}</span>
            </span>
          ))}
        </h2>
        <Link href={href} className="pb-fade group mt-8 inline-flex items-center gap-2 bg-ivory px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-raspberry hover:text-ivory">
          {cta}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
