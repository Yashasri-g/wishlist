"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import ProductTile from "@/components/shop/ProductTile";
import Row from "@/components/shop/Row";
import RecentRow from "@/components/shop/RecentRow";
import type { Product } from "@/types";
import {
  CATALOG,
  COLLECTIONS,
  FABRICS,
  OCCASIONS,
  PRICE_BANDS,
  SUBCATEGORIES,
  byCollection,
  filterProducts,
  shopHref,
  type ShopFilters,
} from "@/data/taxonomy";

type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "discount";
const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest first" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "discount", label: "Biggest discount" },
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const PAGE = 24;
const EASE = [0.16, 1, 0.3, 1] as const;

function sortList(list: Product[], by: SortKey): Product[] {
  const l = [...list];
  switch (by) {
    case "newest":
      return l.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "price-asc":
      return l.sort((a, b) => a.price - b.price);
    case "price-desc":
      return l.sort((a, b) => b.price - a.price);
    case "discount":
      return l.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0));
    default: {
      const score = (p: Product) => (p.isBestseller ? 3 : 0) + (p.isTrending ? 2 : 0) + (p.isNew ? 1 : 0);
      return l.sort((a, b) => score(b) - score(a) || b.createdAt.localeCompare(a.createdAt));
    }
  }
}

function titleFor(f: ShopFilters): { title: string; eyebrow: string } {
  if (f.q) return { title: `“${f.q}”`, eyebrow: "Search results" };
  if (f.col) {
    const c = COLLECTIONS.find((x) => x.key === f.col)!;
    return { title: c.label, eyebrow: c.blurb };
  }
  if (f.sub) return { title: SUBCATEGORIES.find((s) => s.sub === f.sub)?.label ?? f.sub, eyebrow: f.cat === "Ethnic" ? "WISHLIST PREMIUM · Ethnic" : "WISHLIST · Western" };
  if (f.occ) return { title: `${f.occ} edit`, eyebrow: "Shop by occasion" };
  if (f.fab) return { title: f.fab, eyebrow: "Shop by fabric" };
  if (f.price) return { title: PRICE_BANDS.find((b) => b.key === f.price)!.label, eyebrow: "Shop by budget" };
  if (f.size) return { title: `Size ${f.size}`, eyebrow: "Shop by size" };
  if (f.cat) return { title: f.cat === "Ethnic" ? "Ethnic wear" : "Western wear", eyebrow: f.cat === "Ethnic" ? "WISHLIST PREMIUM" : "WISHLIST" };
  return { title: "All products", eyebrow: "The Wishlist" };
}

