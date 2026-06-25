import Link from "next/link";

import { MapPin, Phone, Clock, Mail } from "lucide-react";

import { Container } from "./container";

import { CATEGORIES } from "@/shared/lib/catalog";



export function Footer() {

  return (

    <footer className="mx-auto mt-8 w-full bg-[#0c2d6b] text-white">

      <Container>

        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">

          <div>

            <div className="flex items-center gap-3">

              <img src="/upload.png" alt="RION" className="h-10 brightness-0 invert" />

            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/70">

              Строительный гипермаркет: плитка, сантехника, освещение, полы и

              всё для ремонта под ключ.

            </p>

            <p className="mt-4 text-xs text-white/50">

              © {new Date().getFullYear()} RION. Все права защищены.

            </p>

          </div>



          <div>

            <h4 className="mb-4 font-semibold">Каталог</h4>

            <ul className="space-y-2 text-sm text-white/70">

              {CATEGORIES.map((cat) => (

                <li key={cat.slug}>

                  <Link href={`/catalog/${cat.slug}`} className="hover:text-white">

                    {cat.title}

                  </Link>

                </li>

              ))}

            </ul>

          </div>



          <div>

            <h4 className="mb-4 font-semibold">Покупателям</h4>

            <ul className="space-y-2 text-sm text-white/70">

              <li>Доставка по СКФО</li>

              <li>Гарантия на товары</li>

              <li>Бесплатная консультация</li>

              <li>Оплата при получении</li>

            </ul>

          </div>



          <div>

            <h4 className="mb-4 font-semibold">Контакты</h4>

            <ul className="space-y-3 text-sm text-white/70">

              <li className="flex items-center gap-2">

                <Phone size={16} className="text-white/80" />

                <a href="tel:+79637048177">+7 (963) 704-81-77</a>

              </li>

              <li className="flex items-center gap-2">

                <Clock size={16} className="text-white/80" />

                Ежедневно 9:00 — 20:00

              </li>

              <li className="flex items-center gap-2">

                <MapPin size={16} className="text-white/80" />

                г. Махачкала, ул. Примакова, 2Д

              </li>

              <li className="flex items-center gap-2">

                <Mail size={16} className="text-white/80" />

                <a href="mailto:info@rion-store.ru">info@rion-store.ru</a>

              </li>

            </ul>

          </div>

        </div>

      </Container>

    </footer>

  );

}

