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
  const slideCount = SLIDES.length;

  const next = useCallback(
    () => setCurrent((prev) => (prev + 1) % slideCount),
    [slideCount],
  );

  const prev = useCallback(
    () => setCurrent((prev) => (prev - 1 + slideCount) % slideCount),
    [slideCount],
  );

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="home-hero-section pb-5 pt-4">
      <Container>
        <div className="w-full">
          <div className="hero-slider">
            <div
              className="hero-slider__track"
              style={{
                transform: `translateX(-${current * 100}%)`,
              }}
            >
              {SLIDES.map((item, index) => (
                <div
                  key={`${item.image}-${index}`}
                  className="hero-slider__slide"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="hero-slider__image"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={prev}
              aria-label="Предыдущий слайд"
              className="hero-slider__button hero-slider__button--prev"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Следующий слайд"
              className="hero-slider__button hero-slider__button--next"
            >
              <ChevronRight size={20} />
            </button>

            <div className="hero-slider__indicators">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Слайд ${index + 1}`}
                  onClick={() => goTo(index)}
                  className={`hero-slider__indicator ${index === current ? "active" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
