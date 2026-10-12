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

/** Round shortcut (Pantaloons-style category strip). */
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
  return (
    <Link
      href={href}
      draggable={false}
      className="group flex flex-col items-center pt-3.5 pb-1 px-1 text-center select-none"
    >
      <span
        className={`relative block h-[96px] w-[96px] md:h-[128px] md:w-[128px] transition-all duration-300 ease-out ${
          active
            ? "-translate-y-2.5 drop-shadow-[0_10px_20px_rgba(176,18,63,0.22)]"
            : "group-hover:-translate-y-2.5 group-focus-visible:-translate-y-2.5 group-hover:drop-shadow-[0_10px_20px_rgba(176,18,63,0.18)]"
        }`}
      >
        <span
          className={`pointer-events-none absolute -inset-[6px] md:-inset-[7px] rounded-full border border-dashed transition-all duration-700 ${
            active
              ? "rotate-90 border-raspberry opacity-100"
              : "border-raspberry/0 opacity-0 group-hover:rotate-90 group-hover:border-raspberry/85 group-hover:opacity-100 group-focus-visible:border-raspberry group-focus-visible:opacity-100"
          }`}
        />
        <span
          className={`relative block h-full w-full overflow-hidden rounded-full bg-sand ring-1 transition-all duration-500 ${
            active ? "ring-2 ring-raspberry/70" : "ring-ink/10 group-hover:ring-raspberry/40"
          }`}
        >
          <Image
            src={image}
            alt=""
            fill
            sizes="128px"
            draggable={false}
            className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
          />
        </span>
      </span>
      <span
        className={`mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 md:text-xs ${
          active ? "text-raspberry font-bold" : "group-hover:text-raspberry"
        }`}
      >
        {label}
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
