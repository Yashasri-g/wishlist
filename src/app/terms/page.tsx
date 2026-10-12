import InfoPage from "@/components/layout/InfoPage";

export const metadata = { title: "Terms · The Wishlist" };

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms of service"
      intro="Terms are being finalised by the brand."
      sections={[
        { heading: "Using this site", placeholder: true },
        { heading: "Orders & payment", placeholder: true },
        { heading: "Liability", placeholder: true },
      ]}
    />
  );
}
