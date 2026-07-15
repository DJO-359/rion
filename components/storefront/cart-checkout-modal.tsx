"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone, Send, X } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/storefront/cart-context";
import type { CartContactMethod } from "@/shared/types/cart";
import {
  buildCartContactMessage,
  getPhoneUrl,
  getTelegramUrl,
  getWhatsAppUrl,
  toCartLeadItems,
} from "@/shared/lib/cart-utils";

export function CartCheckoutModal() {
  const {
    isCheckoutOpen,
    closeCheckout,
    closeSheet,
    clearCart,
    resolvedItems,
    getTotalPrice,
  } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isCheckoutOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) closeCheckout();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCheckoutOpen, isLoading, closeCheckout]);

  useEffect(() => {
    if (isCheckoutOpen) {
      setError(null);
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handleContact = async (method: CartContactMethod) => {
    const leadItems = toCartLeadItems(resolvedItems);
    const totalPrice = getTotalPrice();

    if (!leadItems.length) {
      toast.error("Нет доступных товаров для оформления");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "cart",
          contactMethod: method,
          items: leadItems,
          totalPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError("Не удалось отправить заявку. Попробуйте ещё раз.");
        return;
      }

      const message = buildCartContactMessage(leadItems, totalPrice);

      clearCart();
      closeCheckout();
      closeSheet();

      if (method === "whatsapp") {
        window.open(getWhatsAppUrl(message), "_blank", "noopener,noreferrer");
      } else if (method === "telegram") {
        window.open(getTelegramUrl(message), "_blank", "noopener,noreferrer");
      } else {
        window.location.href = getPhoneUrl();
      }

      toast.success(
        data.warning
          ? "Заявка принята! Мы свяжемся с вами."
          : "Заявка отправлена! Спасибо за заказ.",
      );
    } catch {
      setError("Ошибка соединения. Проверьте интернет и попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[160] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      style={{ animation: "modalFadeIn 0.25s ease forwards" }}
      onClick={() => !isLoading && closeCheckout()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-checkout-title"
    >
      <div
        className="w-full max-w-md rounded-t-[24px] border border-[var(--border)] bg-white p-6 sm:rounded-[24px]"
        style={{ animation: "modalSlideUp 0.3s ease forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2
              id="cart-checkout-title"
              className="text-xl font-bold text-slate-900"
            >
              Оформить заказ
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Выберите удобный способ связи
            </p>
          </div>
          <button
            type="button"
            onClick={closeCheckout}
            disabled={isLoading}
            aria-label="Закрыть"
            className="rounded-lg p-1 text-[var(--muted)] hover:bg-[#f4f6f9] disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleContact("whatsapp")}
            className="btn-primary flex w-full items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            {isLoading ? "Отправка..." : "WhatsApp"}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleContact("telegram")}
            className="btn-secondary flex w-full items-center justify-center gap-2"
          >
            <Send size={18} />
            Telegram
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleContact("phone")}
            className="btn-secondary flex w-full items-center justify-center gap-2"
          >
            <Phone size={18} />
            Позвонить
          </button>
        </div>
      </div>
    </div>
  );
}