function Group({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink/10 py-4">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-[0.22em]">
        {title}
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: EASE }} className="overflow-hidden">
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Option({ active, label, count, onClick }: { active: boolean; label: string; count: number; onClick: () => void }) {
  const disabled = count === 0 && !active;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`flex w-full items-center gap-3 py-[6px] text-left text-[14px] transition-colors ${disabled ? "cursor-not-allowed text-ink/30" : "hover:text-raspberry"} ${active ? "font-semibold text-raspberry" : ""}`}
    >
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center border ${active ? "border-raspberry bg-raspberry text-white" : "border-ink/30"}`}>{active && <Check className="h-3 w-3" />}</span>
      <span className="flex-1">{label}</span>
      <span className="text-[11px] text-ink/40">{count}</span>
    </button>
  );
}

export default function ShopClient() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [visible, setVisible] = useState(PAGE);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [cols, setCols] = useState<3 | 4>(4);

  const f: ShopFilters = useMemo(
    () => ({
      cat: (sp.get("cat") as ShopFilters["cat"]) || undefined,
      sub: (sp.get("sub") as ShopFilters["sub"]) || undefined,
      occ: sp.get("occ") || undefined,
      fab: sp.get("fab") || undefined,
      price: (sp.get("price") as ShopFilters["price"]) || undefined,
      col: (sp.get("col") as ShopFilters["col"]) || undefined,
      q: sp.get("q") || undefined,
      size: sp.get("size") || undefined,
      stock: sp.get("stock") || undefined,
    }),
    [sp]
  );
  const sort = (sp.get("sort") as SortKey) || "featured";

  const setParam = useCallback(
    (patch: Record<string, string | undefined>) => {
      const next = new URLSearchParams(sp.toString());
      Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
      // choosing a sub-category implies its parent category
      if (patch.sub) next.set("cat", SUBCATEGORIES.find((s) => s.sub === patch.sub)?.cat ?? "");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      setVisible(PAGE);
    },
    [sp, router, pathname]
  );
  const toggle = (k: keyof ShopFilters, v: string) => setParam({ [k]: f[k] === v ? undefined : v, ...(k === "cat" ? { sub: undefined } : {}) });

  const results = useMemo(() => sortList(filterProducts(f), sort), [f, sort]);
  // facet counts: what you'd get by picking that option, other filters held
  const count = (patch: Partial<ShopFilters>) => filterProducts({ ...f, ...patch }).length;

  const { title, eyebrow } = titleFor(f);
  const activeChips: { k: string; label: string; clear: Record<string, undefined> }[] = [];
  if (f.cat && !f.sub) activeChips.push({ k: "cat", label: f.cat, clear: { cat: undefined } });
  if (f.sub) activeChips.push({ k: "sub", label: SUBCATEGORIES.find((s) => s.sub === f.sub)?.label ?? f.sub, clear: { sub: undefined } });
  if (f.occ) activeChips.push({ k: "occ", label: f.occ, clear: { occ: undefined } });
  if (f.fab) activeChips.push({ k: "fab", label: f.fab, clear: { fab: undefined } });
  if (f.price) activeChips.push({ k: "price", label: PRICE_BANDS.find((b) => b.key === f.price)!.label, clear: { price: undefined } });
  if (f.col) activeChips.push({ k: "col", label: COLLECTIONS.find((c) => c.key === f.col)!.label, clear: { col: undefined } });
  if (f.size) activeChips.push({ k: "size", label: `Size ${f.size}`, clear: { size: undefined } });
  if (f.stock) activeChips.push({ k: "stock", label: "In stock", clear: { stock: undefined } });
  if (f.q) activeChips.push({ k: "q", label: `“${f.q}”`, clear: { q: undefined } });

  // reset pagination when the filter set changes
  useEffect(() => {
    const t = window.setTimeout(() => setVisible(PAGE), 0);
    return () => window.clearTimeout(t);
  }, [sp]);

  const subOptions = SUBCATEGORIES.filter((s) => !f.cat || s.cat === f.cat);

  const Sidebar = (
    <div>
      <Group title="Category">
        {(["Western", "Ethnic"] as const).map((c) => (
          <Option key={c} active={f.cat === c} label={c === "Western" ? "Western · WISHLIST" : "Ethnic · PREMIUM"} count={count({ cat: c, sub: undefined })} onClick={() => toggle("cat", c)} />
        ))}
        <div className="mt-2 border-l border-ink/10 pl-3">
          {subOptions.map((s) => (
            <Option key={s.sub} active={f.sub === s.sub} label={s.label} count={count({ sub: s.sub, cat: s.cat })} onClick={() => setParam({ sub: f.sub === s.sub ? undefined : s.sub })} />
          ))}
        </div>
      </Group>
      <Group title="Occasion">
        {OCCASIONS.map((o) => (
          <Option key={o.label} active={f.occ === o.label} label={o.label} count={count({ occ: o.label })} onClick={() => toggle("occ", o.label)} />
        ))}
      </Group>
      <Group title="Fabric" defaultOpen={false}>
        {FABRICS.map((x) => (
          <Option key={x.label} active={f.fab === x.label} label={x.label} count={count({ fab: x.label })} onClick={() => toggle("fab", x.label)} />
        ))}
      </Group>
      <Group title="Price">
        {PRICE_BANDS.map((b) => (
          <Option key={b.key} active={f.price === b.key} label={b.label} count={count({ price: b.key })} onClick={() => toggle("price", b.key)} />
        ))}
      </Group>
      <Group title="Size" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => {
            const n = count({ size: s });
            return (
              <button
                key={s}
                type="button"
                disabled={n === 0 && f.size !== s}
                aria-pressed={f.size === s}
                onClick={() => toggle("size", s)}
                className={`min-w-11 border px-3 py-2 text-xs font-medium transition-colors ${f.size === s ? "border-ink bg-ink text-ivory" : "border-ink/25 hover:border-ink"} disabled:cursor-not-allowed disabled:opacity-30`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Group>
      <Group title="Collections" defaultOpen={false}>
        {COLLECTIONS.map((c) => (
          <Option key={c.key} active={f.col === c.key} label={c.label} count={count({ col: c.key })} onClick={() => toggle("col", c.key)} />
        ))}
      </Group>
      <Group title="Availability" defaultOpen={false}>
        <Option active={f.stock === "1"} label="In stock only" count={count({ stock: "1" })} onClick={() => toggle("stock", "1")} />
      </Group>
    </div>
  );

  const shown = results.slice(0, visible);
  const similar = useMemo(() => (results.length === 0 ? byCollection("trending").slice(0, 10) : []), [results.length]);

  return (
    <div className="mx-auto max-w-[1800px] px-4 pb-20 sm:px-8">
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="pt-6 text-[11px] uppercase tracking-[0.16em] text-ink/50">
        <Link href="/" className="hover:text-raspberry">Home</Link> <span className="mx-1.5">/</span>
        <Link href="/shop" className="hover:text-raspberry">Shop</Link>
        {title !== "All products" && (<><span className="mx-1.5">/</span><span className="text-ink">{title}</span></>)}
      </nav>

      {/* heading */}
      <header className="flex flex-wrap items-end justify-between gap-4 pb-6 pt-5">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-raspberry">{eyebrow}</p>
          <h1 className="font-display text-5xl font-medium leading-none tracking-tight md:text-7xl">{title}</h1>
        </div>
        <p className="text-sm text-ink/55" aria-live="polite">{results.length} {results.length === 1 ? "style" : "styles"}</p>
      </header>

      {/* quick category chips (scrolling) */}
      <div className="nf-track -mx-4 flex gap-2 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:px-8" role="list" aria-label="Quick categories">
        <Link href="/shop" role="listitem" className={`shrink-0 border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${activeChips.length === 0 ? "border-ink bg-ink text-ivory" : "border-ink/20 hover:border-ink"}`}>All</Link>
        {SUBCATEGORIES.map((s) => (
          <Link key={s.sub} role="listitem" href={shopHref({ cat: s.cat, sub: s.sub })} className={`shrink-0 border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${f.sub === s.sub ? "border-raspberry bg-raspberry text-white" : "border-ink/20 hover:border-ink"}`}>
            {s.label}
          </Link>
        ))}
      </div>

      {/* toolbar */}
      <div className="sticky top-[104px] z-30 -mx-4 flex flex-wrap items-center justify-between gap-3 border-y border-ink/10 bg-ivory/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8 max-lg:top-[68px]">
        <button type="button" onClick={() => setMobileFilters(true)} className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] lg:hidden">
          <SlidersHorizontal className="h-4 w-4" /> Filters {activeChips.length > 0 && <span className="rounded-full bg-raspberry px-1.5 text-white">{activeChips.length}</span>}
        </button>
        <div className="hidden flex-wrap items-center gap-2 lg:flex">
          {activeChips.map((c) => (
            <button key={c.k} type="button" onClick={() => setParam(c.clear)} className="group inline-flex items-center gap-1.5 border border-ink/20 px-3 py-1.5 text-xs transition-colors hover:border-raspberry hover:text-raspberry">
              {c.label} <X className="h-3 w-3" />
            </button>
          ))}
          {activeChips.length > 1 && (
            <Link href="/shop" className="px-2 text-xs font-semibold text-raspberry underline-offset-4 hover:underline">Clear all</Link>
          )}
          {activeChips.length === 0 && <span className="text-xs text-ink/50">Refine by category, occasion, fabric, price and size</span>}
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-1 md:flex" aria-label="Grid density">
            {([3, 4] as const).map((n) => (
              <button key={n} type="button" onClick={() => setCols(n)} aria-pressed={cols === n} aria-label={`${n} columns`} className={`flex h-8 w-8 items-center justify-center border text-[11px] font-semibold ${cols === n ? "border-ink bg-ink text-ivory" : "border-ink/20"}`}>
                {n}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
            <span className="hidden sm:inline">Sort</span>
            <select value={sort} onChange={(e) => setParam({ sort: e.target.value === "featured" ? undefined : e.target.value })} className="border border-ink/20 bg-white px-3 py-2 text-[13px] font-normal normal-case tracking-normal outline-none focus:border-ink">
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-10 pt-6 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">{Sidebar}</aside>

        <div>
          {results.length === 0 ? (
            <div className="py-16 text-center">
              <h2 className="font-display text-4xl italic">Nothing matches that — yet.</h2>
              <p className="mt-3 text-sm text-ink/60">Try removing a filter, or browse what&apos;s trending.</p>
              <Link href="/shop" className="mt-6 inline-block bg-ink px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory hover:bg-raspberry">Clear filters</Link>
            </div>
          ) : (
            <motion.div layout className={`grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 md:grid-cols-3 ${cols === 4 ? "xl:grid-cols-4" : ""}`}>
              <AnimatePresence mode="popLayout">
                {shown.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.55, ease: EASE, delay: Math.min(i, 8) * 0.04 }}
                  >
                    <ProductTile product={p} priority={i < 4} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {results.length > visible && (
            <div className="mt-12 text-center">
              <p className="mb-3 text-xs text-ink/50">Showing {shown.length} of {results.length}</p>
              <button type="button" onClick={() => setVisible((v) => v + PAGE)} className="border border-ink px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors hover:bg-ink hover:text-ivory">Load more</button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-20 space-y-16">
        {similar.length > 0 && (
          <Row title="Trending instead" eyebrow="You might like" href={shopHref({ col: "trending" })}>
            {similar.map((p) => <ProductTile key={p.id} product={p} />)}
          </Row>
        )}
        <Row title="New arrivals" eyebrow="Just landed" href={shopHref({ col: "new" })}>
          {byCollection("new", CATALOG).slice(0, 12).map((p) => <ProductTile key={p.id} product={p} />)}
        </Row>
        <RecentRow />
      </div>

      {/* mobile filter sheet */}
      <AnimatePresence>
        {mobileFilters && (
          <motion.div className="fixed inset-0 z-[70] lg:hidden" initial="h" animate="s" exit="h" role="dialog" aria-modal="true" aria-label="Filters">
            <motion.div variants={{ h: { opacity: 0 }, s: { opacity: 1 } }} className="absolute inset-0 bg-ink/50" onClick={() => setMobileFilters(false)} />
            <motion.div variants={{ h: { y: "100%" }, s: { y: 0 } }} transition={{ duration: 0.5, ease: EASE }} className="absolute inset-x-0 bottom-0 flex max-h-[88%] flex-col bg-ivory">
              <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.22em]">Filters</h2>
                <button type="button" onClick={() => setMobileFilters(false)} aria-label="Close filters" className="flex h-9 w-9 items-center justify-center"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-5">{Sidebar}</div>
              <div className="flex gap-3 border-t border-ink/10 p-4">
                <Link href="/shop" onClick={() => setMobileFilters(false)} className="flex-1 border border-ink py-3.5 text-center text-[11px] font-semibold uppercase tracking-[0.2em]">Clear</Link>
                <button type="button" onClick={() => setMobileFilters(false)} className="flex-1 bg-ink py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory">Show {results.length}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
