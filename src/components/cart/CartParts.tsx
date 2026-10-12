"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import type { CartItem } from "@/types";
import { useShop } from "@/context/ShopContext";
import HangingItem, { useDetach } from "@/components/hanger/HangerRow";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** One bag line, hanging from the rail. */
export function BagLine({ item, index, compact = false }: { item: CartItem; index: number; compact?: boolean }) {
  return (
    <HangingItem index={index} premium={item.product.brand === "WISHLIST PREMIUM"} className="px-2 sm:px-3">
      <BagLineCard item={item} compact={compact} />
    </HangingItem>
  );
}

function BagLineCard({ item, compact }: { item: CartItem; compact: boolean }) {
  const { removeFromCart, updateQuantity } = useShop();
  const detach = useDetach();
  const { product, selectedSize, selectedColor, quantity } = item;
  const remove = () => detach(() => removeFromCart(product.id, selectedSize, selectedColor.name));

  return (
    <div className="relative">
      <div className="relative aspect-[3/4] overflow-hidden bg-sand ring-4 ring-white shadow-[0_22px_34px_-18px_rgba(20,17,15,0.45)]">
        <Link href={`/product/${product.id}`} aria-label={product.name} className="absolute inset-0">
          <Image src={product.images[0]} alt={`${product.name} (placeholder imagery)`} fill sizes={compact ? "200px" : "(max-width: 768px) 46vw, 22vw"} className="object-cover object-top" />
        </Link>
        <button type="button" onClick={remove} aria-label={`Remove ${product.name} from bag`} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 transition-colors hover:bg-ink hover:text-ivory">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="pt-3">
        <Link href={`/product/${product.id}`} className="line-clamp-1 text-[14px] font-medium hover:text-raspberry">{product.name}</Link>
        <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-ink/60">
          <span className="h-3 w-3 rounded-full ring-1 ring-ink/20" style={{ background: selectedColor.hex }} />
          {selectedColor.name} · {selectedSize}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center border border-ink/20" aria-label="Quantity">
            <button type="button" aria-label="Decrease quantity" onClick={() => (quantity > 1 ? updateQuantity(product.id, selectedSize, selectedColor.name, -1) : remove())} className="flex h-8 w-8 items-center justify-center hover:bg-ink/5"><Minus className="h-3.5 w-3.5" /></button>
            <span className="w-7 text-center text-[13px] font-semibold tabular-nums" aria-live="polite">{quantity}</span>
            <button type="button" aria-label="Increase quantity" onClick={() => updateQuantity(product.id, selectedSize, selectedColor.name, 1)} className="flex h-8 w-8 items-center justify-center hover:bg-ink/5"><Plus className="h-3.5 w-3.5" /></button>
          </div>
          <span className="text-sm font-semibold">{inr(product.price * quantity)}</span>
        </div>
      </div>
    </div>
  );
}

/** Totals + promo + checkout. Shared by the drawer and the bag page. */
export function BagSummary({ onNavigate, showViewBag = false }: { onNavigate?: () => void; showViewBag?: boolean }) {
  const { cartSubtotal, cartTotal, promoCode, promoDiscountPercent, applyPromoCode, cartCount } = useShop();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const discount = cartSubtotal - cartTotal;

  const apply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const r = applyPromoCode(code);
    setMsg({ ok: r.success, text: r.message });
    if (r.success) setCode("");
  };

  return (
    <div>
      <form onSubmit={apply} className="flex gap-2">
        <label htmlFor="promo" className="sr-only">Promo code</label>
        <input id="promo" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Demo promo code" className="min-w-0 flex-1 border border-ink/20 bg-white px-3 py-3 text-sm outline-none focus:border-ink" />
        <button type="submit" className="border border-ink px-5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-ivory">Apply</button>
      </form>
      <p role="status" className={`mt-2 min-h-4 text-xs ${msg?.ok ? "text-emerald-700" : "text-raspberry"}`}>{msg?.text}</p>

      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between"><dt className="text-ink/65">Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"})</dt><dd>{inr(cartSubtotal)}</dd></div>
        {promoDiscountPercent > 0 && (
          <div className="flex justify-between text-raspberry"><dt>Discount ({promoCode} · {promoDiscountPercent}%)</dt><dd>−{inr(discount)}</dd></div>
        )}
        <div className="flex justify-between text-ink/65"><dt>Shipping</dt><dd>Calculated at checkout</dd></div>
        <div className="flex justify-between border-t border-ink/15 pt-3 text-lg font-semibold"><dt>Total</dt><dd>{inr(cartTotal)}</dd></div>
      </dl>

      <Link href="/checkout" onClick={onNavigate} className="mt-5 flex h-[54px] items-center justify-center bg-ink text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors duration-500 hover:bg-raspberry">
        Checkout (demo)
      </Link>
      {showViewBag && (
        <Link href="/cart" onClick={onNavigate} className="mt-2 flex h-[48px] items-center justify-center border border-ink text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors hover:bg-ink hover:text-ivory">
          View bag
        </Link>
      )}
      <p className="mt-3 text-center text-[11px] text-ink/50">Checkout is a frontend demo: no payment is taken and no order is placed.</p>
    </div>
  );
}
