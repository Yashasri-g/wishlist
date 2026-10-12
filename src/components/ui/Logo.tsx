import React from "react";
import Image from "next/image";

interface LogoProps {
  /** "default" sits on ivory; any other value is for dark backgrounds. */
  variant?: "default" | "premium" | "white";
  className?: string;
  size?: number;
  width?: number;
  height?: number;
}

/**
 * Brand logo for The Wishlist — Women's Clothing.
 * Renders high-res, tightly-cropped logo with proper aspect ratio and mix-blend on ivory.
 */
export default function Logo({
  variant = "default",
  className = "",
  size,
  width,
  height,
}: LogoProps) {
  const onDark = variant !== "default";

  // Natural logo aspect ratio: 450 / 336 ≈ 1.339
  const baseHeight = size ?? 68;
  const finalHeight = height ?? baseHeight;
  const finalWidth = width ?? Math.round(finalHeight * (450 / 336));

  return (
    <span
      className={`inline-flex items-center select-none transition-transform duration-300 hover:scale-[1.02] ${
        onDark ? "bg-white p-1.5 rounded-sm" : ""
      } ${className}`}
    >
      <Image
        src="/logo.png"
        alt="The Wishlist — Women's Clothing"
        width={finalWidth}
        height={finalHeight}
        priority
        className={`h-auto w-auto max-h-full object-contain ${
          onDark ? "" : "mix-blend-multiply"
        }`}
      />
    </span>
  );
}
