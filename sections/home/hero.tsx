"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/container";

const SLIDES = [
  {
    image: "/Ava_0.png",
    title: "Сочные скидки!",
    subtitle: "До -60% на сантехнику и мебель для ванной",
    href: "/products",
  },
  {
    image: "/Ava_1.png",
    title: "Всё для ремонта",
    subtitle: "Плитка, сантехника, освещение в одном месте",
    href: "/products",
  },
  {
    image: "/ava_2.png",
    title: "5 000+ товаров",
    subtitle: "Большой ассортимент в наличии на складе",
    href: "/products",
  },
  {
    image: "/ava_3.png",
    title: "Бесплатная консультация",
    subtitle: "Подберём материалы и рассчитаем доставку",
    href: "/products",
  },
  {
    image: "/ava_4.png",
    title: "Доставка по СКФО",
    subtitle: "Быстрая доставка по Северному Кавказу",
    href: "/products",
  },
  {
    image: "/ava_5.png",
    title: "Гарантия качества",
    subtitle: "Только оригинальная продукция от брендов",
    href: "/products",
  },
];

const AUTOPLAY_MS = 5000;

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    setIsTransitioning(true);
    setCurrent((index + SLIDES.length) % SLIDES.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <section className="pb-5 pt-4">
      <Container>
        <div className="mx-auto w-[1077px] max-w-full px-5 xl:px-0">
          <div className="relative h-[240px] overflow-hidden rounded-[18px] shadow-[var(--shadow-soft)]">
            {SLIDES.map((item, index) => (
              <div
                key={item.image}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  index === current
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                <img
                  src={item.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
              </div>
            ))}

            <div
              className={`absolute inset-0 flex flex-col justify-center px-8 transition-all duration-500 sm:px-10 ${
                isTransitioning
                  ? "translate-y-1 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              <h1 className="max-w-[420px] text-[32px] font-bold leading-tight text-white sm:text-[38px]">
                {slide.title}
              </h1>
              <p className="mt-2 max-w-[380px] text-[15px] text-white/90 sm:text-[17px]">
                {slide.subtitle}
              </p>
              <div className="mt-5">
                <Link href={slide.href} className="btn-primary px-6 py-3">
                  К товарам
                </Link>
              </div>
            </div>

            <button
              type="button"
              onClick={prev}
              aria-label="Предыдущий слайд"
              className="absolute left-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md hover:scale-105 hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Следующий слайд"
              className="absolute right-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md hover:scale-105 hover:bg-white"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Слайд ${index + 1}`}
                  onClick={() => goTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === current
                      ? "w-8 bg-[var(--primary)]"
                      : "w-2 bg-white/60 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
