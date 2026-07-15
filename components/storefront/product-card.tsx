"use client";

import Link from "next/link";
import pb from "@/shared/lib/pocketbase";
import type { Product } from "@/shared/types/product";
import {
  formatPrice,
  getDisplayPrice,
  getOldPriceForDisplay,
  getDiscountPercentForDisplay,
} from "@/shared/lib/product-pricing";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const discountPercent = getDiscountPercentForDisplay(product);
  const displayPrice = getDisplayPrice(product);
  const oldPrice = getOldPriceForDisplay(product);
  const hasDiscount = discountPercent > 0 && oldPrice !== null;

  return (
    <article
      className="group relative overflow-hidden rounded-2xl bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-4"
      style={{ animationDelay: `${(index % 5) * 60}ms` }}
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
          <img
            src={
              product.images?.[0]
                ? pb.files.getURL(product, product.images[0])
                : "/placeholder.svg"
            }
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 "
          />

          {hasDiscount && (
            <div className="absolute bottom-3 left-3 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-bold leading-none text-white shadow-sm">
              -{discountPercent}%
            </div>
          )}
        </div>
      </Link>

      <div className="mt-3 pad_card">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="line-clamp-2 min-h-[20px] text-sm font-medium leading-5  text-slate-800 transition-colors hover:text-violet-600">
            {product.title}
          </h3>

          {product.brand && (
            <p className="mt-1 text-xs text-slate-500">{product.brand}</p>
          )}
        </Link>

        <div className="mt-2 flex flex-wrap items-end gap-x-2 gap-y-1">
          <span
            className={`text-[22px] font-extrabold leading-none ${
              hasDiscount ? "text-red-600" : "text-slate-900"
            }`}
          >
            {formatPrice(displayPrice)} ₽
          </span>

          {oldPrice && (
            <>
              <span className="text-sm font-medium text-slate-400 line-through">
                {formatPrice(oldPrice)} ₽
              </span>
            </>
          )}
        </div>

        <Link
          href={`/products/${product.id}`}
          className="product-more-button  block w-4/5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-center text-sm font-medium text-slate-700 transition hover:border-violet-400 hover:bg-violet-50 hover:text-violet-600"
        >
          Подробнее
        </Link>
      </div>
    </article>
  );
}
