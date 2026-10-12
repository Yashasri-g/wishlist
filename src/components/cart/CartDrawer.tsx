"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { HangerRow, chunk } from "@/components/hanger/HangerRow";
import { BagLine, BagSummary } from "./CartParts";
import Hanger from "@/components/hanger/Hanger";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Bag drawer. Items hang from rails; removing one lifts it off the rail. */
export default function CartDrawer() {
  const { cart, cartCount, isCartOpen, setIsCartOpen } = useShop();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const close = () => setIsCartOpen(false);

  useEffect(() => {
    if (!isCartOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsCartOpen(false);
    window.addEventListener("keydown", onKey);
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isCartOpen, setIsCartOpen]);

  const rows = chunk(cart, 2);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div className="fixed inset-0 z-[75]" initial="h" animate="s" exit="h" role="dialog" aria-modal="true" aria-label="Shopping bag">
          <motion.div variants={{ h: { opacity: 0 }, s: { opacity: 1 } }} className="absolute inset-0 bg-ink/50" onClick={close} />
          <motion.aside variants={{ h: { x: "100%" }, s: { x: 0 } }} transition={{ duration: 0.55, ease: EASE }} className="absolute inset-y-0 right-0 flex w-full max-w-[500px] flex-col bg-ivory">
            <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="font-display text-3xl italic leading-none">
                Your bag <span className="text-base not-italic text-ink/50">({cartCount})</span>
              </h2>
              <button ref={closeBtn} type="button" onClick={close} aria-label="Close bag" className="flex h-10 w-10 items-center justify-center hover:text-raspberry">
                <X className="h-6 w-6" />
              </button>
            </header>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <HangerRow className="w-full max-w-[280px]">
                  <div className="mx-auto w-[38%] origin-top animate-[swing_3.4s_ease-in-out_infinite]">
                    <Hanger />
                  </div>
                </HangerRow>
                <h3 className="mt-10 font-display text-4xl italic">Nothing hanging here yet.</h3>
                <p className="mt-2 text-sm text-ink/60">Pick a few pieces and they&apos;ll hang on the rail.</p>
                <Link href="/shop?col=new" onClick={close} className="mt-7 bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-raspberry">Shop new arrivals</Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-6">
                  <div className="space-y-9">
                    {rows.map((row, r) => (
                      <HangerRow key={r}>
                        {row.map((item, i) => (
                          <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`} className="w-1/2">
                            <BagLine item={item} index={r * 2 + i} compact />
                          </div>
                        ))}
                      </HangerRow>
                    ))}
                  </div>
                </div>
                <footer className="border-t border-ink/10 bg-white/60 px-6 py-5">
                  <BagSummary onNavigate={close} showViewBag />
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
