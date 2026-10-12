import InfoPage from "@/components/layout/InfoPage";

export const metadata = { title: "Shipping · The Wishlist" };

export default function ShippingPage() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Shipping"
      intro="Delivery terms are being finalised by the brand."
      sections={[
        { heading: "Delivery areas", placeholder: true },
        { heading: "Delivery times", placeholder: true },
        { heading: "Shipping charges", placeholder: true },
        { heading: "Order tracking", placeholder: true },
      ]}
    />
  );
}
