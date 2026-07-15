"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";

const ADDRESS = "ЧР Надтеречный район, с. Знаменское, ул. Торговая, 185";

// долгота, широта
const MAP_LL = "45.104958,43.674219";

const ROUTE_URL = `https://yandex.ru/maps/?rtext=~${MAP_LL.replace(",", "%2C")}&rtt=auto`;

export function ShowroomMap() {
  return (
    <section className="showroom-map-section">
      <Container>
        <div className="showroom-map-card overflow-hidden rounded-[24px] shadow-[var(--shadow-soft)]">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="p-4">
              <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] rounded-[12px] overflow-hidden bg-white border border-gray-200">
                <iframe
                  title="Карта шоурума RION"
                  src={`https://yandex.ru/map-widget/v1/?ll=${MAP_LL}&z=16&l=map&pt=${MAP_LL},pm2blm`}
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>

            <div className="flex flex-col rounded-[14px] bg-gradient-to-br from-[#185ab3] to-[#0c2d6b] shourum_pad text-white">
              <h2 className="text-[40px] font-bold leading-none">Наш шоурум</h2>

              <ul className="mt-8 space-y-5">
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <MapPin size={17} />
                  </span>
                  <span className="text-[18px] leading-7">{ADDRESS}</span>
                </li>

                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Clock size={17} />
                  </span>
                  <span className="text-[18px]">Ежедневно с 9:00 до 18:00</span>
                </li>

                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Phone size={17} />
                  </span>

                  <a
                    href="tel:+79637048177"
                    className="text-[18px] transition hover:text-white/90"
                  >
                    +7 (963) 704-81-77
                  </a>
                </li>

                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Mail size={17} />
                  </span>

                  <a
                    href="mailto:info@rion-store.ru"
                    className="text-[18px] transition hover:text-white/90"
                  >
                    info@rion-store.ru
                  </a>
                </li>
              </ul>

              <a
                href={ROUTE_URL}
                target="_blank"
                rel="noreferrer"
                className="showroom-route-btn mt-10 w-fit"
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
