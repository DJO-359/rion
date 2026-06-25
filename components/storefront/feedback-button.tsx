"use client";

import { useConsultation } from "@/components/storefront/consultation-context";

export function FeedbackButton() {
  const { openConsultation } = useConsultation();

  return (
    <button
      type="button"
      onClick={openConsultation}
      aria-label="Обратная связь"
      className="fixed bottom-6 left-4 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_4px_24px_rgba(15,23,42,0.15)] transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_32px_rgba(37,99,235,0.25)] sm:bottom-8 sm:left-6 sm:h-16 sm:w-16"
    >
      <img
        src="/call.png"
        alt=""
        className="h-8 w-8 object-contain sm:h-9 sm:w-9"
      />
    </button>
  );
}
