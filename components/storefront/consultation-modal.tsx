"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { HeroLeadForm } from "@/components/storefront/hero-lead-form";
import { useConsultation } from "@/components/storefront/consultation-context";

export function ConsultationModal() {
  const { isOpen, closeConsultation } = useConsultation();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeConsultation();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeConsultation]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-4"
      style={{ animation: "modalFadeIn 0.25s ease forwards" }}
      onClick={closeConsultation}
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultation-title"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-md rounded-t-[24px] bg-white p-6 shadow-2xl sm:rounded-[24px] sm:p-8"
        style={{ animation: "modalSlideUp 0.3s ease forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeConsultation}
          aria-label="Закрыть"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={20} />
        </button>

        <h2
          id="consultation-title"
          className="pr-8 text-2xl font-bold text-slate-900"
        >
          Подберём товары за 10 минут
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          Оставьте заявку — менеджер перезвонит, рассчитает количество и
          стоимость доставки
        </p>

        <div className="mt-6">
          <HeroLeadForm onSuccess={closeConsultation} />
        </div>
      </div>
    </div>
  );
}
