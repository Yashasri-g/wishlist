"use client";

import React, { use, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, Heart, Minus, Plus, Ruler, ShoppingBag, X, ZoomIn } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { getProduct, CATALOG, filterProducts, shopHref } from "@/data/taxonomy";
import { pushRecent } from "@/lib/recent";
import { flyToTarget } from "@/lib/fly";
import { gsap } from "@/lib/gsap";
import Row from "@/components/shop/Row";
import ProductTile from "@/components/shop/ProductTile";
import RecentRow from "@/components/shop/RecentRow";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const EASE = [0.16, 1, 0.3, 1] as const;

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink/10">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between py-4 text-[11px] font-semibold uppercase tracking-[0.22em]">
        {title}
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
            <div className="pb-5 text-[14px] leading-relaxed text-ink/75">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = getProduct(id);
  if (!product) notFound();
  return <ProductView key={product.id} productId={product.id} />;
}

function ProductView({ productId }: { productId: string }) {
  const product = getProduct(productId)!;
  const { addToCart, toggleWishlist, isWishlisted, setIsCartOpen } = useShop();
  const [img, setImg] = useState(0);
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [guide, setGuide] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const saved = isWishlisted(product.id);
  const premium = product.brand === "WISHLIST PREMIUM";
  const maxQty = Math.max(1, Math.min(product.stockCount || 10, 10));

  useEffect(() => {
    pushRecent(product.id);
  }, [product.id]);

  // keyboard for lightbox
  useEffect(() => {
    if (!lightbox) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setImg((i) => (i + 1) % product.images.length);
      if (e.key === "ArrowLeft") setImg((i) => (i - 1 + product.images.length) % product.images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, product.images.length]);

  const related = useMemo(() => {
    const sameSub = filterProducts({ cat: product.category, sub: product.subcategory }).filter((p) => p.id !== product.id);
    const sameOcc = filterProducts({ occ: product.occasions?.[0] }).filter((p) => p.id !== product.id && p.subcategory !== product.subcategory);
    const other = CATALOG.filter((p) => p.category !== product.category && p.occasions?.some((o) => product.occasions?.includes(o)));
    return { sameSub, sameOcc, other };
  }, [product]);

  const onAdd = () => {
    if (!size) {
      setSizeError(true);
      sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (sizeRef.current) gsap.fromTo(sizeRef.current, { x: -8 }, { x: 0, duration: 0.7, ease: "elastic.out(1.2, 0.3)" });
      return;
    }
    addToCart(product, size, color, qty);
    flyToTarget(mainRef.current, product.images[0], "cart");
    window.setTimeout(() => setIsCartOpen(true), 1000);
  };

  const onHeart = () => {
    const adding = !saved;
    toggleWishlist(product.id);
    if (adding) flyToTarget(mainRef.current, product.images[0], "wishlist");
  };

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="mx-auto max-w-[1800px] px-4 pb-24 sm:px-8">
      <nav aria-label="Breadcrumb" className="pt-6 text-[11px] uppercase tracking-[0.16em] text-ink/50">
        <Link href="/" className="hover:text-raspberry">Home</Link> <span className="mx-1.5">/</span>
        <Link href={product.category === "Ethnic" ? "/wishlist-premium" : "/wishlist"} className="hover:text-raspberry">{premium ? "Premium" : "Wishlist"}</Link> <span className="mx-1.5">/</span>
        <Link href={shopHref({ cat: product.category, sub: product.subcategory })} className="hover:text-raspberry">{product.subcategory}</Link>
      </nav>

      <div className="grid gap-8 pt-6 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
        {/* ── gallery ── */}
        <div className="grid gap-3 md:grid-cols-[84px_1fr] md:gap-4">
          <div className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
            {product.images.map((src, i) => (
              <button key={src + i} type="button" onClick={() => setImg(i)} aria-label={`Show photo ${i + 1}`} aria-current={i === img} className={`relative aspect-[3/4] w-16 shrink-0 overflow-hidden bg-sand transition-all md:w-full ${i === img ? "ring-2 ring-ink" : "opacity-60 hover:opacity-100"}`}>
                <Image src={src} alt="" fill sizes="84px" className="object-cover object-top" />
              </button>
            ))}
          </div>

          <div className="order-1 md:order-2">
            <div
              ref={mainRef}
              onPointerMove={onMove}
              onPointerLeave={() => setZoom(null)}
              onClick={() => setLightbox(true)}
              className="group relative aspect-[3/4] cursor-zoom-in overflow-hidden bg-sand"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={img} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: EASE }} className="absolute inset-0">
                  <Image src={product.images[img]} alt={`${product.name} (placeholder imagery)`} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover object-top" />
                </motion.div>
              </AnimatePresence>
              {zoom && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 hidden md:block"
                  style={{ backgroundImage: `url(${product.images[img]})`, backgroundSize: "220%", backgroundPosition: `${zoom.x}% ${zoom.y}%`, backgroundRepeat: "no-repeat" }}
                />
              )}
              <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn className="h-3.5 w-3.5" /> Zoom
              </span>
              {product.images.length > 1 && (
                <>
                  <button type="button" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); setImg((i) => (i - 1 + product.images.length) % product.images.length); }} className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100 md:flex">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button type="button" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); setImg((i) => (i + 1) % product.images.length); }} className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100 md:flex">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── info ── */}
        <div className="lg:sticky lg:top-[120px] lg:self-start">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.26em] ${premium ? "text-gold" : "text-raspberry"}`}>
            {premium ? "WISHLIST PREMIUM" : "WISHLIST"} <span className="text-ink/30">·</span> <span className="text-ink/50">{product.subcategory}</span>
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium leading-[1.02] tracking-tight md:text-5xl">{product.name}</h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-3">
            <span className="text-2xl font-semibold">{inr(product.price)}</span>
            {product.originalPrice && <span className="text-base text-ink/45 line-through">{inr(product.originalPrice)}</span>}
            {product.discountPercent ? <span className="text-sm font-semibold text-raspberry">{product.discountPercent}% off</span> : null}
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-ink/75">{product.description}</p>

          {/* colour */}
          <div className="mt-7">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em]">
              Colour: <span className="font-normal normal-case tracking-normal text-ink/70">{color.name}</span>
            </p>
            <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Colour">
              {product.colors.map((c) => (
                <button key={c.name} type="button" role="radio" aria-checked={c.name === color.name} aria-label={c.name} onClick={() => setColor(c)} className={`h-9 w-9 rounded-full ring-offset-2 ring-offset-ivory transition-all ${c.name === color.name ? "ring-2 ring-ink" : "ring-1 ring-ink/20 hover:ring-ink/60"}`} style={{ background: c.hex }} />
              ))}
            </div>
          </div>

          {/* size */}
          <div ref={sizeRef} className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                Size {sizeError && <span className="ml-2 font-normal normal-case tracking-normal text-raspberry">Please select a size</span>}
              </p>
              <button type="button" onClick={() => setGuide(true)} className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] underline-offset-4 hover:text-raspberry hover:underline">
                <Ruler className="h-3.5 w-3.5" /> Size guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
              {product.sizes.map((s) => (
                <button key={s} type="button" role="radio" aria-checked={size === s} onClick={() => { setSize(s); setSizeError(false); }} className={`min-w-14 border px-4 py-3 text-sm font-medium transition-colors ${size === s ? "border-ink bg-ink text-ivory" : sizeError ? "border-raspberry text-ink hover:bg-ink hover:text-ivory" : "border-ink/25 hover:border-ink"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* qty + actions */}
          <div className="mt-7 flex items-center gap-3">
            <div className="flex items-center border border-ink/25" aria-label="Quantity">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-[52px] w-11 items-center justify-center hover:bg-ink/5"><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} className="flex h-[52px] w-11 items-center justify-center hover:bg-ink/5"><Plus className="h-4 w-4" /></button>
            </div>
            <button
              type="button"
              onClick={onAdd}
              disabled={!product.inStock}
              className="group flex h-[52px] flex-1 items-center justify-center gap-2 bg-ink text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors duration-500 hover:bg-raspberry disabled:cursor-not-allowed disabled:bg-ink/30"
            >
              <ShoppingBag className="h-4 w-4" />
              {product.inStock ? `Add to bag · ${inr(product.price * qty)}` : "Sold out"}
            </button>
            <button type="button" onClick={onHeart} aria-pressed={saved} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} className={`flex h-[52px] w-[52px] items-center justify-center border transition-colors ${saved ? "border-raspberry bg-raspberry text-white" : "border-ink/25 hover:border-ink"}`}>
              <Heart className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="mt-8 border-t border-ink/10">
            <Accordion title="Details" defaultOpen>
              <ul className="list-disc space-y-1.5 pl-5">
                {product.details.map((d) => <li key={d}>{d}</li>)}
              </ul>
            </Accordion>
            <Accordion title="Fabric & care">
              <ul className="list-disc space-y-1.5 pl-5">
                {product.fabricCare.map((d) => <li key={d}>{d}</li>)}
              </ul>
            </Accordion>
            {product.stylingNotes && <Accordion title="Styling note">{product.stylingNotes}</Accordion>}
            <Accordion title="Shipping & returns">
              Delivery and return terms are being finalised. See the <Link href="/shipping" className="underline underline-offset-4 hover:text-raspberry">shipping page</Link> for what is confirmed.
            </Accordion>
          </div>
        </div>
      </div>

      <div className="mt-20 space-y-16 md:space-y-24">
        {related.sameSub.length > 0 && (
          <Row title="You may also like" eyebrow={`More ${product.subcategory.toLowerCase()}`} href={shopHref({ cat: product.category, sub: product.subcategory })}>
            {related.sameSub.map((p) => <ProductTile key={p.id} product={p} />)}
          </Row>
        )}
        {related.other.length > 0 && (
          <Row title="Complete the look" eyebrow={product.category === "Ethnic" ? "From WISHLIST · Western" : "From WISHLIST PREMIUM · Ethnic"}>
            {related.other.slice(0, 10).map((p) => <ProductTile key={p.id} product={p} />)}
          </Row>
        )}
        {related.sameOcc.length > 0 && (
          <Row title={`More for ${product.occasions?.[0] ?? "you"}`} eyebrow="Same occasion" href={shopHref({ occ: product.occasions?.[0] })}>
            {related.sameOcc.slice(0, 12).map((p) => <ProductTile key={p.id} product={p} />)}
          </Row>
        )}
        <RecentRow exclude={product.id} />
      </div>

      {/* sticky bar (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-ink/10 bg-ivory/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium">{product.name}</p>
          <p className="text-sm font-semibold">{inr(product.price)}</p>
        </div>
        <button type="button" onClick={onAdd} disabled={!product.inStock} className="h-12 bg-ink px-7 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory disabled:bg-ink/30">
          {product.inStock ? "Add to bag" : "Sold out"}
        </button>
      </div>

      {/* size guide drawer */}
      <AnimatePresence>
        {guide && (
          <motion.div className="fixed inset-0 z-[80]" initial="h" animate="s" exit="h" role="dialog" aria-modal="true" aria-label="Size guide">
            <motion.div variants={{ h: { opacity: 0 }, s: { opacity: 1 } }} className="absolute inset-0 bg-ink/50" onClick={() => setGuide(false)} />
            <motion.div variants={{ h: { x: "100%" }, s: { x: 0 } }} transition={{ duration: 0.5, ease: EASE }} className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-ivory">
              <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.22em]">Size guide</h2>
                <button type="button" onClick={() => setGuide(false)} aria-label="Close size guide" className="flex h-9 w-9 items-center justify-center"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6 text-sm">
                <p className="mb-4 bg-blush px-4 py-3 text-[13px] text-ink/80">Sample chart only. The brand&apos;s real measurements will replace this table.</p>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-ink/20 text-[11px] uppercase tracking-[0.16em] text-ink/55"><th className="py-2 font-semibold">Size</th><th className="font-semibold">Bust (in)</th><th className="font-semibold">Waist (in)</th><th className="font-semibold">Hip (in)</th></tr>
                  </thead>
                  <tbody>
                    {[["XS", "32", "26", "35"], ["S", "34", "28", "37"], ["M", "36", "30", "39"], ["L", "38", "32", "41"], ["XL", "40", "34", "43"], ["XXL", "42", "36", "45"]].map((r) => (
                      <tr key={r[0]} className="border-b border-ink/10">{r.map((c, i) => <td key={i} className={`py-3 ${i === 0 ? "font-semibold" : ""}`}>{c}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setLightbox(false)}>
            <button type="button" aria-label="Close" onClick={() => setLightbox(false)} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-ivory"><X className="h-7 w-7" /></button>
            <div className="relative h-[88vh] w-[min(92vw,66vh)]" onClick={(e) => e.stopPropagation()}>
              <Image src={product.images[img]} alt={product.name} fill sizes="90vw" className="object-contain" />
            </div>
            {product.images.length > 1 && (
              <>
                <button type="button" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); setImg((i) => (i - 1 + product.images.length) % product.images.length); }} className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90"><ChevronLeft className="h-6 w-6" /></button>
                <button type="button" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); setImg((i) => (i + 1) % product.images.length); }} className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90"><ChevronRight className="h-6 w-6" /></button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
