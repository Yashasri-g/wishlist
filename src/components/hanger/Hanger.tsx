import React from "react";

/** Hanger artwork. Raspberry for WISHLIST (Western), gold for PREMIUM (Ethnic). */
export default function Hanger({ premium = false, className = "" }: { premium?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 40"
      className={`relative z-10 block w-full h-auto drop-shadow-[0_5px_3px_rgba(20,17,15,0.22)] ${
        premium ? "text-gold" : "text-raspberry"
      } ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M60 17V12.5C60 6 69 5 69 10.5" />
      <path d="M60 17L9 35.5C5.5 36.8 6.5 38 9 38H111C113.5 38 114.5 36.8 111 35.5L60 17Z" />
      <path d="M58 19.5L14 35" stroke="white" strokeOpacity="0.55" strokeWidth="0.9" />
      <path d="M62 19.5L106 35" stroke="white" strokeOpacity="0.3" strokeWidth="0.9" />
    </svg>
  );
}
