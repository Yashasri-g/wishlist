"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { img, PICK } from "@/data/images";
import { CATALOG, CATEGORY_TREE, FABRICS, OCCASIONS, byCollection, countFor, filterProducts, shopHref } from "@/data/taxonomy";
import type { ClothingCategory } from "@/types";
import Row from "./Row";
import ProductTile from "./ProductTile";
import { CircleTile, PosterTile } from "./Tiles";
import RecentRow from "./RecentRow";
import Marquee from "@/components/landing/Marquee";

const CONFIG = {
  Western: {
    brand: "WISHLIST",
    eyebrow: "Label 01 · Western",
    title: ["Wish", "list."],
    copy: "Dresses, co-ords, blazers, tops and jackets.",
    bg: "bg-raspberry text-ivory",
    accent: "text-blush",
    images: [PICK.denimCoord, PICK.amethystDress, PICK.redBlazer],
    occasions: ["Party", "Work", "Casual", "Brunch", "Vacation"],
    fabrics: ["Denim", "Satin", "Wool Blend", "Linen", "Velvet", "Cotton"],
  },
  Ethnic: {
    brand: "WISHLIST PREMIUM",
    eyebrow: "Label 02 · Ethnic",
    title: ["Wishlist", "Premium."],
    copy: "Sarees, lehengas, kurtas and festive sets.",
    bg: "bg-ink text-ivory",
    accent: "text-gold",
    images: [PICK.marigoldLehenga, PICK.greenSaree, PICK.maroonKurta],
    occasions: ["Wedding", "Festive", "Party", "Casual", "Work"],
    fabrics: ["Silk", "Chiffon", "Georgette", "Net", "Velvet", "Cotton"],
  },
} as const;

/** Brand shelf page: a banner, then one running row per sub-category, occasion and fabric. */
export default function BrandLanding({ cat }: { cat: ClothingCategory }) {
  const c = CONFIG[cat];
  const tree = CATEGORY_TREE[cat];
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(".bl-line", { yPercent: 115, duration: 1.3, ease: "expo.out", stagger: 0.1, delay: 0.1 });
      gsap.from(".bl-fade", { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1, delay: 0.4 });
      gsap.from(".bl-mask", { clipPath: "inset(100% 0 0 0)", duration: 1.4, ease: "expo.inOut", stagger: 0.14, delay: 0.2 });
      gsap.from(".bl-img", { scale: 1.35, duration: 1.8, ease: "expo.out", stagger: 0.14, delay: 0.2 });
      gsap.to(".bl-drift", { yPercent: (i: number) => (i % 2 ? -8 : 8), ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
    }, root);
    return () => mm.revert();
  }, []);

  const occ = OCCASIONS.filter((o) => (c.occasions as readonly string[]).includes(o.label));
  const fab = FABRICS.filter((f) => (c.fabrics as readonly string[]).includes(f.label));

  return (
    <>
      <section ref={root} className={`relative overflow-hidden ${c.bg}`}>
        <div className="mx-auto grid min-h-[520px] max-w-[1800px] items-center gap-6 px-5 py-14 sm:px-10 md:grid-cols-[5fr_7fr] md:py-0 lg:min-h-[600px] lg:px-20">
          <div>
            <p className={`bl-fade mb-4 text-[11px] font-semibold uppercase tracking-[0.34em] ${c.accent}`}>{c.eyebrow}</p>
            <h1 className="font-display text-[3.6rem] font-medium leading-[0.92] tracking-tight sm:text-7xl lg:text-[6.4rem]" aria-label={c.brand}>
              {c.title.map((l, i) => (
                <span key={i} aria-hidden="true" className="block overflow-hidden pb-[0.08em]">
                  <span className={`bl-line block ${i === c.title.length - 1 ? `italic ${c.accent}` : ""}`}>{l}</span>
                </span>
              ))}
            </h1>
            <p className="bl-fade mt-5 max-w-[34ch] text-base opacity-85">{c.copy}</p>
            <div className="bl-fade mt-7 flex flex-wrap gap-3">
              <Link href={shopHref({ cat })} className="group inline-flex items-center gap-2 bg-ivory px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-raspberry hover:text-ivory">
                Shop all {cat === "Western" ? "Western" : "Ethnic"}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link href={shopHref({ cat, col: "new" })} className="inline-flex items-center border border-current px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-current/10">
                New in
              </Link>
            </div>
          </div>
          <div className="grid h-[360px] grid-cols-3 items-end gap-3 sm:gap-5 md:h-[460px] lg:h-[520px]">
            {c.images.map((n, i) => (
              <div key={i} className={`bl-drift ${i === 1 ? "h-full" : i === 0 ? "h-[80%]" : "h-[68%]"}`}>
                <div className="bl-mask relative h-full w-full overflow-hidden bg-black/10">
                  <Image src={img(n, 900)} alt={`${c.brand} (placeholder imagery)`} fill priority sizes="22vw" className="bl-img object-cover object-top" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee items={tree.subs.map((s) => s.label)} className="bg-ivory-deep py-3.5 text-[11px] font-medium uppercase tracking-[0.3em]" duration={30} />

      <div className="space-y-16 py-14 md:space-y-24 md:py-20">
        <Row title="Shop by category" eyebrow={c.brand} auto speed={0.45} itemClass="w-[58vw] sm:w-[36vw] md:w-[26vw] lg:w-[19vw] xl:w-[16.5vw]" href={shopHref({ cat })} hrefLabel="Shop all">
          {tree.subs.map((s) => (
            <PosterTile key={s.sub} href={shopHref({ cat, sub: s.sub })} image={s.image} label={s.label} sub={`${countFor({ cat, sub: s.sub })} styles`} />
          ))}
        </Row>

        <Row title="New arrivals" eyebrow="Just landed" href={shopHref({ cat, col: "new" })}>
          {byCollection("new", filterProducts({ cat }, CATALOG)).map((p) => <ProductTile key={p.id} product={p} />)}
        </Row>

        {tree.subs.map((s) => {
          const items = filterProducts({ cat, sub: s.sub });
          if (items.length === 0) return null;
          return (
            <Row key={s.sub} title={s.label} eyebrow={`${c.brand} · ${items.length} styles`} href={shopHref({ cat, sub: s.sub })}>
              {items.map((p) => <ProductTile key={p.id} product={p} />)}
            </Row>
          );
        })}

        <Row title="Shop by occasion" eyebrow="Dress for the moment" auto speed={0.4} itemClass="w-[58vw] sm:w-[36vw] md:w-[26vw] lg:w-[19vw] xl:w-[16.5vw]">
          {occ.map((o) => (
            <PosterTile key={o.label} href={shopHref({ cat, occ: o.label })} image={o.image} label={o.label} sub={`${countFor({ cat, occ: o.label })} styles`} />
          ))}
        </Row>

        <Row title="Shop by fabric" eyebrow="Feel the difference" auto speed={0.45} itemClass="w-[104px] md:w-[140px]">
          {fab.map((f) => (
            <CircleTile key={f.label} href={shopHref({ cat, fab: f.label })} image={f.image} label={f.label} />
          ))}
        </Row>

        <Row title="Best sellers" eyebrow="Most loved" href={shopHref({ cat, col: "best" })}>
          {byCollection("best", filterProducts({ cat }, CATALOG)).map((p) => <ProductTile key={p.id} product={p} />)}
        </Row>

        <RecentRow />
      </div>
    </>
  );
}
