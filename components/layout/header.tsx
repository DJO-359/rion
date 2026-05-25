import React from "react";

const RionCard: React.FC = () => {
  return (
<<<<<<< HEAD
    <div className="max-w-md w-full bg-white rounded-2xl shadow-md overflow-hidden font-sans">
      {/* Верхняя секция: RION + подпись */}
      <div className="pt-5 px-5 pb-1">
        <div className="flex justify-between items-baseline flex-wrap gap-1">
          <span className="text-2xl md:text-3xl font-bold tracking-wide text-gray-900">
            RION
          </span>
          <span className="text-xs text-gray-500 font-normal">
            Вход дом, наш дизайн
          </span>
        </div>
      </div>

      {/* Навигация: категории товаров */}
      <div className="flex flex-wrap gap-4 px-5 pt-4 pb-3 border-b border-gray-100">
        {[
          "Плитка",
          "Ламинат",
          "Сантехника",
          "Смесители",
          "Люстры",
          "Ковры",
          "Акции",
        ].map((category) => (
          <a
            key={category}
            href="#"
            className="text-sm md:text-base font-medium text-gray-700 hover:text-amber-700 transition-colors"
          >
            {category}
          </a>
        ))}
      </div>

      {/* Контакты: телефон и часы работы */}
      <div className="flex flex-wrap justify-between items-center gap-3 px-5 py-4 bg-gray-50 border-b border-gray-100">
        <div className="text-lg md:text-xl font-bold text-gray-900 tracking-wide">
          +7 (928) 555-33-55
        </div>
        <div className="text-xs text-gray-500">с 9:00 до 20:00</div>
      </div>

      {/* Кнопка "Узнать наличие" */}
      <div className="p-5">
        <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-full transition-colors shadow-sm">
          Узнать наличие
        </button>
=======
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#07111F]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[86px] max-w-[1440px] items-center justify-between px-4 md:px-8">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#D6A85F] bg-white">
            <span className="text-2xl font-bold text-black">R</span>
          </div>

          <div className="leading-none">
            <div className="text-[34px] font-semibold tracking-wide text-white">
              RION
            </div>

            <div className="mt-1 text-xs text-white/70">
              Ваш дом, наш дизайн
            </div>
          </div>
        </div>

        {/* CENTER */}
        <nav className="hidden items-center gap-10 lg:flex">
          <a
            href="#"
            className="text-[15px] font-medium text-white transition hover:text-[#D6A85F]"
          >
            Плитка
          </a>

          <a
            href="#"
            className="text-[15px] font-medium text-white transition hover:text-[#D6A85F]"
          >
            Ламинат
          </a>

          <a
            href="#"
            className="text-[15px] font-medium text-white transition hover:text-[#D6A85F]"
          >
            Сантехника
          </a>

          <a
            href="#"
            className="text-[15px] font-medium text-white transition hover:text-[#D6A85F]"
          >
            Смесители
          </a>

          <a
            href="#"
            className="text-[15px] font-medium text-white transition hover:text-[#D6A85F]"
          >
            Люстры
          </a>

          <a
            href="#"
            className="text-[15px] font-medium text-white transition hover:text-[#D6A85F]"
          >
            Ковры
          </a>

          <a
            href="#"
            className="text-[15px] font-medium text-[#D6A85F] transition"
          >
            Акции
          </a>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-6">
          <div className="hidden text-right lg:block">
            <div className="text-lg font-semibold text-white">
              +7 (928) 555-33-55
            </div>

            <div className="mt-1 text-sm text-white/70">c 9:00 до 20:00</div>
          </div>

          <button className="rounded-xl bg-[#D6A85F] px-18 py-12 text-sm font-semibold text-black transition hover:bg-[#e4b66c]">
            Узнать наличие
          </button>
        </div>
>>>>>>> 6e860acdb2a5f0d5a9dc45988faed113954e9d9a
      </div>

      {/* Декоративная полоска внизу (опционально, как намёк на стиль магазина) */}
      <div className="h-1 bg-gradient-to-r from-amber-200 to-amber-600 w-full"></div>
    </div>
  );
};

export default RionCard;
