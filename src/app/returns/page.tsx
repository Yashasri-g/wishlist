import InfoPage from "@/components/layout/InfoPage";

export const metadata = { title: "Returns · The Wishlist" };

export default function ReturnsPage() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Returns & exchanges"
      intro="Return and exchange terms are being finalised by the brand."
      sections={[
        { heading: "Return window", placeholder: true },
        { heading: "Conditions", placeholder: true },
        { heading: "Exchanges", placeholder: true },
        { heading: "Refunds", placeholder: true },
      ]}
    />
  );
}
