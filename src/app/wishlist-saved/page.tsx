"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { HangerRow, chunk, useColumns } from "@/components/hanger/HangerRow";
import HangingItem, { useDetach } from "@/components/hanger/HangerRow";
import Hanger from "@/components/hanger/Hanger";
import Row from "@/components/shop/Row";
import ProductTile from "@/components/shop/ProductTile";
import RecentRow from "@/components/shop/RecentRow";
import { CATALOG, byCollection } from "@/data/taxonomy";
import { flyToTarget } from "@/lib/fly";
import { gsap } from "@/lib/gsap";
import type { Product } from "@/types";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function SavedCard({ product }: { product: Product }) {
  const { toggleWishlist, addToCart } = useShop();
  const detach = useDetach();
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [error, setError] = useState(false);
  const photo = useRef<HTMLDivElement>(null);
  const sizes = useRef<HTMLDivElement>(null);

  const remove = () => detach(() => toggleWishlist(product.id));
  const move = () => {
    if (!size) {
      setError(true);
      if (sizes.current) gsap.fromTo(sizes.current, { x: -8 }, { x: 0, duration: 0.7, ease: "elastic.out(1.2, 0.3)" });
      return;
    }
    addToCart(product, size, product.colors[0], 1);
    flyToTarget(photo.current, product.images[0], "cart");
    detach(() => toggleWishlist(product.id));
  };

  return (
    <div>
      <div ref={photo} className="relative aspect-[3/4] overflow-hidden bg-sand ring-4 ring-white shadow-[0_22px_34px_-18px_rgba(20,17,15,0.45)]">
        <Link href={`/product/${product.id}`} aria-label={product.name} className="absolute inset-0">
          <Image src={product.images[0]} alt={`${product.name} (placeholder imagery)`} fill sizes="(max-width: 768px) 46vw, 22vw" className="object-cover object-top" />
        </Link>
        <button type="button" onClick={remove} aria-label={`Remove ${product.name} from wishlist`} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 transition-colors hover:bg-ink hover:text-ivory">
          <X className="h-4 w-4" />
        </button>
        {!product.inStock && <span className="absolute left-2 top-2 bg-ink px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-ivory">Sold out</span>}
      </div>
      <div className="pt-3">
        <Link href={`/product/${product.id}`} className="line-clamp-1 text-[14px] font-medium hover:text-raspberry">{product.name}</Link>
        <p className="mt-0.5 text-sm font-semibold">
          {inr(product.price)} {product.originalPrice && <span className="ml-1 text-xs font-normal text-ink/45 line-through">{inr(product.originalPrice)}</span>}
        </p>
        {product.sizes.length > 1 && (
          <div ref={sizes} className="mt-2 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Size">
            {product.sizes.map((s) => (
              <button key={s} type="button" role="radio" aria-checked={size === s} onClick={() => { setSize(s); setError(false); }} className={`min-w-9 border px-2 py-1.5 text-[11px] font-medium transition-colors ${size === s ? "border-ink bg-ink text-ivory" : error ? "border-raspberry" : "border-ink/25 hover:border-ink"}`}>{s}</button>
            ))}
          </div>
        )}
        {error && <p role="alert" className="mt-1 text-[11px] text-raspberry">Choose a size first</p>}
        <button type="button" onClick={move} disabled={!product.inStock} className="mt-3 flex h-11 w-full items-center justify-center gap-2 bg-ink text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-raspberry disabled:bg-ink/30">
          <ShoppingBag className="h-4 w-4" /> Move to bag
        </button>
      </div>
    </div>
  );
}

export default function SavedWishlistPage() {
  const { wishlist } = useShop();
  const saved = useMemo(() => wishlist.map((id) => CATALOG.find((p) => p.id === id)).filter((p): p is Product => !!p), [wishlist]);
  const cols = useColumns([{ min: 0, cols: 2 }, { min: 768, cols: 3 }, { min: 1280, cols: 4 }], 2);
  const rows = chunk(saved, cols);
  const more = byCollection("trending").filter((p) => !wishlist.includes(p.id)).slice(0, 12);

  return (
    <div className="mx-auto max-w-[1800px] px-4 pb-24 sm:px-8">
      <header className="pb-8 pt-10">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-raspberry">Saved for later</p>
        <h1 className="font-display text-5xl font-medium leading-none tracking-tight md:text-7xl">
          Your wishlist <span className="text-3xl italic text-ink/45 md:text-5xl">({saved.length})</span>
        </h1>
      </header>

      {saved.length === 0 ? (
        <div className="mx-auto flex max-w-xl flex-col items-center py-12 text-center">
          <HangerRow className="w-full max-w-[320px]">
            <div className="mx-auto w-[34%] origin-top animate-[swing_3.4s_ease-in-out_infinite]">
              <Hanger />
            </div>
          </HangerRow>
          <h2 className="mt-12 font-display text-5xl italic">Your rail is empty.</h2>
          <p className="mt-3 text-ink/60">Tap the heart on anything you love and it will hang here.</p>
          <Link href="/shop" className="mt-8 bg-ink px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-raspberry">Start browsing</Link>
        </div>
      ) : (
        <div className="space-y-12">
          {rows.map((row, r) => (
            <HangerRow key={r}>
              {row.map((p, i) => (
                <div key={p.id} style={{ width: `${100 / cols}%` }}>
                  <HangingItem index={r * cols + i} premium={p.brand === "WISHLIST PREMIUM"} className="px-2 sm:px-3">
                    <SavedCard product={p} />
                  </HangingItem>
                </div>
              ))}
            </HangerRow>
          ))}
        </div>
      )}

      <div className="mt-20 space-y-16">
        <Row title="Trending now" eyebrow="You might also love" href="/shop?col=trending">
          {more.map((p) => <ProductTile key={p.id} product={p} />)}
        </Row>
        <RecentRow />
      </div>
    </div>
  );
}
