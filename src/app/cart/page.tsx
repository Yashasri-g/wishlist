"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { HangerRow, chunk, useColumns } from "@/components/hanger/HangerRow";
import Hanger from "@/components/hanger/Hanger";
import { BagLine, BagSummary } from "@/components/cart/CartParts";
import Row from "@/components/shop/Row";
import ProductTile from "@/components/shop/ProductTile";
import RecentRow from "@/components/shop/RecentRow";
import { CATALOG, byCollection } from "@/data/taxonomy";

export default function CartPage() {
  const { cart, cartCount, wishlist } = useShop();
  const cols = useColumns([{ min: 0, cols: 2 }, { min: 1024, cols: 3 }], 2);
  const rows = chunk(cart, cols);

  const inBag = new Set(cart.map((c) => c.product.id));
  const fromWishlist = useMemo(() => CATALOG.filter((p) => wishlist.includes(p.id) && !inBag.has(p.id)), [wishlist, cart]); // eslint-disable-line react-hooks/exhaustive-deps
  const suggestions = byCollection("trending").filter((p) => !inBag.has(p.id)).slice(0, 12);

  return (
    <div className="mx-auto max-w-[1800px] px-4 pb-24 sm:px-8">
      <header className="pb-8 pt-10">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-raspberry">Shopping bag</p>
        <h1 className="font-display text-5xl font-medium leading-none tracking-tight md:text-7xl">
          Your bag <span className="text-3xl italic text-ink/45 md:text-5xl">({cartCount})</span>
        </h1>
      </header>

      {cart.length === 0 ? (
        <div className="mx-auto flex max-w-xl flex-col items-center py-12 text-center">
          <HangerRow className="w-full max-w-[320px]">
            <div className="mx-auto w-[34%] origin-top animate-[swing_3.4s_ease-in-out_infinite]">
              <Hanger />
            </div>
          </HangerRow>
          <h2 className="mt-12 font-display text-5xl italic">Nothing hanging here yet.</h2>
          <p className="mt-3 text-ink/60">Add a few pieces and they&apos;ll hang on the rail.</p>
          <Link href="/shop?col=new" className="mt-8 bg-ink px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-raspberry">Shop new arrivals</Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">
          <div className="space-y-12">
            {rows.map((row, r) => (
              <HangerRow key={r}>
                {row.map((item, i) => (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`} style={{ width: `${100 / cols}%` }}>
                    <BagLine item={item} index={r * cols + i} />
                  </div>
                ))}
              </HangerRow>
            ))}
            <Link href="/shop" className="inline-block border-b border-ink pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] hover:border-raspberry hover:text-raspberry">← Continue shopping</Link>
          </div>
          <aside className="lg:sticky lg:top-[120px] lg:self-start">
            <div className="border border-ink/10 bg-white p-6">
              <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em]">Order summary</h2>
              <BagSummary />
            </div>
          </aside>
        </div>
      )}

      <div className="mt-20 space-y-16">
        {fromWishlist.length > 0 && (
          <Row title="From your wishlist" eyebrow="Saved for later" href="/wishlist-saved">
            {fromWishlist.map((p) => <ProductTile key={p.id} product={p} />)}
          </Row>
        )}
        <Row title="Trending now" eyebrow="You might also like" href="/shop?col=trending">
          {suggestions.map((p) => <ProductTile key={p.id} product={p} />)}
        </Row>
        <RecentRow />
      </div>
    </div>
  );
}
