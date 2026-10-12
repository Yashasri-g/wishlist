"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useShop } from "@/context/ShopContext";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const EASE = [0.16, 1, 0.3, 1] as const;
const STEPS = ["Contact", "Delivery", "Review"] as const;
const STATES = ["Andhra Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal"];

type Form = { email: string; phone: string; firstName: string; lastName: string; address: string; city: string; state: string; pincode: string };
const EMPTY: Form = { email: "", phone: "", firstName: "", lastName: "", address: "", city: "", state: "Maharashtra", pincode: "" };

function validate(step: number, f: Form): Partial<Record<keyof Form, string>> {
  const e: Partial<Record<keyof Form, string>> = {};
  if (step === 0) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email address";
    if (!/^[6-9]\d{9}$/.test(f.phone.replace(/\s/g, ""))) e.phone = "Enter a 10-digit mobile number";
  }
  if (step === 1) {
    if (!f.firstName.trim()) e.firstName = "First name is required";
    if (!f.lastName.trim()) e.lastName = "Last name is required";
    if (f.address.trim().length < 6) e.address = "Enter your full address";
    if (!f.city.trim()) e.city = "City is required";
    if (!/^\d{6}$/.test(f.pincode)) e.pincode = "Enter a 6-digit pincode";
  }
  return e;
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em]">{label}</label>
      {children}
      {error && <p id={`${id}-err`} role="alert" className="mt-1.5 text-xs text-raspberry">{error}</p>}
    </div>
  );
}

const inputCls = (err?: string) => `h-[52px] w-full border bg-white px-4 text-[15px] outline-none transition-colors focus:border-ink ${err ? "border-raspberry" : "border-ink/20"}`;

