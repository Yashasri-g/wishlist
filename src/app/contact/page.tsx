"use client";

import React, { useState } from "react";
import InfoPage from "@/components/layout/InfoPage";
import { SITE } from "@/data/site";

export default function ContactPage() {
  const [v, setV] = useState({ name: "", email: "", message: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const x: Record<string, string> = {};
    if (!v.name.trim()) x.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) x.email = "Please enter a valid email";
    if (v.message.trim().length < 5) x.message = "Please write a short message";
    setErr(x);
    if (Object.keys(x).length === 0) setSent(true);
  };
  const cls = (k: string) => `w-full border bg-white px-4 py-3.5 text-[15px] outline-none focus:border-ink ${err[k] ? "border-raspberry" : "border-ink/20"}`;

  return (
    <InfoPage
      eyebrow="Help"
      title="Contact"
      intro="Reach the team on Instagram. Email, phone and store details will be added once the brand confirms them."
      sections={[
        { heading: "Email", placeholder: true },
        { heading: "Phone", placeholder: true },
        { heading: "Instagram", body: "Follow along and message us on either account." },
      ]}
    >
      <div className="flex flex-wrap gap-3 pb-8">
        <a href={SITE.instagram.wishlist} target="_blank" rel="noopener noreferrer" className="bg-raspberry px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory hover:bg-ink">@the_wishlist_81 ↗</a>
        <a href={SITE.instagram.premium} target="_blank" rel="noopener noreferrer" className="bg-ink px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold hover:bg-raspberry hover:text-ivory">@the_wishlist_premium ↗</a>
      </div>
      <section className="grid gap-4 py-8 md:grid-cols-[1fr_2fr] md:gap-10">
        <h2 className="font-display text-3xl italic leading-tight">Send a message</h2>
        {sent ? (
          <p role="status" className="bg-blush px-5 py-4 text-[15px]">Thanks. This is a demo form, so nothing was sent.</p>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            {(["name", "email"] as const).map((k) => (
              <div key={k}>
                <label htmlFor={k} className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em]">{k === "name" ? "Name" : "Email"}</label>
                <input id={k} type={k === "email" ? "email" : "text"} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} aria-invalid={!!err[k]} aria-describedby={err[k] ? `${k}-e` : undefined} className={cls(k)} />
                {err[k] && <p id={`${k}-e`} role="alert" className="mt-1 text-xs text-raspberry">{err[k]}</p>}
              </div>
            ))}
            <div>
              <label htmlFor="message" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em]">Message</label>
              <textarea id="message" rows={5} value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} aria-invalid={!!err.message} aria-describedby={err.message ? "message-e" : undefined} className={cls("message")} />
              {err.message && <p id="message-e" role="alert" className="mt-1 text-xs text-raspberry">{err.message}</p>}
            </div>
            <button type="submit" className="bg-ink px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory hover:bg-raspberry">Send (demo)</button>
          </form>
        )}
      </section>
    </InfoPage>
  );
}
