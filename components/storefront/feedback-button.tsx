"use client";

import { useConsultation } from "@/components/storefront/consultation-context";

export function FeedbackButton() {
  const { openConsultation } = useConsultation();

  return (
    <button
      type="button"
      onClick={openConsultation}
      aria-label="Обратная связь"
      className="fixed bottom-[calc(1.5rem+4cm)] right-[calc(1rem+1cm)] z-[90] h-16 w-16 sm:bottom-[calc(2rem+4cm)] sm:right-[calc(1.5rem+1cm)] sm:h-16 sm:w-16 group"
    >
      {/* Пульсирующие круги */}
      <span className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping [animation-duration:2.8s]" />

      <span className="absolute inset-0 rounded-full border-2 border-blue-400/40 animate-ping [animation-delay:.7s] [animation-duration:2.8s]" />

      <span className="absolute inset-0 rounded-full border border-blue-300/30 animate-ping [animation-delay:1.4s] [animation-duration:2.8s]" />

      {/* Голубое свечение */}
      <span className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl" />

      {/* Кнопка */}
      <span
        className="
          relative
          flex
          h-full
          w-full
          items-center
          justify-center
          rounded-full
         
          shadow-[0_0_35px_rgba(37,99,235,0.55)]
          transition-all
          duration-300
          group-hover:scale-110
          group-hover:shadow-[0_0_50px_rgba(37,99,235,0.8)]
        "
      >
        <img src="/call.png" alt="" className="h-14 w-14 object-contain" />
      </span>
    </button>
  );
}
