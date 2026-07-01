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

import "@/app/globals.css";

type ProductWithDiscount = Product & { old_price?: string };

const PROMO_IMAGE_CANDIDATES = ["/sochnie.webp"];

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

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const discountedProducts = products.filter((product) => {
    const item = product as ProductWithDiscount;
    const price = parseFloat(item.price);
    const oldPrice = item.old_price ? parseFloat(item.old_price) : null;
    return oldPrice !== null && oldPrice > price;
  });

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 2);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
    setTimeout(updateScrollButtons, 300);
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [discountedProducts]);

  return (
    <section className="py-10 md:py-14 ">
      <Container>
        <div className="flex flex-col gap-5 lg:flex-row lg:gap-6 rounded-[32px] bg-slate-950 p-4 shadow-[var(--shadow-soft)]">
          <Link
            href="/products"
            className="group relative flex h-[320px] w-[320px] shrink-0 overflow-hidden rounded-l-[24px] bg-[#0f1726] shadow-[var(--shadow-soft)]"
          >
            <img
              src={promoSrc}
              alt="Сочные скидки"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 "
              onError={() => {
                const idx = PROMO_IMAGE_CANDIDATES.indexOf(promoSrc);
                const next = PROMO_IMAGE_CANDIDATES[idx + 1];
                if (next) setPromoSrc(next);
              }}
            />
          </Link>

          <div className="relative min-w-0 flex-1 rounded-r-[24px] border border-white/10 bg-slate-900 discount-scroll-wrapper shadow-[var(--shadow-soft)] px-3 sm:px-4  overflow-hidden h-[320px]">
            <div
              ref={scrollRef}
              onScroll={updateScrollButtons}
              className="discount-scroll flex h-full gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {discountedProducts.map((product) => {
                const item = product as ProductWithDiscount;
                const imageUrl = getProductImageUrl(item);
                const discount = getDiscountPercent(item);
                const oldPrice = item.old_price
                  ? parseFloat(item.old_price)
                  : null;
                const price = parseFloat(item.price);

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group flex-none h-[284px] w-[164px] snap-start flex-col overflow-hidden rounded-[22px] border border-white/10 bg-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]  p-[10px]"
                  >
                    <div className="relative h-[174px] overflow-hidden bg-slate-100">
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-500 "
                        loading="lazy"
                      />
                      {discount && (
                        <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3.5 py-3 text-[11px] font-bold uppercase leading-none tracking-[0.2em] text-white shadow-sm">
                          -{discount}%
                        </span>
                      )}
                      <button
                        type="button"
                        aria-label="В избранное"
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-500 shadow-sm transition hover:bg-white"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Heart size={16} />
                      </button>
                    </div>

                    <div className="discount-card-content flex flex-1 flex-col gap-2">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-slate-900">
                            {formatPrice(product.price)}
                          </span>
                          {oldPrice && oldPrice > price && (
                            <span className="text-sm text-slate-400 line-through">
                              {formatPrice(String(oldPrice))}
                            </span>
                          )}
                        </div>
                        <span className="text-xs uppercase tracking-[0.12em] text-slate-500">
                          {getPriceUnit(product.category)}
                        </span>
                      </div>

                      <p className="mt-1 line-clamp-2 text-sm leading-snug text-slate-700">
                        {product.title}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {discountedProducts.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  aria-label="Назад"
                  className={`absolute left-0 top-1/2 z-10 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg transition-opacity duration-200 hover:bg-[var(--primary-hover)] ${
                    canScrollLeft
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => scroll("right")}
                  aria-label="Вперёд"
                  className={`absolute right-0 top-1/2 z-10 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#fff] text-black shadow-lg transition-opacity duration-200 hover:bg-[var(--primary-hover)] ${
                    canScrollRight
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
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
