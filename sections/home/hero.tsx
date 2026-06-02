import {
  Phone,
  User,
  ShoppingBag,
  Truck,
  MapPin,
  Shield,
  Headset,
} from "lucide-react";

import { Container } from "@/components/layout/container";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <img
          src="/FON.png"
          alt="RION showroom"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#212c3b]/25 via-[#212c3b]/10 to-transparent" />
        <div className="absolute inset-0 bg-[#081120]/0.5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,169,106,0.16),transparent_50%)]" />
      </div>

      <Container>
        <div className="flex flex-wrap justify-around items-start gap-55 pt-[140px] mb-9 h-[310px]">
          {/* LEFT */}
          <div className="w-full max-w-[580px] rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-10">
            <h1 className="text-[46px] font-bold leading-[1.05] tracking-[-1.5px] text-white">
              Всё для ремонта <br /> и интерьера
            </h1>

            <p className="mt-8 text-[18px] leading-[1.7] text-white/70">
              Плитка, сантехника, ламинат, освещение и ковры — в наличии и под
              заказ{" "}
              <span className="bg-[#C89B5E] text-black px-2 py-1">
                с доставкой по Северному Кавказу
              </span>
            </p>

            {/* STATS — FIXED SPACING */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div className="space-y-1">
                <div className="text-[34px] font-bold text-white">5000+</div>
                <div className="text-sm text-white/60">товаров в наличии</div>
              </div>

              <div className="space-y-1">
                <div className="text-[34px] font-bold text-white">10 мин</div>
                <div className="text-sm text-white/60">ответ менеджера</div>
              </div>

              <div className="space-y-1">
                <div className="text-[34px] font-bold text-white">100+</div>
                <div className="text-sm text-white/60">брендов</div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden xl:block w-full max-w-[420px] rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-10">
            <h3 className="text-[22px] leading-[1.4] text-white text-center">
              Не можете приехать? <br />
              Подберём товары онлайн <br />и организуем доставку
            </h3>

            {/* FORM — FIXED GAP SYSTEM */}
            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
                <User size={18} className="text-[#C89B5E]" />
                <input
                  placeholder="Ваше имя"
                  className="w-full bg-transparent text-white outline-none placeholder:text-white/40"
                />
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
                <Phone size={18} className="text-[#C89B5E]" />
                <input
                  placeholder="Телефон"
                  className="w-full bg-transparent text-white outline-none placeholder:text-white/40"
                />
              </div>

              <label className="flex gap-3 text-sm text-white/60 leading-relaxed">
                <input type="checkbox" className="mt-1" />
                Согласие на обработку персональных данных
              </label>

              <button className="premium-btn w-full">
                <span className="premium-btn-text">Получить консультацию</span>
                <span className="premium-btn-shimmer" />
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-white/40">
              Ответим в течение 10 минут
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
