"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import pb from "@/shared/lib/pocketbase";
import type { Product } from "@/shared/types/product";
import {
  formatPrice,
  getPriceUnit,
  getProductImageUrl,
} from "@/shared/lib/product-utils";
import { Container } from "@/components/layout/container";

type ProductWithDiscount = Product & { old_price?: string };

const PROMO_IMAGE_CANDIDATES = ["/sochnie.jpg", "/sochnie.png", "/sochnie.webp"];

function getDiscountPercent(product: ProductWithDiscount): number | null {
  const price = parseFloat(product.price);
  const oldPrice = product.old_price ? parseFloat(product.old_price) : null;
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function DiscountSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [promoSrc, setPromoSrc] = useState(PROMO_IMAGE_CANDIDATES[0]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pb.collection("products")
      .getFullList<Product>({ filter: "active = true", sort: "-created" })
      .then((data) => setProducts(data.slice(0, 12)))
      .catch(console.error);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-10 md:py-14">
      <Container>
        <div className="flex flex-col gap-5 lg:flex-row lg:gap-6">
          <Link
            href="/products"
            className="group relative flex min-h-[280px] shrink-0 overflow-hidden rounded-[24px] shadow-[var(--shadow-soft)] sm:min-h-[320px] lg:w-[240px] xl:w-[260px]"
          >
            <img
              src={promoSrc}
              alt="Сочные скидки"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => {
                const idx = PROMO_IMAGE_CANDIDATES.indexOf(promoSrc);
                const next = PROMO_IMAGE_CANDIDATES[idx + 1];
                if (next) setPromoSrc(next);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="relative flex h-full w-full flex-col justify-end p-5 sm:p-6">
              <h3 className="text-xl font-bold leading-tight text-white sm:text-2xl">
                Сочные
                <br />
                скидки!
              </h3>
              <p className="mt-1 text-sm font-medium text-white/90">До -60%</p>
              <span className="btn-primary mt-4 w-fit px-5 py-2.5 text-sm">
                К товарам
              </span>
            </div>
          </Link>

          <div className="relative min-w-0 flex-1">
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {products.map((product) => {
                const item = product as ProductWithDiscount;
                const imageUrl = getProductImageUrl(item);
                const discount = getDiscountPercent(item);
                const oldPrice = item.old_price ? parseFloat(item.old_price) : null;
                const price = parseFloat(item.price);

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group flex w-[180px] shrink-0 flex-col overflow-hidden rounded-[20px] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] sm:w-[200px] md:w-[220px]"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#f4f6f9]">
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {discount && (
                        <span className="absolute left-2 top-2 rounded-lg bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                          -{discount}%
                        </span>
                      )}
                      <button
                        type="button"
                        aria-label="В избранное"
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-sm"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Heart size={16} />
                      </button>
                    </div>
                    <div className="flex flex-1 flex-col p-3 sm:p-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-slate-900">
                          {formatPrice(product.price)}
                        </span>
                        {oldPrice && oldPrice > price && (
                          <span className="text-sm text-[var(--muted-foreground)] line-through">
                            {formatPrice(String(oldPrice))}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {getPriceUnit(product.category)}
                      </span>
                      <p className="mt-2 line-clamp-2 text-sm leading-snug text-slate-700">
                        {product.title}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {products.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  aria-label="Назад"
                  className="absolute -left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg hover:bg-[var(--primary-hover)] md:flex"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => scroll("right")}
                  aria-label="Вперёд"
                  className="absolute -right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg hover:bg-[var(--primary-hover)] md:flex"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
