import React from "react";

const RionCard: React.FC = () => {
  return (
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
      </div>

      {/* Декоративная полоска внизу (опционально, как намёк на стиль магазина) */}
      <div className="h-1 bg-gradient-to-r from-amber-200 to-amber-600 w-full"></div>
    </div>
  );
};

export default RionCard;
