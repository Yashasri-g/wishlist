import React, { Suspense } from "react";
import ShopClient from "./ShopClient";

export const metadata = { title: "Shop · The Wishlist" };

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ShopClient />
    </Suspense>
  );
}
