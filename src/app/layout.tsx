import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchOverlay from "@/components/search/SearchOverlay";
import QuickViewModal from "@/components/ui/QuickViewModal";
import PageTransition from "@/components/layout/PageTransition";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Wishlist — Women's Clothing | WISHLIST & WISHLIST PREMIUM",
  description:
    "The Wishlist — women's Western and ethnic clothing. Trend-led WISHLIST and elevated WISHLIST PREMIUM. (Frontend demo storefront.)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-raspberry selection:text-white">
        <ShopProvider>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <CartDrawer />
          <SearchOverlay />
          <QuickViewModal />
          <PageTransition />
        </ShopProvider>
      </body>
    </html>
  );
}
