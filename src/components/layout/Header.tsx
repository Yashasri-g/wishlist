"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import Logo from "@/components/ui/Logo";
import { SITE } from "@/data/site";
import {
  CATEGORY_TREE,
  FABRICS,
  OCCASIONS,
  PRICE_BANDS,
  countFor,
  shopHref,
} from "@/data/taxonomy";
import { img, PICK } from "@/data/images";

type MegaKey = "wishlist" | "premium" | "occasion" | "fabric";

const EASE = [0.16, 1, 0.3, 1] as const;

function ColTitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-ink/45">{children}</p>;
}

function MegaLink({ href, children, count, onClick }: { href: string; children: React.ReactNode; count?: number; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="group/l flex items-baseline justify-between gap-3 py-[5px] text-[14px] text-ink/80 transition-colors hover:text-raspberry">
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover/l:scale-x-100" />
      </span>
      {count !== undefined && <span className="text-[11px] text-ink/35">{count}</span>}
    </Link>
  );
}

function Feature({ href, image, label, sub, onClick }: { href: string; image: string; label: string; sub: string; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="group/f relative block aspect-[3/4] w-full overflow-hidden bg-sand">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" className="h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-out group-hover/f:scale-105" />
      <span className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
      <span className="absolute inset-x-3 bottom-3 text-ivory">
        <span className="block text-[10px] uppercase tracking-[0.24em] text-ivory/75">{sub}</span>
        <span className="block font-display text-2xl italic leading-tight">{label}</span>
      </span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { cartCount, wishlist, setIsCartOpen, setIsSearchOpen } = useShop();
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState<MegaKey | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [openAcc, setOpenAcc] = useState<string | null>(null);
  const [promo, setPromo] = useState(0);
  const lastY = useRef(0);
  const closeT = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 220 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setPromo((p) => (p + 1) % SITE.promos.length), 4200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMega(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mega]);

  const open = (k: MegaKey) => {
    window.clearTimeout(closeT.current);
    setMega(k);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeT.current);
    closeT.current = window.setTimeout(() => setMega(null), 140);
  };
  const close = () => setMega(null);

  const navBtn = (k: MegaKey, label: React.ReactNode, tone = "") => (
    <button
      type="button"
      onMouseEnter={() => open(k)}
      onFocus={() => open(k)}
      onClick={() => (mega === k ? close() : open(k))}
      aria-expanded={mega === k}
      className={`group/n relative flex items-center gap-1 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors hover:text-raspberry ${tone} ${mega === k ? "text-raspberry" : ""}`}
    >
      {label}
      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${mega === k ? "rotate-180" : ""}`} />
      <span className={`absolute inset-x-0 bottom-2.5 h-[2px] origin-left bg-current transition-transform duration-300 ${mega === k ? "scale-x-100" : "scale-x-0 group-hover/n:scale-x-100"}`} />
    </button>
  );
  const navLink = (href: string, label: string, tone = "") => (
    <Link
      href={href}
      onMouseEnter={close}
      className={`group/n relative py-4 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors hover:text-raspberry ${tone} ${pathname === href.split("?")[0] && !href.includes("?") ? "text-raspberry" : ""}`}
    >
      {label}
      <span className="absolute inset-x-0 bottom-2.5 h-[2px] origin-left scale-x-0 bg-current transition-transform duration-300 group-hover/n:scale-x-100" />
    </Link>
  );

  const iconBtn = "relative flex h-11 w-11 items-center justify-center transition-colors hover:text-raspberry";
  const badge = "absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white";

  const W = CATEGORY_TREE.Western;
  const E = CATEGORY_TREE.Ethnic;

  return (
    <>
      {/* promo strip: rotating messages */}
      <div className="relative h-9 overflow-hidden bg-ink text-ivory">
        <AnimatePresence mode="wait">
          <motion.p
            key={promo}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute inset-0 flex items-center justify-center px-4 text-center text-[10px] uppercase tracking-[0.22em] md:text-[11px]"
          >
            {SITE.promos[promo]}
          </motion.p>
        </AnimatePresence>
        <div className="absolute right-6 top-0 hidden h-full items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-ivory/60 lg:flex">
          <Link href="/shipping" className="hover:text-ivory">Shipping & Returns</Link>
          <Link href="/contact" className="hover:text-ivory">Contact</Link>
        </div>
      </div>

      <motion.header
        animate={{ y: hidden && !mega && !drawer ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE }}
        className="sticky top-0 z-50 border-b border-ink/10 bg-ivory/95 backdrop-blur-md"
        onMouseLeave={scheduleClose}
      >
        {/* row 1 */}
        <div className="mx-auto grid h-[72px] max-w-[1800px] grid-cols-[auto_1fr_auto] items-center gap-3 px-3 sm:h-[78px] sm:px-8 md:grid-cols-[1fr_minmax(320px,560px)_1fr] md:gap-8 lg:h-[88px]">
          <div className="flex items-center">
            <button type="button" onClick={() => setDrawer(true)} className="-ml-2 flex h-11 w-11 items-center justify-center lg:hidden" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" aria-label="The Wishlist — home" className="hidden shrink-0 lg:block" onMouseEnter={close}>
              <Logo height={76} className="h-[68px] lg:h-[78px] w-auto max-w-[190px]" />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Link href="/" aria-label="The Wishlist — home" className="lg:hidden">
              <Logo height={60} className="h-[52px] sm:h-[58px] w-auto max-w-[140px]" />
            </Link>
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              onMouseEnter={close}
              className="hidden h-11 w-full items-center gap-3 border border-ink/15 bg-white px-4 text-left text-sm text-ink/50 transition-colors hover:border-ink/40 lg:flex"
              aria-label="Search products"
            >
              <Search className="h-4 w-4 text-ink" />
              Search sarees, dresses, blazers…
            </button>
          </div>

          <div className="flex items-center justify-end" onMouseEnter={close}>
            <button type="button" onClick={() => setIsSearchOpen(true)} className={`${iconBtn} lg:hidden`} aria-label="Search">
              <Search className="h-[22px] w-[22px]" />
            </button>
            <Link href="/wishlist-saved" data-fly-target="wishlist" className={iconBtn} aria-label={`Wishlist, ${wishlist.length} saved`}>
              <Heart className="h-[22px] w-[22px]" />
              {wishlist.length > 0 && <span data-badge className={`${badge} bg-raspberry`}>{wishlist.length}</span>}
            </Link>
            <button type="button" data-fly-target="cart" onClick={() => setIsCartOpen(true)} className={iconBtn} aria-label={`Open bag, ${cartCount} items`}>
              <ShoppingBag className="h-[22px] w-[22px]" />
              {cartCount > 0 && <span data-badge className={`${badge} bg-ink`}>{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* row 2: nav (desktop) */}
        <nav aria-label="Primary" className="hidden border-t border-ink/[0.07] lg:block">
          <div className="mx-auto flex max-w-[1800px] items-center justify-center gap-9 px-8">
            {navLink("/shop?col=new", "New Arrivals")}
            {navBtn("wishlist", "WISHLIST")}
            {navBtn("premium", "Premium", "text-gold")}
            {navBtn("occasion", "Occasions")}
            {navBtn("fabric", "Fabrics")}
            {navLink("/shop?col=best", "Best Sellers")}
            {navLink("/shop?col=sale", "Sale", "text-raspberry")}
          </div>
        </nav>

        {/* mega panels */}
        <AnimatePresence>
          {mega && (
            <motion.div
              key="mega"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE }}
              onMouseEnter={() => window.clearTimeout(closeT.current)}
              className="absolute inset-x-0 top-full hidden border-t border-ink/10 bg-ivory shadow-[0_40px_60px_-30px_rgba(20,17,15,0.35)] lg:block"
            >
              <div className="mx-auto grid max-w-[1500px] grid-cols-[1fr_1fr_1fr_1.3fr] gap-10 px-8 py-9">
                {(mega === "wishlist" || mega === "premium") && (() => {
                  const t = mega === "wishlist" ? W : E;
                  const cat = mega === "wishlist" ? "Western" : "Ethnic";
                  const occ = mega === "wishlist" ? ["Party", "Work", "Casual", "Brunch"] : ["Wedding", "Festive", "Party", "Casual"];
                  const fabs = mega === "wishlist" ? ["Denim", "Satin", "Wool Blend", "Linen"] : ["Silk", "Chiffon", "Georgette", "Net", "Velvet"];
                  return (
                    <>
                      <div>
                        <ColTitle>{cat} by category</ColTitle>
                        {t.subs.map((s) => (
                          <MegaLink key={s.sub} href={shopHref({ cat, sub: s.sub })} count={countFor({ cat, sub: s.sub })} onClick={close}>{s.label}</MegaLink>
                        ))}
                        <MegaLink href={t.href} onClick={close}><strong className="font-semibold text-raspberry">Shop the full edit →</strong></MegaLink>
                      </div>
                      <div>
                        <ColTitle>Shop by occasion</ColTitle>
                        {occ.map((o) => (
                          <MegaLink key={o} href={shopHref({ cat, occ: o })} count={countFor({ cat, occ: o })} onClick={close}>{o}</MegaLink>
                        ))}
                        <div className="mt-6" />
                        <ColTitle>Shop by fabric</ColTitle>
                        {fabs.map((f) => (
                          <MegaLink key={f} href={shopHref({ cat, fab: f })} count={countFor({ cat, fab: f })} onClick={close}>{f}</MegaLink>
                        ))}
                      </div>
                      <div>
                        <ColTitle>Shop by price</ColTitle>
                        {PRICE_BANDS.map((b) => (
                          <MegaLink key={b.key} href={shopHref({ cat, price: b.key })} count={countFor({ cat, price: b.key })} onClick={close}>{b.label}</MegaLink>
                        ))}
                        <div className="mt-6" />
                        <ColTitle>Collections</ColTitle>
                        <MegaLink href={shopHref({ cat, col: "new" })} onClick={close}>New arrivals</MegaLink>
                        <MegaLink href={shopHref({ cat, col: "best" })} onClick={close}>Best sellers</MegaLink>
                        <MegaLink href={shopHref({ cat, col: "trending" })} onClick={close}>Trending now</MegaLink>
                        <MegaLink href={shopHref({ cat, col: "sale" })} onClick={close}>On sale</MegaLink>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {mega === "wishlist" ? (
                          <>
                            <Feature href={shopHref({ cat: "Western", sub: "Blazers & Suits" })} image={img(PICK.beigeBlazer, 500)} label="Power tailoring" sub="Blazers & Suits" onClick={close} />
                            <Feature href={shopHref({ cat: "Western", sub: "Dresses" })} image={img(PICK.amethystDress, 500)} label="After dark" sub="Dresses" onClick={close} />
                          </>
                        ) : (
                          <>
                            <Feature href={shopHref({ cat: "Ethnic", sub: "Lehengas" })} image={img(PICK.marigoldLehenga, 500)} label="The wedding edit" sub="Lehengas" onClick={close} />
                            <Feature href={shopHref({ cat: "Ethnic", sub: "Sarees" })} image={img(PICK.greenSaree, 500)} label="Drape stories" sub="Sarees" onClick={close} />
                          </>
                        )}
                      </div>
                    </>
                  );
                })()}

                {mega === "occasion" && (
                  <div className="col-span-4">
                    <ColTitle>Shop by occasion</ColTitle>
                    <div className="grid grid-cols-7 gap-4">
                      {OCCASIONS.map((o) => (
                        <Feature key={o.label} href={shopHref({ occ: o.label })} image={o.image} label={o.label} sub={`${countFor({ occ: o.label })} styles`} onClick={close} />
                      ))}
                    </div>
                  </div>
                )}

                {mega === "fabric" && (
                  <div className="col-span-4">
                    <ColTitle>Shop by fabric</ColTitle>
                    <div className="grid grid-cols-5 gap-x-10 gap-y-1">
                      {FABRICS.map((f) => (
                        <MegaLink key={f.label} href={shopHref({ fab: f.label })} count={countFor({ fab: f.label })} onClick={close}>
                          <span className="font-display text-2xl italic">{f.label}</span>
                        </MegaLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* click-away backdrop while a mega panel is open */}
      <AnimatePresence>
        {mega && (
          <motion.div
            key="veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseEnter={close}
            className="fixed inset-0 top-[104px] z-40 hidden bg-ink/30 lg:block"
          />
        )}
      </AnimatePresence>

      {/* mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] lg:hidden" initial="h" animate="s" exit="h">
            <motion.div variants={{ h: { opacity: 0 }, s: { opacity: 1 } }} className="absolute inset-0 bg-ink/50" onClick={() => setDrawer(false)} />
            <motion.div
              variants={{ h: { x: "-100%" }, s: { x: 0 } }}
              transition={{ duration: 0.5, ease: EASE }}
              className="absolute inset-y-0 left-0 flex w-[88%] max-w-[420px] flex-col overflow-y-auto bg-ivory"
            >
              <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
                <Logo height={58} className="h-[52px] w-auto max-w-[140px]" />
                <button type="button" onClick={() => setDrawer(false)} className="flex h-11 w-11 items-center justify-center" aria-label="Close menu">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1 px-4 py-2 text-[15px]">
                {[
                  { k: "w", label: "WISHLIST — Western", cat: "Western" as const, tree: W },
                  { k: "p", label: "PREMIUM — Ethnic", cat: "Ethnic" as const, tree: E },
                ].map((g) => (
                  <div key={g.k} className="border-b border-ink/10">
                    <button type="button" onClick={() => setOpenAcc(openAcc === g.k ? null : g.k)} className="flex w-full items-center justify-between py-4 font-semibold uppercase tracking-[0.14em]" aria-expanded={openAcc === g.k}>
                      {g.label}
                      <ChevronDown className={`h-4 w-4 transition-transform ${openAcc === g.k ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {openAcc === g.k && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
                          <div className="grid grid-cols-2 gap-x-4 pb-4">
                            {g.tree.subs.map((s) => (
                              <Link key={s.sub} href={shopHref({ cat: g.cat, sub: s.sub })} onClick={() => setDrawer(false)} className="py-2 text-ink/75">
                                {s.label}
                              </Link>
                            ))}
                            <Link href={g.tree.href} onClick={() => setDrawer(false)} className="py-2 font-semibold text-raspberry">Shop all →</Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                {[
                  { k: "o", label: "Occasions", items: OCCASIONS.map((o) => ({ l: o.label, h: shopHref({ occ: o.label }) })) },
                  { k: "f", label: "Fabrics", items: FABRICS.map((f) => ({ l: f.label, h: shopHref({ fab: f.label }) })) },
                ].map((g) => (
                  <div key={g.k} className="border-b border-ink/10">
                    <button type="button" onClick={() => setOpenAcc(openAcc === g.k ? null : g.k)} className="flex w-full items-center justify-between py-4 font-semibold uppercase tracking-[0.14em]" aria-expanded={openAcc === g.k}>
                      {g.label}
                      <ChevronDown className={`h-4 w-4 transition-transform ${openAcc === g.k ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {openAcc === g.k && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
                          <div className="grid grid-cols-2 gap-x-4 pb-4">
                            {g.items.map((it) => (
                              <Link key={it.l} href={it.h} onClick={() => setDrawer(false)} className="py-2 text-ink/75">{it.l}</Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                {[
                  { l: "New Arrivals", h: "/shop?col=new" },
                  { l: "Best Sellers", h: "/shop?col=best" },
                  { l: "Sale", h: "/shop?col=sale" },
                  { l: "Wishlist", h: "/wishlist-saved" },
                  { l: "About", h: "/about" },
                  { l: "Contact", h: "/contact" },
                ].map((it) => (
                  <Link key={it.l} href={it.h} onClick={() => setDrawer(false)} className="block border-b border-ink/10 py-4 font-semibold uppercase tracking-[0.14em]">
                    {it.l}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
