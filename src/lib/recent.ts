"use client";

import { useEffect, useState } from "react";

const KEY = "wl_recent_v1";

/** Remember a viewed product id (most recent first, max 12). */
export function pushRecent(id: string) {
  try {
    const cur: string[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    const next = [id, ...cur.filter((x) => x !== id)].slice(0, 12);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
}

/** Recently viewed product ids (empty on the server and until mounted: no hydration mismatch). */
export function useRecent(): string[] {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        setIds(JSON.parse(localStorage.getItem(KEY) || "[]"));
      } catch {}
    }, 0);
    return () => window.clearTimeout(t);
  }, []);
  return ids;
}
