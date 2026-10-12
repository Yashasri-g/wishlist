import InfoPage from "@/components/layout/InfoPage";

export const metadata = { title: "Privacy · The Wishlist" };

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy policy"
      intro="This demo storefront stores your bag, wishlist and recently viewed items in your own browser only."
      sections={[
        { heading: "What this demo stores", body: "Your bag, wishlist and recently viewed products are saved in your browser's local storage on this device. Nothing is sent to a server." },
        { heading: "Full policy", placeholder: true },
      ]}
    />
  );
}
