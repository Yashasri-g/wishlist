import React from "react";
import Link from "next/link";
import HeroCarousel from "@/components/shop/HeroCarousel";
import Row from "@/components/shop/Row";
import ProductTile from "@/components/shop/ProductTile";
import { CircleTile, PosterTile, WideTile } from "@/components/shop/Tiles";
import SplitBanners from "@/components/shop/SplitBanners";
import ParallaxBanner from "@/components/shop/ParallaxBanner";
import RecentRow from "@/components/shop/RecentRow";
import Marquee from "@/components/landing/Marquee";
import SocialStrip from "@/components/landing/SocialStrip";
import { img, PICK } from "@/data/images";
import {
  CATALOG,
  FABRICS,
  OCCASIONS,
  PRICE_BANDS,
  SUBCATEGORIES,
  byCollection,
  countFor,
  filterProducts,
  newestFirst,
  shopHref,
} from "@/data/taxonomy";

const POSTER = "w-[58vw] sm:w-[36vw] md:w-[26vw] lg:w-[19vw] xl:w-[16.5vw]";
const CIRCLE = "w-[114px] md:w-[150px]";
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function HomePage() {
  const fresh = newestFirst(CATALOG).slice(0, 12);
  const top10 = [...byCollection("trending"), ...byCollection("best")].filter((p, i, a) => a.findIndex((x) => x.id === p.id) === i).slice(0, 10);
  const wedding = filterProducts({ occ: "Wedding" }).slice(0, 12);
  const blazers = filterProducts({ sub: "Blazers & Suits" });
  const best = byCollection("best").slice(0, 12);
  const budget = filterProducts({ price: "u3" }).slice(0, 12);
  const denim = filterProducts({ fab: "Denim" });
  const kurtas = filterProducts({ sub: "Kurtas & Sets" });

  return (
    <>
      <HeroCarousel />

      <Marquee items={["New season", "WISHLIST · Western", "WISHLIST PREMIUM · Ethnic", "Free to browse, easy to love"]} className="bg-ink py-3.5 text-[11px] font-medium uppercase tracking-[0.3em] text-ivory" duration={36} />

      <div className="space-y-16 py-14 md:space-y-24 md:py-20">
        {/* shortcut strip: running circles (category + occasion shortcuts) */}
        <Row title="Shop by category" eyebrow="Start here" auto speed={0.55} itemClass={CIRCLE} href="/shop" hrefLabel="Shop all">
          {SUBCATEGORIES.map((s) => (
            <CircleTile key={s.sub} href={shopHref({ cat: s.cat, sub: s.sub })} image={s.image} label={s.label} />
          ))}
          {OCCASIONS.slice(0, 5).map((o) => (
            <CircleTile key={o.label} href={shopHref({ occ: o.label })} image={o.image} label={o.label} />
          ))}
        </Row>

        <Row title="New arrivals" eyebrow="Just landed" href={shopHref({ col: "new" })}>
          {fresh.map((p, i) => (
            <ProductTile key={p.id} product={p} priority={i < 4} />
          ))}
        </Row>

        <SplitBanners />

        <Row title="Top 10 this week" eyebrow="Trending now" ranked itemClass="w-[66vw] sm:w-[44vw] md:w-[32vw] lg:w-[24vw] xl:w-[21vw]" href={shopHref({ col: "trending" })}>
          {top10.map((p) => (
            <ProductTile key={p.id} product={p} />
          ))}
        </Row>

        <Row title="Shop by occasion" eyebrow="Dress for the moment" auto speed={0.4} itemClass={POSTER}>
          {OCCASIONS.map((o) => (
            <PosterTile key={o.label} href={shopHref({ occ: o.label })} image={o.image} label={o.label} sub={`${countFor({ occ: o.label })} styles`} />
          ))}
        </Row>

        {/* price bands (Gayathri-style "Below ₹5,000" tiles) */}
        <section aria-label="Shop by price" className="mx-auto max-w-[1800px] px-4 sm:px-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-raspberry">Shop by budget</p>
              <h2 className="font-display text-[1.9rem] font-medium leading-[1.05] tracking-tight sm:text-4xl md:text-[2.8rem]">Find your price</h2>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
            {PRICE_BANDS.map((b, i) => (
              <WideTile
                key={b.key}
                href={shopHref({ price: b.key })}
                title={b.label}
                sub={`${countFor({ price: b.key })} styles`}
                tone={(["light", "raspberry", "dark", "light"] as const)[i]}
                image={img([PICK.creamDress, PICK.denimCoord, PICK.marigoldLehenga, PICK.bridalLehenga][i], 600)}
              />
            ))}
          </div>
        </section>

        <Row title="The wedding edit" eyebrow="Premium · Ethnic" tone="dark" className="py-14 md:py-20" href={shopHref({ occ: "Wedding" })}>
          {wedding.map((p) => (
            <ProductTile key={p.id} product={p} />
          ))}
        </Row>
      </div>

      <ParallaxBanner image={img(PICK.crimsonGown, 1800)} eyebrow="The Wishlist" title={["Complete", "the look."]} cta="Shop trending" href={shopHref({ col: "trending" })} position="50% 28%" />

      <div className="space-y-16 py-14 md:space-y-24 md:py-20">
        <Row title="Power tailoring" eyebrow="WISHLIST · Blazers & suits" href={shopHref({ cat: "Western", sub: "Blazers & Suits" })}>
          {blazers.map((p) => (
            <ProductTile key={p.id} product={p} />
          ))}
        </Row>

        <Row title="Shop by fabric" eyebrow="Feel the difference" auto speed={0.45} itemClass={CIRCLE}>
          {FABRICS.map((f) => (
            <CircleTile key={f.label} href={shopHref({ fab: f.label })} image={f.image} label={f.label} />
          ))}
        </Row>

        <Row title="Best sellers" eyebrow="Most loved" href={shopHref({ col: "best" })}>
          {best.map((p) => (
            <ProductTile key={p.id} product={p} />
          ))}
        </Row>

        <Row title="Kurtas & sets" eyebrow="Premium · Everyday ethnic" href={shopHref({ cat: "Ethnic", sub: "Kurtas & Sets" })}>
          {kurtas.map((p) => (
            <ProductTile key={p.id} product={p} />
          ))}
        </Row>

        <Row title="Denim edit" eyebrow="WISHLIST · Western" href={shopHref({ fab: "Denim" })}>
          {denim.map((p) => (
            <ProductTile key={p.id} product={p} />
          ))}
        </Row>

        <Row title="Under ₹3,000" eyebrow="Easy on the wallet" href={shopHref({ price: "u3" })}>
          {budget.map((p) => (
            <ProductTile key={p.id} product={p} />
          ))}
        </Row>

        <Row title="Find your size" eyebrow="Shop by size" auto speed={0.35} itemClass="w-[120px] md:w-[160px]">
          {SIZES.map((s) => (
            <Link key={s} href={`/shop?size=${s}`} draggable={false} className="group flex aspect-square items-center justify-center border border-ink/20 bg-white font-display text-5xl italic transition-colors duration-500 hover:border-raspberry hover:bg-raspberry hover:text-ivory md:text-6xl">
              {s}
            </Link>
          ))}
        </Row>

        <RecentRow />
      </div>

      <SocialStrip />
    </>
  );
}
