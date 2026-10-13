"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/** Tall category / occasion poster. */
export function PosterTile({
  href,
  image,
  label,
  sub,
  dark = false,
  sizes = "(max-width: 640px) 60vw, 22vw",
}: {
  href: string;
  image: string;
  label: string;
  sub?: string;
  dark?: boolean;
  sizes?: string;
}) {
  return (
    <Link href={href} draggable={false} className="group relative block aspect-[3/4] overflow-hidden bg-sand">
      <Image src={image} alt={`${label} (placeholder imagery)`} fill sizes={sizes} draggable={false} className="object-cover object-top transition-transform duration-[1400ms] ease-out group-hover:scale-[1.07]" />
      <span className={`absolute inset-0 bg-gradient-to-t ${dark ? "from-ink/85" : "from-ink/70"} via-ink/5 to-transparent`} />
      <span className="absolute inset-x-4 bottom-4 flex items-end justify-between text-ivory">
        <span>
          {sub && <span className="block text-[10px] uppercase tracking-[0.24em] text-ivory/75">{sub}</span>}
          <span className="block font-display text-[1.7rem] italic leading-tight md:text-3xl">{label}</span>
        </span>
        <span className="flex h-9 w-9 shrink-0 translate-y-2 items-center justify-center rounded-full bg-ivory text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </span>
    </Link>
  );
}

