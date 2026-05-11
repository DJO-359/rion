"use client";

import { useState } from "react";
import { Phone, Clock, MapPin } from "lucide-react";
import RequestModal from "@/components/modals/RequestModal";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="hero-bg relative min-h-[90vh] flex items-center text-white">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Левая часть - текст */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm">
            Более 5000 товаров в наличии
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            Плитка, сантехника,
            <br />
            люстры и ковры
            <br />
            <span className="text-[#d4af37]">для вашего дома</span>
          </h1>

          <p className="text-xl text-gray-200 max-w-lg">
            Более 5000 товаров в наличии. Подберём и доставим по региону.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#d4af37] hover:bg-[#c19a2f] text-black px-8 py-4 rounded-xl font-semibold text-lg transition-all active:scale-95"
            >
              Узнать наличие
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="border border-white/70 hover:bg-white/10 px-8 py-4 rounded-xl font-medium text-lg transition-all"
            >
              Перейти в каталог
            </button>
          </div>

          {/* Дополнительная информация */}
          <div className="flex items-center gap-8 text-sm pt-6 border-t border-white/20">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#d4af37]" />
              <div>г. Махачкала</div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#d4af37]" />
              <div>Ежедневно 9:00 — 20:00</div>
            </div>
          </div>
        </div>

        {/* Правая часть - форма */}
        <div className="hidden md:block">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-semibold mb-6">Не можете приехать?</h3>
            <p className="text-gray-400 mb-8">
              Подберём товары онлайн, проконсультируем и организуем доставку.
            </p>

            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
            >
              <div>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Телефон"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#d4af37] hover:bg-[#c19a2f] text-black py-4 rounded-xl font-semibold text-lg transition-all"
              >
                Получить консультацию
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-6">
              Менеджер свяжется с вами в течение 15 минут
            </p>
          </div>
        </div>
      </div>

      {/* Мобильная версия формы (показывается только на мобильных) */}
      <div className="md:hidden absolute bottom-8 left-6 right-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-[#d4af37] text-black py-4 rounded-2xl font-semibold"
        >
          Получить консультацию
        </button>
      </div>

      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
