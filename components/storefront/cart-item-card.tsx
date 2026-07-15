"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import type { ResolvedCartItem } from "@/shared/types/cart";
import {
  formatPrice,
  getPriceUnit,
  getProductImageUrl,
} from "@/shared/lib/product-utils";
import { getDisplayPrice } from "@/shared/lib/product-pricing";

type Props = {
  item: ResolvedCartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export function CartItemCard({ item, onIncrease, onDecrease, onRemove }: Props) {
  const { product, unavailable, quantity } = item;

  if (unavailable || !product) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-700">
          Товар больше недоступен
        </p>
        <p className="mt-1 text-xs text-red-600">
          Возможно, он был удалён или скрыт из каталога
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="mt-3 text-sm font-medium text-red-700 underline"
        >
          Удалить из корзины
        </button>
      </div>
    );
  }

  const imageUrl = getProductImageUrl(product);
  const price = getDisplayPrice(product);
  const description =
    product.description?.replace(/<[^>]*>/g, "").slice(0, 120) ||
    [product.brand, product.size, product.material].filter(Boolean).join(" · ");

  return (
    <div className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[#f8fafc] p-3">
      <img
        src={imageUrl}
        alt={product.title}
        className="h-20 w-20 shrink-0 rounded-xl object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder.svg";
        }}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-semibold text-slate-900">
              {product.title}
            </p>
            {description && (
              <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Удалить"
            className="shrink-0 rounded-lg p-1.5 text-[var(--muted)] hover:bg-white hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-base font-bold text-[var(--primary)]">
            {formatPrice(price)}{" "}
            <span className="text-xs font-normal text-[var(--muted)]">
              {getPriceUnit(product.category)}
            </span>
          </p>

          <div className="flex items-center gap-1 rounded-xl border border-[var(--border)] bg-white p-0.5">
            <button
              type="button"
              onClick={onDecrease}
              aria-label="Уменьшить"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50"
            >
              <Minus size={14} />
            </button>
            <span className="min-w-[1.5rem] text-center text-sm font-semibold">
              {quantity}
            </span>
            <button
              type="button"
              onClick={onIncrease}
              aria-label="Увеличить"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
