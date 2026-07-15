"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/storefront/cart-context";
import { CartItemCard } from "@/components/storefront/cart-item-card";
import {
  formatItemsCount,
  getStoredItemsCount,
} from "@/shared/lib/cart-utils";
import { formatPrice } from "@/shared/lib/product-utils";

export function CartBottomSheet() {
  const {
    isSheetOpen,
    closeSheet,
    resolvedItems,
    isLoading,
    fetchError,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    removeUnavailableItems,
    getTotalPrice,
    openCheckout,
    items,
  } = useCart();

  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragCurrentY = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isSheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isSheetOpen, closeSheet]);

  useEffect(() => {
    if (!isSheetOpen) {
      setDragOffset(0);
      setIsDragging(false);
    }
  }, [isSheetOpen]);

  const unavailableCount = resolvedItems.filter((i) => i.unavailable).length;
  const availableItems = resolvedItems.filter((i) => !i.unavailable);
  const total = getTotalPrice();

  const handleCheckout = () => {
    if (unavailableCount > 0) {
      toast.error("Удалите недоступные товары перед оформлением");
      return;
    }
    if (!availableItems.length) {
      toast.error("Корзина пуста");
      return;
    }
    openCheckout();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    dragCurrentY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    dragCurrentY.current = e.touches[0].clientY;
    const delta = Math.max(0, dragCurrentY.current - dragStartY.current);
    setDragOffset(delta);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragOffset > 100) {
      closeSheet();
    }
    setDragOffset(0);
  };

  if (!isSheetOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-sheet-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        style={{ animation: "modalFadeIn 0.25s ease forwards" }}
        onClick={closeSheet}
      />

      <div
        ref={sheetRef}
        className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-[24px] bg-white shadow-2xl"
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease",
          animation: dragOffset === 0 ? "sheetSlideUp 0.35s ease forwards" : undefined,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex shrink-0 cursor-grab flex-col items-center px-6 pb-2 pt-3 active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="mb-3 h-1 w-10 rounded-full bg-slate-200" />
          <div className="flex w-full items-center justify-between">
            <h2 id="cart-sheet-title" className="text-xl font-bold text-slate-900">
              Корзина
            </h2>
            <button
              type="button"
              onClick={closeSheet}
              aria-label="Закрыть"
              className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {fetchError && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              {fetchError}
            </div>
          )}

          {isLoading && !resolvedItems.length && (
            <div className="space-y-3 py-4">
              {[1, 2].map((i) => (
                <div key={i} className="skeleton h-24 rounded-2xl" />
              ))}
            </div>
          )}

          {!isLoading && items.length > 0 && resolvedItems.length === 0 && (
            <p className="py-8 text-center text-sm text-[var(--muted)]">
              Не удалось загрузить товары
            </p>
          )}

          <div className="space-y-3">
            {resolvedItems.map((item) => (
              <CartItemCard
                key={item.productId}
                item={item}
                onIncrease={() => increaseQuantity(item.productId)}
                onDecrease={() => decreaseQuantity(item.productId)}
                onRemove={() => removeFromCart(item.productId)}
              />
            ))}
          </div>

          {unavailableCount > 0 && (
            <button
              type="button"
              onClick={removeUnavailableItems}
              className="mt-4 w-full text-center text-sm font-medium text-red-600 underline"
            >
              Удалить все недоступные ({unavailableCount})
            </button>
          )}
        </div>

        <div className="shrink-0 border-t border-[var(--border)] px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-[var(--muted)]">
              {formatItemsCount(getStoredItemsCount(items))}
            </span>
            <span className="text-lg font-bold text-slate-900">
              {isLoading && total === 0
                ? "..."
                : `${formatPrice(total)} ₽`}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={!availableItems.length || isLoading}
            className="btn-primary w-full"
          >
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );
}
