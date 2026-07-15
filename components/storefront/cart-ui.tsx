"use client";

import { useEffect } from "react";
import { CartBottomBar } from "@/components/storefront/cart-bottom-bar";
import { CartBottomSheet } from "@/components/storefront/cart-bottom-sheet";
import { CartCheckoutModal } from "@/components/storefront/cart-checkout-modal";
import { useCart } from "@/components/storefront/cart-context";

export function CartUI() {
  const { items } = useCart();

  useEffect(() => {
    if (!items.length) return;
    document.body.classList.add("cart-bar-visible");
    return () => {
      document.body.classList.remove("cart-bar-visible");
    };
  }, [items.length]);

  return (
    <>
      <CartBottomBar />
      <CartBottomSheet />
      <CartCheckoutModal />
    </>
  );
}
