"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string; // unique item key (productId + variantId)
  productId: string;
  variantId?: string | null;
  title: string;
  variantTitle?: string | null;
  sku?: string | null;
  price: number;
  regularPrice?: number;
  quantity: number;
  image: string;
  slug: string;
}

export interface AppliedCoupon {
  code: string;
  type: string; // PERCENTAGE, FIXED, FREE_SHIPPING
  value: number;
  discountAmount: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">, openDrawer?: boolean) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  baseShippingFee: number;
  freeShippingThreshold: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  const baseShippingFee = 250;
  const freeShippingThreshold = 3500;

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("apex_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem("apex_coupon");
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("apex_cart", JSON.stringify(items));
      if (appliedCoupon) {
        localStorage.setItem("apex_coupon", JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem("apex_coupon");
      }
    } catch (e) {
      console.error("Failed to save cart to storage", e);
    }
  }, [items, appliedCoupon, isLoaded]);

  const addItem = (item: Omit<CartItem, "id">, openDrawer = true) => {
    const id = `${item.productId}_${item.variantId || "default"}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, id }];
    });

    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    try {
      localStorage.removeItem("apex_cart");
      localStorage.removeItem("apex_coupon");
    } catch (e) {}
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "PERCENTAGE") {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === "FIXED") {
      discount = Math.min(subtotal, appliedCoupon.value);
    }
  }

  // Shipping
  const isFreeShipping =
    subtotal >= freeShippingThreshold || appliedCoupon?.type === "FREE_SHIPPING";
  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : baseShippingFee;

  const total = Math.max(0, subtotal - discount + shippingFee);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Invalid coupon code" };
      }
      setAppliedCoupon({
        code: data.coupon.code,
        type: data.coupon.type,
        value: data.coupon.value,
        discountAmount: data.discount,
      });
      return { success: true, message: `Coupon ${data.coupon.code} applied successfully!` };
    } catch (err: any) {
      return { success: false, message: "Network error validating coupon" };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        discount,
        shippingFee,
        total,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        baseShippingFee,
        freeShippingThreshold,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
