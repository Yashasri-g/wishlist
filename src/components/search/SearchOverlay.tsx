"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { CATALOG, FABRICS, OCCASIONS, SUBCATEGORIES, filterProducts, shopHref } from "@/data/taxonomy";

const EASE = [0.16, 1, 0.3, 1] as const;
const POPULAR = ["Saree", "Lehenga", "Blazer", "Denim", "Kurta set", "Party dress"];

/** Full-width search panel: popular searches, matching groups, live product results. */
export default function SearchOverlay() {
  const { isSearchOpen, setIsSearchOpen } = useShop();
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const close = () => setIsSearchOpen(false);

  useEffect(() => {
    if (!isSearchOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => input.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsSearchOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [isSearchOpen, setIsSearchOpen]);

  // close when the route changes
  useEffect(() => {
    const t = window.setTimeout(() => setIsSearchOpen(false), 0);
    return () => window.clearTimeout(t);
  }, [pathname, setIsSearchOpen]);

  const term = q.trim();
  const results = useMemo(() => (term.length > 1 ? filterProducts({ q: term }) : []), [term]);
  const groups = useMemo(() => {
    if (term.length < 2) return [];
    const t = term.toLowerCase();
    return [
      ...SUBCATEGORIES.filter((s) => s.label.toLowerCase().includes(t) || s.sub.toLowerCase().includes(t)).map((s) => ({ label: s.label, kind: "Category", href: shopHref({ cat: s.cat, sub: s.sub }) })),
      ...OCCASIONS.filter((o) => o.label.toLowerCase().includes(t)).map((o) => ({ label: o.label, kind: "Occasion", href: shopHref({ occ: o.label }) })),
      ...FABRICS.filter((f) => f.label.toLowerCase().includes(t)).map((f) => ({ label: f.label, kind: "Fabric", href: shopHref({ fab: f.label }) })),
    ].slice(0, 6);
  }, [term]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term) return;
    router.push(shopHref({ q: term }));
    close();
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div className="fixed inset-0 z-[85]" initial="h" animate="s" exit="h" role="dialog" aria-modal="true" aria-label="Search">
          <motion.div variants={{ h: { opacity: 0 }, s: { opacity: 1 } }} className="absolute inset-0 bg-ink/50" onClick={close} />
          <motion.div
            variants={{ h: { clipPath: "inset(0 0 100% 0)" }, s: { clipPath: "inset(0 0 0% 0)" } }}
            transition={{ duration: 0.6, ease: EASE }}
            className="absolute inset-x-0 top-0 max-h-[92vh] overflow-y-auto bg-ivory"
          >
            <div className="mx-auto max-w-[1500px] px-4 pb-10 pt-5 sm:px-8">
              <form onSubmit={submit} className="flex items-center gap-3 border-b-2 border-ink pb-3">
                <Search className="h-6 w-6 shrink-0" />
                <label htmlFor="site-search" className="sr-only">Search the store</label>
                <input
                  id="site-search"
                  ref={input}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search sarees, dresses, blazers, fabrics…"
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent font-display text-3xl italic outline-none placeholder:text-ink/35 md:text-5xl"
                />
                {q && (
                  <button type="button" onClick={() => { setQ(""); input.current?.focus(); }} className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/60 hover:text-raspberry">Clear</button>
                )}
                <button type="button" onClick={close} aria-label="Close search" className="flex h-11 w-11 shrink-0 items-center justify-center hover:text-raspberry">
                  <X className="h-7 w-7" />
                </button>
              </form>

              {term.length < 2 ? (
                <div className="grid gap-10 pt-8 md:grid-cols-[1fr_2fr]">
                  <div>
                    <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-ink/45">Popular searches</p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR.map((p) => (
                        <button key={p} type="button" onClick={() => setQ(p)} className="border border-ink/20 px-4 py-2 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-ivory">{p}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-ink/45">Trending</p>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                      {CATALOG.filter((p) => p.isTrending).slice(0, 6).map((p) => (
                        <Link key={p.id} href={`/product/${p.id}`} className="group">
                          <span className="relative block aspect-[3/4] overflow-hidden bg-sand">
                            <Image src={p.images[0]} alt="" fill sizes="160px" className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                          </span>
                          <span className="mt-2 line-clamp-1 block text-xs">{p.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-10 pt-8 md:grid-cols-[1fr_3fr]" aria-live="polite">
                  <div>
                    <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-ink/45">Browse</p>
                    {groups.length === 0 && <p className="text-sm text-ink/55">No matching categories.</p>}
                    <ul>
                      {groups.map((g) => (
                        <li key={g.kind + g.label}>
                          <Link href={g.href} className="flex items-baseline justify-between border-b border-ink/10 py-3 transition-colors hover:text-raspberry">
                            <span className="font-display text-2xl italic">{g.label}</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-ink/45">{g.kind}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="mb-4 flex items-end justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ink/45">{results.length} {results.length === 1 ? "result" : "results"} for “{term}”</p>
                      {results.length > 0 && (
                        <Link href={shopHref({ q: term })} className="inline-flex items-center gap-2 border-b border-ink pb-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] hover:border-raspberry hover:text-raspberry">
                          View all <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                    {results.length === 0 ? (
                      <div className="py-10">
                        <p className="font-display text-4xl italic">Nothing found.</p>
                        <p className="mt-2 text-sm text-ink/60">Try a category (saree, blazer), an occasion (wedding) or a fabric (silk).</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
                        {results.slice(0, 8).map((p, i) => (
                          <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE, delay: i * 0.04 }}>
                            <Link href={`/product/${p.id}`} className="group block">
                              <span className="relative block aspect-[3/4] overflow-hidden bg-sand">
                                <Image src={p.images[0]} alt={`${p.name} (placeholder imagery)`} fill sizes="(max-width: 640px) 46vw, 20vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                              </span>
                              <span className="mt-2 line-clamp-1 block text-[14px] font-medium group-hover:text-raspberry">{p.name}</span>
                              <span className="text-sm font-semibold">₹{p.price.toLocaleString("en-IN")}</span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
