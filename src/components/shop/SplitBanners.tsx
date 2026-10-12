"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { img, PICK } from "@/data/images";
import { CATEGORY_TREE, shopHref } from "@/data/taxonomy";

/** The two labels as two big doors. The hovered door grows; sub-categories are listed as chips. */
export default function SplitBanners() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(".sb-door", { clipPath: "inset(10% 8% 10% 8%)", opacity: 0, duration: 1.3, ease: "expo.out", stagger: 0.16, scrollTrigger: { trigger: root.current, start: "top 80%" } });
      gsap.from(".sb-img", { scale: 1.25, duration: 1.8, ease: "expo.out", stagger: 0.16, scrollTrigger: { trigger: root.current, start: "top 80%" } });
    }, root);
    return () => mm.revert();
  }, []);

  const door = "sb-door group relative flex min-h-[520px] flex-col justify-between overflow-hidden p-6 md:p-10 lg:min-h-[640px] lg:flex-1 lg:hover:flex-[1.5] lg:focus-within:flex-[1.5] transition-[flex] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]";
  const chip = "border border-current/50 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors hover:bg-ivory hover:text-ink";

  return (
    <section ref={root} aria-label="Our two labels" className="mx-auto max-w-[1800px] px-4 sm:px-8">
      <div className="flex flex-col gap-3 md:gap-4 lg:flex-row">
        <div className={`${door} bg-raspberry text-ivory`}>
          <Image src={img(PICK.denimCoord, 1200)} alt="WISHLIST (placeholder imagery)" fill sizes="(max-width: 1024px) 100vw, 55vw" className="sb-img object-cover object-top mix-blend-multiply opacity-80 transition-transform duration-[1400ms] ease-out group-hover:scale-105" />
          <div className="relative flex justify-between text-[11px] uppercase tracking-[0.3em]">
            <span>Label 01</span>
            <span>Western</span>
          </div>
          <div className="relative">
            <h3 className="font-display text-6xl italic leading-[0.9] md:text-8xl">Wishlist</h3>
            <p className="mt-3 max-w-xs text-sm text-ivory/85">Dresses, co-ords, blazers, tops and jackets.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {CATEGORY_TREE.Western.subs.map((s) => (
                <Link key={s.sub} href={shopHref({ cat: "Western", sub: s.sub })} className={chip}>{s.label}</Link>
              ))}
            </div>
            <Link href="/wishlist" className="mt-6 inline-flex items-center gap-2 border-b border-current pb-1 text-[11px] font-semibold uppercase tracking-[0.25em]">
              Enter the edit <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className={`${door} bg-ink text-ivory`}>
          <Image src={img(PICK.marigoldLehenga, 1200)} alt="WISHLIST PREMIUM (placeholder imagery)" fill sizes="(max-width: 1024px) 100vw, 55vw" className="sb-img object-cover object-top opacity-60 transition-transform duration-[1400ms] ease-out group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          <div className="relative flex justify-between text-[11px] uppercase tracking-[0.3em] text-gold">
            <span>Label 02</span>
            <span>Ethnic</span>
          </div>
          <div className="relative">
            <h3 className="font-display text-6xl leading-[0.9] md:text-8xl">
              Wishlist <span className="italic text-gold">Premium</span>
            </h3>
            <p className="mt-3 max-w-xs text-sm text-ivory/80">Sarees, lehengas, kurtas and festive sets.</p>
            <div className="mt-5 flex flex-wrap gap-2 text-gold">
              {CATEGORY_TREE.Ethnic.subs.map((s) => (
                <Link key={s.sub} href={shopHref({ cat: "Ethnic", sub: s.sub })} className={`${chip} hover:!text-ink`}>{s.label}</Link>
              ))}
            </div>
            <Link href="/wishlist-premium" className="mt-6 inline-flex items-center gap-2 border-b border-gold pb-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
              Enter the edit <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
