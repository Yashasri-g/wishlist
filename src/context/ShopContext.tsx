"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, ColorOption, BrandCategory } from "@/types";
import { PRODUCTS } from "@/data/products";

interface ShopContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    selectedSize: string,
    selectedColor: ColorOption,
    quantity?: number
  ) => void;
  removeFromCart: (productId: string, size: string, colorName: string) => void;
  updateQuantity: (
    productId: string,
    size: string,
    colorName: string,
    delta: number
  ) => void;
  clearCart: () => void;
  cartSubtotal: number;
  promoCode: string;
  promoDiscountPercent: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  wishlist: string[]; // Product IDs
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  brandMode: "ALL" | BrandCategory;
  setBrandMode: (mode: "ALL" | BrandCategory) => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const CART_STORAGE_KEY = "wishlist_fashion_cart_v1";
const WISHLIST_STORAGE_KEY = "wishlist_fashion_saved_v1";
const BRAND_STORAGE_KEY = "wishlist_fashion_brand_mode";

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [brandMode, setBrandModeState] = useState<"ALL" | BrandCategory>("ALL");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscountPercent, setPromoDiscountPercent] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // Nothing is written back to storage until the saved state has been read (otherwise React's
  // double-run of effects in development overwrites the saved bag with an empty one).
  const [hydrated, setHydrated] = useState(false);

  // Load initial state from LocalStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCart(JSON.parse(savedCart));
      }

      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }

      const savedBrand = localStorage.getItem(BRAND_STORAGE_KEY);
      if (savedBrand && ["ALL", "WISHLIST", "WISHLIST PREMIUM"].includes(savedBrand)) {
        setBrandModeState(savedBrand as "ALL" | BrandCategory);
      }
    } catch (error) {
      console.error("Failed to load shop state from localStorage:", error);
    }
    setHydrated(true);
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e);
    }
  }, [wishlist, hydrated]);

  const setBrandMode = (mode: "ALL" | BrandCategory) => {
    setBrandModeState(mode);
    try {
      localStorage.setItem(BRAND_STORAGE_KEY, mode);
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const addToCart = (
    product: Product,
    selectedSize: string,
    selectedColor: ColorOption,
    quantity = 1
  ) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor.name === selectedColor.name
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            product,
            selectedSize,
            selectedColor,
            quantity,
          },
        ];
      }
    });

    showToast(`Added "${product.name}" (${selectedSize} / ${selectedColor.name}) to Cart`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string, colorName: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor.name === colorName
          )
      )
    );
    showToast("Item removed from cart");
  };

  const updateQuantity = (
    productId: string,
    size: string,
    colorName: string,
    delta: number
  ) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor.name === colorName
          ) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "WISHLIST10") {
      setPromoCode("WISHLIST10");
      setPromoDiscountPercent(10);
      return { success: true, message: "10% VIP Discount Applied!" };
    } else if (cleanCode === "PREMIUM15") {
      setPromoCode("PREMIUM15");
      setPromoDiscountPercent(15);
      return { success: true, message: "15% Couture Discount Applied!" };
    } else {
      return { success: false, message: "Invalid promo code. Try 'WISHLIST10' or 'PREMIUM15'" };
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const targetProduct = PRODUCTS.find((p) => p.id === productId);

      if (exists) {
        showToast(
          `Removed "${targetProduct?.name || "Item"}" from Wishlist`
        );
        return prev.filter((id) => id !== productId);
      } else {
        showToast(
          `Saved "${targetProduct?.name || "Item"}" to Wishlist`
        );
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartDiscount = Math.round((cartSubtotal * promoDiscountPercent) / 100);
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        promoCode,
        promoDiscountPercent,
        applyPromoCode,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isWishlisted,
        brandMode,
        setBrandMode,
        isSearchOpen,
        setIsSearchOpen,
        quickViewProduct,
        setQuickViewProduct,
        toastMessage,
        showToast,
      }}
    >
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed left-1/2 top-[118px] z-[100] -translate-x-1/2 px-4">
        {toastMessage && (
          <div className="flex max-w-[92vw] items-center gap-3 border border-ink/10 bg-ivory px-5 py-3 text-ink shadow-[0_18px_40px_-16px_rgba(20,17,15,0.4)]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-raspberry" />
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em]">{toastMessage}</p>
          </div>
        )}
      </div>
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
