"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";

const ADDRESS = "г. Махачкала, ул. Примакова, 2Д";
const MAP_LL = "47.504702,42.984716";
const ROUTE_URL = `https://yandex.ru/maps/?rtext=~${MAP_LL.replace(",", "%2C")}&rtt=auto`;

export function ShowroomMap() {
  return (
    <section className="pb-16 pt-4 md:pb-20">
      <Container>
        <div className="overflow-hidden rounded-[24px] shadow-[var(--shadow-soft)]">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[280px] bg-[#e8edf3] sm:min-h-[360px] lg:min-h-[420px]">
              <iframe
                title="Карта шоурума RION"
                src={`https://yandex.ru/map-widget/v1/?ll=${MAP_LL}&z=16&l=map&pt=${MAP_LL},pm2blm`}
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
                loading="lazy"
              />
            </div>

            <div className="flex flex-col justify-center bg-[#0c2d6b] px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-12">
              <h2 className="text-2xl font-bold sm:text-3xl">Наш шоурум</h2>

              <ul className="mt-8 space-y-5">
                <li className="flex items-start gap-4">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-white/80" />
                  <span className="text-base leading-relaxed">{ADDRESS}</span>
                </li>
                <li className="flex items-start gap-4">
                  <Clock size={20} className="mt-0.5 shrink-0 text-white/80" />
                  <span className="text-base">Ежедневно с 9:00 до 20:00</span>
                </li>
                <li className="flex items-start gap-4">
                  <Phone size={20} className="mt-0.5 shrink-0 text-white/80" />
                  <a
                    href="tel:+79285553355"
                    className="text-base hover:text-white/80"
                  >
                    +7 (928) 555-33-55
                  </a>
                </li>
                <li className="flex items-start gap-4">
                  <Mail size={20} className="mt-0.5 shrink-0 text-white/80" />
                  <a
                    href="mailto:info@rion-store.ru"
                    className="text-base hover:text-white/80"
                  >
                    info@rion-store.ru
                  </a>
                </li>
              </ul>

              <a
                href={ROUTE_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center rounded-[20px] bg-white px-6 py-3.5 text-base font-semibold text-[#0c2d6b] transition hover:bg-white/90 sm:w-auto"
              >
                Построить маршрут
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
