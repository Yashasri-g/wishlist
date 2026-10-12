"use client";

import React from "react";
import { useRecent } from "@/lib/recent";
import { getProduct } from "@/data/taxonomy";
import type { Product } from "@/types";
import Row from "./Row";
import ProductTile from "./ProductTile";

/** "Continue browsing": appears only once the visitor has looked at something. */
export default function RecentRow({ exclude, className = "" }: { exclude?: string; className?: string }) {
  const ids = useRecent();
  const items = ids.filter((id) => id !== exclude).map(getProduct).filter((p): p is Product => !!p);
  if (items.length < 2) return null;
  return (
    <Row title="Continue browsing" eyebrow="Recently viewed" className={className}>
      {items.map((p) => (
        <ProductTile key={p.id} product={p} />
      ))}
    </Row>
  );
}
