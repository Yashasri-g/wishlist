import React from "react";
import Image from "next/image";

interface LogoProps {
  /** "default" sits on ivory; any other value is for dark backgrounds. */
  variant?: "default" | "premium" | "white";
  className?: string;
  size?: number;
}

/**
 * Uses the supplied brand logo (public/logo.png) unmodified.
 * The PNG has a white background, so on ivory it is blended with multiply,
 * and on dark surfaces it is placed on an ivory tile instead of being recoloured.
 * TODO: replace public/logo.png with a transparent SVG/high-res export.
 */
export default function Logo({ variant = "default", className = "", size = 72 }: LogoProps) {
  const onDark = variant !== "default";
  return (
    <span
      className={`inline-flex select-none ${onDark ? "bg-white p-1" : ""} ${className}`}
    >
      <Image
        src="/logo.png"
        alt="The Wishlist — Women's Clothing"
        width={size}
        height={size}
        priority
        className={onDark ? "" : "mix-blend-multiply"}
      />
    </span>
  );
}
