"use client";

import React, { useLayoutEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { PRODUCTS } from "@/data/products";
import type { Subcategory, ClothingCategory } from "@/types";

const ROWS: { label: string; sub: Subcategory; cat: ClothingCategory }[] = [
  { label: "Dresses", sub: "Dresses", cat: "Western" },
  { label: "Co-ords", sub: "Co-ords", cat: "Western" },
  { label: "Sarees", sub: "Sarees", cat: "Ethnic" },
  { label: "Lehengas", sub: "Lehengas", cat: "Ethnic" },
];

/** Typographic category index. On desktop a preview image follows the cursor. */
export default function CategoryList() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);

  const rows = useMemo(
    () =>
      ROWS.map((r) => {
        const items = PRODUCTS.filter((p) => p.subcategory === r.sub);
        return { ...r, count: items.length, image: items[0]?.images[0] ?? PRODUCTS[0].images[0] };
      }),
    []
  );

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      gsap.from(".cat-row", {
        yPercent: 40,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    }, root);

    mm.add("(hover: hover) and (pointer: fine) and (min-width: 1024px)", () => {
      const box = preview.current;
      if (!box) return;
      const qx = gsap.quickTo(box, "x", { duration: 0.6, ease: "power3.out" });
      const qy = gsap.quickTo(box, "y", { duration: 0.6, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        qx(e.clientX);
        qy(e.clientY);
      };
      const rowsEls = gsap.utils.toArray<HTMLElement>(".cat-row", root.current);
      const enters: Array<() => void> = [];
      const leave = () => gsap.to(box, { scale: 0.6, opacity: 0, duration: 0.4, ease: "power3.out" });
      rowsEls.forEach((el, i) => {
        const enter = () => {
          box.querySelectorAll<HTMLElement>("[data-i]").forEach((n) => {
            n.style.opacity = n.dataset.i === String(i) ? "1" : "0";
          });
          gsap.to(box, { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" });
        };
        enters.push(enter);
        el.addEventListener("pointerenter", enter);
        el.addEventListener("pointerleave", leave);
      });
      window.addEventListener("pointermove", move);
      return () => {
        window.removeEventListener("pointermove", move);
        rowsEls.forEach((el, i) => {
          el.removeEventListener("pointerenter", enters[i]);
          el.removeEventListener("pointerleave", leave);
        });
      };
    }, root);

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="px-4 sm:px-8 py-28 md:py-40 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between mb-10 md:mb-16">
        <h2 className="font-display text-5xl md:text-7xl italic leading-none">Shop by edit</h2>
        <Link href="/wishlist" className="hidden sm:inline text-[11px] font-semibold tracking-[0.25em] uppercase border-b border-ink pb-1 hover:text-raspberry hover:border-raspberry transition-colors">
          View all
        </Link>
      </div>

      <ul className="border-t border-ink/15">
        {rows.map((r, i) => (
          <li key={r.label} className="cat-row border-b border-ink/15">
            <Link
              href={r.cat === "Western" ? "/wishlist" : "/wishlist-premium"}
              className="group flex items-center gap-4 py-5 md:py-8 transition-colors duration-500 hover:text-raspberry"
            >
              <span className="w-8 text-[11px] tracking-[0.2em] text-ink/40 tabular-nums">0{i + 1}</span>
              <span className="font-display text-[3.4rem] sm:text-8xl lg:text-[9rem] leading-[0.95] tracking-tight transition-all duration-700 ease-out group-hover:italic group-hover:translate-x-4">
                {r.label}
              </span>
              <span className="ml-auto flex items-center gap-4">
                {/* Touch / small screens: inline thumbnail since there is no hover */}
                <span className="relative block lg:hidden w-14 h-[4.5rem] overflow-hidden bg-sand">
                  <Image src={r.image} alt="" fill sizes="56px" className="object-cover object-top" />
                </span>
                <span className="hidden sm:block text-[11px] tracking-[0.2em] uppercase text-ink/50">
                  {r.count} {r.count === 1 ? "piece" : "pieces"}
                </span>
                <ArrowUpRight className="w-6 h-6 md:w-9 md:h-9 transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Cursor-following preview (desktop, fine pointer only) */}
      <div
        ref={preview}
        aria-hidden="true"
        className="hidden lg:block pointer-events-none fixed left-0 top-0 z-40 w-[280px] h-[370px] -ml-[140px] -mt-[185px] opacity-0 scale-[0.6] overflow-hidden bg-sand"
      >
        {rows.map((r, i) => (
          <div key={r.label} data-i={i} className="absolute inset-0 opacity-0 transition-opacity duration-300">
            <Image src={r.image} alt="" fill sizes="280px" className="object-cover object-top" />
          </div>
        ))}
      </div>
    </section>
  );
}