/** Round shortcut (elevated luxury category medallion). */
export function CircleTile({
  href,
  image,
  label,
  active = false,
}: {
  href: string;
  image: string;
  label: string;
  active?: boolean;
}) {
  const gradId = React.useId().replace(/:/g, "_");

  return (
    <Link
      href={href}
      draggable={false}
      className="group flex flex-col items-center pt-3.5 pb-2 px-1 text-center select-none"
    >
      <span
        className={`relative block h-[96px] w-[96px] md:h-[128px] md:w-[128px] transition-all duration-300 ease-out ${
          active
            ? "-translate-y-2.5 drop-shadow-[0_12px_24px_rgba(176,18,63,0.22)]"
            : "group-hover:-translate-y-2.5 group-focus-visible:-translate-y-2.5 group-hover:drop-shadow-[0_12px_24px_rgba(176,18,63,0.18)]"
        }`}
      >
        {/* Ambient atmospheric aura on hover / active */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -inset-2 md:-inset-2.5 rounded-full bg-gradient-to-tr from-raspberry/25 via-gold/20 to-blush/30 blur-md transition-all duration-500 ${
            active
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
          }`}
        />

        {/* Unique luxury architectural bezel (replaces basic dots) */}
        <svg
          viewBox="0 0 144 144"
          aria-hidden="true"
          className={`pointer-events-none absolute -inset-[6px] md:-inset-[8px] h-[calc(100%+12px)] w-[calc(100%+12px)] md:h-[calc(100%+16px)] md:w-[calc(100%+16px)] transition-all duration-700 ease-out ${
            active
              ? "rotate-45 scale-100"
              : "rotate-0 scale-[0.98] group-hover:rotate-45 group-hover:scale-100"
          }`}
        >
          <defs>
            <linearGradient id={`luxe-${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b0123f" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#b0123f" />
            </linearGradient>
            <linearGradient id={`subtle-${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b8975a" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#b8975a" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Base ambient ring: fine champagne gold */}
          <circle
            cx="72"
            cy="72"
            r="69.5"
            fill="none"
            stroke={`url(#subtle-${gradId})`}
            strokeWidth="1"
            className="transition-opacity duration-500 group-hover:opacity-40"
          />

          {/* Active / hover continuous luxury gradient halo */}
          <circle
            cx="72"
            cy="72"
            r="69.5"
            fill="none"
            stroke={`url(#luxe-${gradId})`}
            strokeWidth={active ? "1.75" : "1.5"}
            className={`transition-all duration-500 ${
              active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          />

          {/* Inner concentric ring with fine jewelry gap */}
          <circle
            cx="72"
            cy="72"
            r="65"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
            className={`transition-colors duration-500 ${
              active
                ? "text-raspberry/60"
                : "text-ink/10 group-hover:text-gold/80"
            }`}
          />

          {/* 4 Couture diamond accents (North, South, East, West) */}
          <polygon
            points="72,0.5 74.5,3 72,5.5 69.5,3"
            fill={active ? "#b0123f" : "#b8975a"}
            className={`transition-all duration-500 ${
              active
                ? "opacity-100 scale-105"
                : "opacity-40 group-hover:opacity-100 group-hover:scale-110"
            }`}
          />
          <polygon
            points="72,138.5 74.5,141 72,143.5 69.5,141"
            fill={active ? "#b0123f" : "#b8975a"}
            className={`transition-all duration-500 ${
              active
                ? "opacity-100 scale-105"
                : "opacity-40 group-hover:opacity-100 group-hover:scale-110"
            }`}
          />
          <polygon
            points="0.5,72 3,74.5 5.5,72 3,69.5"
            fill={active ? "#b0123f" : "#b8975a"}
            className={`transition-all duration-500 ${
              active
                ? "opacity-100 scale-105"
                : "opacity-40 group-hover:opacity-100 group-hover:scale-110"
            }`}
          />
          <polygon
            points="138.5,72 141,74.5 143.5,72 141,69.5"
            fill={active ? "#b0123f" : "#b8975a"}
            className={`transition-all duration-500 ${
              active
                ? "opacity-100 scale-105"
                : "opacity-40 group-hover:opacity-100 group-hover:scale-110"
            }`}
          />
        </svg>

        {/* Circular portrait image */}
        <span
          className={`relative block h-full w-full overflow-hidden rounded-full bg-sand transition-all duration-500 ${
            active
              ? "ring-2 ring-raspberry/80 shadow-[0_8px_20px_rgba(176,18,63,0.22)]"
              : "ring-1 ring-ink/10 shadow-[0_4px_12px_rgba(20,17,15,0.06)] group-hover:ring-1.5 group-hover:ring-raspberry/50 group-hover:shadow-[0_8px_20px_rgba(176,18,63,0.18)]"
          }`}
        >
          <Image
            src={image}
            alt=""
            fill
            sizes="128px"
            draggable={false}
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Subtle soft lens vignette on hover */}
          <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-ink/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </span>
      </span>

      {/* Category label with expanding accent line */}
      <span className="mt-3 flex flex-col items-center">
        <span
          className={`text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 md:text-xs ${
            active ? "text-raspberry font-bold" : "text-ink group-hover:text-raspberry"
          }`}
        >
          {label}
        </span>
        <span
          aria-hidden="true"
          className={`mt-1.5 h-[1.5px] rounded-full bg-gradient-to-r from-raspberry via-gold to-raspberry transition-all duration-400 ease-out ${
            active
              ? "w-6 opacity-100"
              : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100"
          }`}
        />
      </span>
    </Link>
  );
}

/** Wide promo tile (price bands, collections). */
export function WideTile({ href, image, title, sub, tone = "light" }: { href: string; image: string; title: string; sub: string; tone?: "light" | "dark" | "raspberry" }) {
  const bg = tone === "dark" ? "bg-ink text-ivory" : tone === "raspberry" ? "bg-raspberry text-ivory" : "bg-blush text-ink";
  return (
    <Link href={href} draggable={false} className={`group relative flex min-h-[200px] items-stretch overflow-hidden ${bg}`}>
      <span className="relative z-10 flex flex-1 flex-col justify-between p-5 md:p-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] opacity-70">{sub}</span>
        <span>
          <span className="block font-display text-3xl italic leading-[1.02] md:text-[2.3rem]">{title}</span>
          <span className="mt-3 inline-flex items-center gap-2 border-b border-current pb-0.5 text-[11px] font-semibold uppercase tracking-[0.2em]">
            Shop now <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </span>
      </span>
      <span className="relative w-[42%] shrink-0 overflow-hidden">
        <Image src={image} alt="" fill sizes="25vw" draggable={false} className="object-cover object-top transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
      </span>
    </Link>
  );
}
