import React from "react";
import Link from "next/link";

export const PLACEHOLDER = "To be supplied by the brand.";

/** Shared layout for About / Shipping / Returns / Privacy / Terms. Placeholder text is marked. */
export default function InfoPage({
  eyebrow,
  title,
  intro,
  sections,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  sections?: { heading: string; body?: string; placeholder?: boolean }[];
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-24 sm:px-8">
      <nav aria-label="Breadcrumb" className="pt-6 text-[11px] uppercase tracking-[0.16em] text-ink/50">
        <Link href="/" className="hover:text-raspberry">Home</Link> <span className="mx-1.5">/</span> <span className="text-ink">{title}</span>
      </nav>
      <header className="border-b border-ink/10 pb-10 pt-8">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-raspberry">{eyebrow}</p>
        <h1 className="font-display text-5xl font-medium leading-none tracking-tight md:text-7xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg text-ink/70">{intro}</p>}
      </header>

      <div className="mt-6 divide-y divide-ink/10">
        {sections?.map((s) => (
          <section key={s.heading} className="grid gap-4 py-8 md:grid-cols-[1fr_2fr] md:gap-10">
            <h2 className="font-display text-3xl italic leading-tight">{s.heading}</h2>
            <p className={`text-[15px] leading-relaxed ${s.placeholder ? "border border-dashed border-ink/25 bg-white/60 px-5 py-4 text-ink/55" : "text-ink/75"}`}>
              {s.placeholder ? <><span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-raspberry">Placeholder</span>{s.body ?? PLACEHOLDER}</> : s.body}
            </p>
          </section>
        ))}
        {children}
      </div>
    </div>
  );
}