export default function DemoCheckoutPage() {
  const { cart, cartSubtotal, cartTotal, promoCode, promoDiscountPercent, clearCart } = useShop();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [done, setDone] = useState(false);
  const head = useRef<HTMLDivElement>(null);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };
  const field = (k: keyof Form) => ({ id: k, name: k, value: form[k], onChange: set(k), "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined, className: inputCls(errors[k]) });

  const next = () => {
    const e = validate(step, form);
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(Object.keys(e)[0])?.focus();
      return;
    }
    setStep((s) => s + 1);
    head.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (cart.length === 0 && !done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-5xl italic">Your bag is empty.</h1>
        <p className="mt-3 text-ink/60">Add something to the bag to try the checkout demo.</p>
        <Link href="/shop" className="mt-8 inline-block bg-ink px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory hover:bg-raspberry">Start shopping</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, ease: EASE }} className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blush text-raspberry">
          <Check className="h-9 w-9" />
        </motion.div>
        <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.32em] text-raspberry">Demo complete</p>
        <h1 className="mt-3 font-display text-5xl font-medium leading-none md:text-6xl">That&apos;s the checkout flow.</h1>
        <p className="mx-auto mt-5 max-w-md text-ink/65">
          This is a frontend demonstration: <strong>no order was placed, no payment was taken</strong> and nothing you entered was sent or stored.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => { clearCart(); }} className="border border-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-ink hover:text-ivory">Empty the demo bag</button>
          <Link href="/shop" className="bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory hover:bg-raspberry">Keep browsing</Link>
        </div>
      </div>
    );
  }

  const discount = cartSubtotal - cartTotal;

  return (
    <div className="mx-auto max-w-[1500px] px-4 pb-24 sm:px-8">
      <div ref={head} className="scroll-mt-32 pb-8 pt-10">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-raspberry">Demo checkout</p>
        <h1 className="font-display text-5xl font-medium leading-none tracking-tight md:text-7xl">Checkout</h1>
        <p className="mt-3 max-w-xl bg-blush px-4 py-3 text-[13px] text-ink/80">Frontend demonstration only. No payment details are collected and no order is placed.</p>
      </div>

      {/* stepper */}
      <ol className="mb-10 flex items-center gap-3" aria-label="Checkout steps">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-3" aria-current={i === step ? "step" : undefined}>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${i < step ? "bg-raspberry text-white" : i === step ? "bg-ink text-ivory" : "border border-ink/25 text-ink/50"}`}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <span className={`hidden text-[11px] font-semibold uppercase tracking-[0.2em] sm:block ${i === step ? "" : "text-ink/45"}`}>{s}</span>
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-ink/15"><span className={`block h-full bg-raspberry transition-all duration-700 ${i < step ? "w-full" : "w-0"}`} /></span>}
          </li>
        ))}
      </ol>

      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (step < 2) next();
            else setDone(true);
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.4, ease: EASE }}>
              {step === 0 && (
                <fieldset className="space-y-5">
                  <legend className="mb-5 font-display text-3xl italic">Contact</legend>
                  <Field id="email" label="Email" error={errors.email}><input type="email" autoComplete="email" {...field("email")} /></Field>
                  <Field id="phone" label="Mobile number" error={errors.phone}><input type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="10-digit number" {...field("phone")} /></Field>
                </fieldset>
              )}
              {step === 1 && (
                <fieldset className="space-y-5">
                  <legend className="mb-5 font-display text-3xl italic">Delivery address</legend>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="firstName" label="First name" error={errors.firstName}><input autoComplete="given-name" {...field("firstName")} /></Field>
                    <Field id="lastName" label="Last name" error={errors.lastName}><input autoComplete="family-name" {...field("lastName")} /></Field>
                  </div>
                  <Field id="address" label="Address" error={errors.address}><input autoComplete="street-address" {...field("address")} /></Field>
                  <div className="grid gap-5 sm:grid-cols-3">
                    <Field id="city" label="City" error={errors.city}><input autoComplete="address-level2" {...field("city")} /></Field>
                    <Field id="state" label="State">
                      <select autoComplete="address-level1" {...field("state")}>{STATES.map((s) => <option key={s}>{s}</option>)}</select>
                    </Field>
                    <Field id="pincode" label="Pincode" error={errors.pincode}><input inputMode="numeric" maxLength={6} autoComplete="postal-code" {...field("pincode")} /></Field>
                  </div>
                </fieldset>
              )}
              {step === 2 && (
                <div className="space-y-8">
                  <h2 className="font-display text-3xl italic">Review</h2>
                  <dl className="grid gap-6 sm:grid-cols-2">
                    <div className="border border-ink/10 bg-white p-5">
                      <dt className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/50">Contact</dt>
                      <dd className="text-sm leading-relaxed">{form.email}<br />{form.phone}</dd>
                      <button type="button" onClick={() => setStep(0)} className="mt-3 text-xs font-semibold underline underline-offset-4 hover:text-raspberry">Edit</button>
                    </div>
                    <div className="border border-ink/10 bg-white p-5">
                      <dt className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/50">Delivering to</dt>
                      <dd className="text-sm leading-relaxed">{form.firstName} {form.lastName}<br />{form.address}<br />{form.city}, {form.state} {form.pincode}</dd>
                      <button type="button" onClick={() => setStep(1)} className="mt-3 text-xs font-semibold underline underline-offset-4 hover:text-raspberry">Edit</button>
                    </div>
                  </dl>
                  <p className="border border-dashed border-ink/25 p-5 text-sm text-ink/65">
                    <strong className="text-ink">Payment:</strong> not collected in this demo. A real payment step will be connected when the store goes live.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center gap-3">
            {step > 0 && <button type="button" onClick={() => setStep((s) => s - 1)} className="border border-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-ink hover:text-ivory">Back</button>}
            <button type="submit" className="flex-1 bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-raspberry sm:flex-none sm:min-w-[260px]">
              {step < 2 ? "Continue" : "Finish demo"}
            </button>
          </div>
        </form>

        <aside className="lg:sticky lg:top-[120px] lg:self-start">
          <div className="border border-ink/10 bg-white p-6">
            <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em]">Your bag</h2>
            <ul className="space-y-4">
              {cart.map((c) => (
                <li key={`${c.product.id}-${c.selectedSize}-${c.selectedColor.name}`} className="flex gap-4">
                  <span className="relative block h-24 w-[72px] shrink-0 overflow-hidden bg-sand">
                    <Image src={c.product.images[0]} alt="" fill sizes="72px" className="object-cover object-top" />
                  </span>
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="line-clamp-2 font-medium">{c.product.name}</span>
                    <span className="mt-1 block text-xs text-ink/55">{c.selectedColor.name} · {c.selectedSize} · Qty {c.quantity}</span>
                  </span>
                  <span className="text-sm font-semibold">{inr(c.product.price * c.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2 border-t border-ink/10 pt-5 text-sm">
              <div className="flex justify-between"><dt className="text-ink/65">Subtotal</dt><dd>{inr(cartSubtotal)}</dd></div>
              {promoDiscountPercent > 0 && <div className="flex justify-between text-raspberry"><dt>Discount ({promoCode})</dt><dd>−{inr(discount)}</dd></div>}
              <div className="flex justify-between text-ink/65"><dt>Shipping</dt><dd>To be confirmed</dd></div>
              <div className="flex justify-between border-t border-ink/15 pt-3 text-lg font-semibold"><dt>Total</dt><dd>{inr(cartTotal)}</dd></div>
            </dl>
            <Link href="/cart" className="mt-5 block text-center text-xs font-semibold underline underline-offset-4 hover:text-raspberry">Edit bag</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
