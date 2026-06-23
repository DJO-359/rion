"use client";

import { Package, Truck, ShieldCheck, Headphones } from "lucide-react";
import { Container } from "@/components/layout/container";

const ITEMS = [
  { icon: Package, text: "5000+ товаров в наличии" },
  { icon: Truck, text: "Ежедневные поставки" },
  { icon: ShieldCheck, text: "Гарантия качества" },
  { icon: Headphones, text: "Поддержка" },
];

export function InfoBar() {
  return (
    <section className="border-y border-[var(--border)] bg-[#f8fafc] py-5">
      <Container>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {ITEMS.map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-3 text-sm text-slate-700 sm:text-base"
            >
              <item.icon
                size={22}
                className="shrink-0 text-[var(--primary)]"
                strokeWidth={1.75}
              />
              <span className="font-medium leading-snug">{item.text}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
