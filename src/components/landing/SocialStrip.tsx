import React from "react";
import Image from "next/image";
import { SITE, IMG } from "@/data/site";
import Marquee from "./Marquee";

export default function SocialStrip() {
  return (
    <section aria-label="Instagram" className="py-24 md:py-36">
      <Marquee
        items={["@the_wishlist_81", "@the_wishlist_premium"]}
        className="font-display italic text-6xl md:text-[9rem] leading-none text-ink/90 mb-14 md:mb-20"
        duration={46}
      />
      <div className="px-4 sm:px-8 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3">
          {IMG.social.map((src, i) => (
            <a
              key={i}
              href={i % 2 ? SITE.instagram.premium : SITE.instagram.wishlist}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open Instagram (${i % 2 ? "WISHLIST PREMIUM" : "WISHLIST"})`}
              className={`group relative block overflow-hidden bg-sand aspect-[3/4] ${i % 2 ? "md:mt-10" : ""}`}
            >
              <Image
                src={src}
                alt="Placeholder fashion imagery"
                fill
                sizes="(max-width: 768px) 50vw, 17vw"
                className="object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-raspberry/0 group-hover:bg-raspberry/25 transition-colors duration-500" />
            </a>
          ))}
        </div>
        <p className="mt-6 text-[11px] text-ink/50 tracking-wide">
          Placeholder imagery — to be replaced with the brand&apos;s real Instagram content.
        </p>
      </div>
    </section>
  );
}
