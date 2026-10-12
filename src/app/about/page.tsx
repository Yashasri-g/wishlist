import Link from "next/link";
import InfoPage from "@/components/layout/InfoPage";

export const metadata = { title: "About · The Wishlist" };

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="The house"
      title="About The Wishlist"
      intro="Women's clothing in two labels: WISHLIST for Western wear and WISHLIST PREMIUM for ethnic wear."
      sections={[
        { heading: "Our story", placeholder: true },
        { heading: "WISHLIST", body: "The Western label: dresses, co-ords, blazers and suits, tops and corsets, and jackets." },
        { heading: "WISHLIST PREMIUM", body: "The ethnic label: sarees, lehengas, and kurtas and sets." },
        { heading: "Craft & materials", placeholder: true },
      ]}
    >
      <div className="flex flex-wrap gap-3 py-8">
        <Link href="/wishlist" className="bg-raspberry px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory hover:bg-ink">Shop WISHLIST</Link>
        <Link href="/wishlist-premium" className="bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold hover:bg-raspberry hover:text-ivory">Shop PREMIUM</Link>
      </div>
    </InfoPage>
  );
}
