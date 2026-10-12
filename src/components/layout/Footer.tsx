"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/data/site";
import { shopHref } from "@/data/taxonomy";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "WISHLIST · Western", href: "/wishlist" },
      { label: "PREMIUM · Ethnic", href: "/wishlist-premium" },
      { label: "New arrivals", href: shopHref({ col: "new" }) },
      { label: "Best sellers", href: shopHref({ col: "best" }) },
      { label: "Sale", href: shopHref({ col: "sale" }) },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Dresses", href: shopHref({ cat: "Western", sub: "Dresses" }) },
      { label: "Co-ords", href: shopHref({ cat: "Western", sub: "Co-ords" }) },
      { label: "Blazers & suits", href: shopHref({ cat: "Western", sub: "Blazers & Suits" }) },
      { label: "Sarees", href: shopHref({ cat: "Ethnic", sub: "Sarees" }) },
      { label: "Lehengas", href: shopHref({ cat: "Ethnic", sub: "Lehengas" }) },
      { label: "Kurtas & sets", href: shopHref({ cat: "Ethnic", sub: "Kurtas & Sets" }) },
    ],
  },
  {
    title: "Occasions",
    links: ["Wedding", "Festive", "Party", "Work", "Casual", "Brunch"].map((o) => ({ label: o, href: shopHref({ occ: o }) })),
  },
  {
    title: "Fabrics",
    links: ["Silk", "Chiffon", "Georgette", "Velvet", "Cotton", "Denim"].map((f) => ({ label: f, href: shopHref({ fab: f }) })),
  },
  {
    title: "Help",
    links: [
      { label: "Shipping", href: "/shipping" },
      { label: "Returns & exchanges", href: "/returns" },
      { label: "Contact", href: "/contact" },
      { label: "Wishlist", href: "/wishlist-saved" },
      { label: "Bag", href: "/cart" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setState(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "done" : "error");
  };

  return (
    <footer className="relative overflow-hidden bg-ink text-ivory">
      <div className="mx-auto max-w-[1800px] px-4 pt-20 sm:px-8 md:pt-24">
        <div className="grid items-end gap-10 border-b border-ivory/15 pb-16 lg:grid-cols-2">
          <div>
            <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-gold">Newsletter</p>
            <h2 className="font-display text-5xl italic leading-[0.95] md:text-7xl">
              Be the first<br />to know.
            </h2>
          </div>
          <form onSubmit={submit} noValidate className="max-w-xl lg:ml-auto lg:w-full">
            <label htmlFor="nl-email" className="sr-only">Email address</label>
            <div className="flex border-b border-ivory/40 transition-colors focus-within:border-raspberry">
              <input
                id="nl-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setState("idle");
                }}
                placeholder="Your email address"
                aria-invalid={state === "error"}
                aria-describedby="nl-msg"
                className="flex-1 bg-transparent py-4 text-base outline-none placeholder:text-ivory/40"
              />
              <button type="submit" aria-label="Subscribe" className="px-2 transition-colors hover:text-raspberry">
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            <p id="nl-msg" role="status" className="mt-3 min-h-4 text-xs text-ivory/60">
              {state === "error" && <span className="text-blush">Please enter a valid email address.</span>}
              {state === "done" && "Demo only: nothing was sent or stored."}
            </p>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 sm:grid-cols-3 lg:grid-cols-7">
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <h3 className="mb-5 font-sans text-[11px] uppercase tracking-[0.3em] text-ivory/50">{c.title}</h3>
              <ul className="space-y-3 text-[14px]">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition-colors hover:text-raspberry">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="mb-5 font-sans text-[11px] uppercase tracking-[0.3em] text-ivory/50">Follow</h3>
            <ul className="space-y-3 text-[14px]">
              <li><a href={SITE.instagram.wishlist} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-raspberry">WISHLIST ↗</a></li>
              <li><a href={SITE.instagram.premium} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold">PREMIUM ↗</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="-mb-[3vw] select-none text-center font-display text-[26vw] italic leading-[0.8] text-ivory/[0.07]">
        Wishlist
      </div>

      <div className="relative mx-auto flex max-w-[1800px] flex-col justify-between gap-2 border-t border-ivory/10 px-4 py-6 text-[11px] text-ivory/50 sm:flex-row sm:px-8">
        <span>© 2026 The Wishlist · Women&apos;s Clothing</span>
        <span>Frontend demo · checkout is simulated, no payments are processed</span>
      </div>
    </footer>
  );
}
