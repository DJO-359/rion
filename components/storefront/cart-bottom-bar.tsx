"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/storefront/cart-context";
import { formatItemsCount } from "@/shared/lib/cart-utils";
import { formatPrice } from "@/shared/lib/product-utils";

export function CartBottomBar() {
  const { items, getItemsCount, getTotalPrice, openSheet, isLoading } =
    useCart();

  const count = getItemsCount();
  if (!items.length || count === 0) return null;

  const total = getTotalPrice();

  return (
    <button
      type="button"
      onClick={openSheet}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-white px-4 py-3 shadow-[0_-8px_32px_rgba(15,23,42,0.12)] transition-transform"
      aria-label="Открыть корзину"
    >
      <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
            <ShoppingCart size={20} />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900">Корзина</p>
            <p className="text-xs text-[var(--muted)]">
              {formatItemsCount(count)}
            </p>
          </div>
        </div>
        <p className="text-lg font-bold text-[var(--primary)]">
          {isLoading && total === 0 ? "..." : `${formatPrice(total)} ₽`}
        </p>
      </div>
    </button>
  );
}
