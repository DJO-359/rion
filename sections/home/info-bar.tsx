"use client";

import { Package, Truck, ShieldCheck, Headphones } from "lucide-react";
import { Container } from "@/components/layout/container";

const ITEMS = [
  {
    icon: Package,
    title: "5000+",
    text: "товаров в наличии",
  },
  {
    icon: Truck,
    text: "Ежедневные поставки",
  },
  {
    icon: ShieldCheck,
    text: "Гарантия качества",
    // subtext: "Только проверенные бренды",
  },
  {
    icon: Headphones,
    text: "Поддержка",
    subtext: "Поможем с выбором",
  },
];
export function InfoBar() {
  return (
    <section className="info-section">
      <Container>
        <div className="info-bar">
          {ITEMS.map((item) => (
            <div key={item.text} className="info-bar-item">
              <item.icon
                size={46}
                strokeWidth={1.7}
                className="info-bar-icon"
              />

              <div>
                <div className="info-bar-title">{item.text}</div>

                {item.subtext && (
                  <div className="info-bar-subtitle">{item.subtext}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
