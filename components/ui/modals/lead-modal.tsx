"use client";

import { useState } from "react";
import { X, Clock, Shield, Phone } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/shared/types/product";
import {
  formatPrice,
  getPriceUnit,
  getProductImageUrl,
} from "@/shared/lib/product-utils";

type Props = {
  productTitle: string;
  productId: string;
  productPrice?: string;
  productCategory?: string;
  productImage?: string;
  productRecord?: Product;
  onClose: () => void;
};

export function LeadModal({
  productTitle,
  productId,
  productPrice,
  productCategory,
  productRecord,
  onClose,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const imageUrl = productRecord
    ? getProductImageUrl(productRecord)
    : "/placeholder.svg";

  const validateAndFormatPhone = (value: string): string => {
    let cleaned = value.replace(/[^\d+]/g, "");
    if (cleaned.startsWith("8")) cleaned = "+7" + cleaned.slice(1);
    if (!cleaned.startsWith("+") && cleaned.length > 0) cleaned = "+7" + cleaned;
    return cleaned;
  };

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Введите имя");
    if (!phone.trim()) return toast.error("Введите телефон");

    const formattedPhone = validateAndFormatPhone(phone);
    const digitsOnly = formattedPhone.replace(/\D/g, "");
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return toast.error("Введите корректный телефон");
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: formattedPhone,
          productId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const messages: Record<string, string> = {
          "Invalid name": "Введите имя",
          "Invalid phone": "Введите корректный телефон",
          "Invalid product": "Товар не найден",
        };
        toast.error(messages[data.error] ?? "Ошибка отправки");
        return;
      }

      toast.success(
        data.warning
          ? "Заявка принята! Мы свяжемся с вами."
          : "Заявка отправлена! Перезвоним за 10 минут.",
      );
      onClose();
    } catch {
      toast.error("Ошибка сервера. Позвоните: +7 (963) 704-81-77");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (!digits.length) return setPhone("");
    if (digits.length <= 1) setPhone(`+${digits}`);
    else if (digits.length <= 4)
      setPhone(`+${digits.slice(0, 1)} ${digits.slice(1)}`);
    else if (digits.length <= 7)
      setPhone(`+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4)}`);
    else if (digits.length <= 9)
      setPhone(
        `+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`,
      );
    else
      setPhone(
        `+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`,
      );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      style={{ animation: "modalFadeIn 0.25s ease forwards" }}
    >
      <div
        className="w-full max-w-md rounded-t-[24px] border border-[var(--border)] bg-white p-6 sm:rounded-[24px]"
        style={{ animation: "modalSlideUp 0.3s ease forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Узнать наличие и цену</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Бесплатно · Без обязательств
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[var(--muted)] hover:bg-[#f4f6f9]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-5 flex gap-4 rounded-2xl border border-[var(--border)] bg-[#f8fafc] p-3">
          <img
            src={imageUrl}
            alt=""
            className="h-16 w-16 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-medium">{productTitle}</p>
            {productPrice && (
              <p className="mt-1 text-lg font-bold text-[var(--primary)]">
                {formatPrice(productPrice)}{" "}
                <span className="text-sm font-normal text-[var(--muted)]">
                  {productCategory ? getPriceUnit(productCategory) : "₽"}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-emerald-400" /> Ответ за 10 мин
          </span>
          <span className="flex items-center gap-1">
            <Shield size={14} className="text-emerald-400" /> Гарантия
          </span>
          <span className="flex items-center gap-1">
            <Phone size={14} className="text-emerald-400" /> Без спама
          </span>
        </div>

        <div className="space-y-3">
          <input
            placeholder="Ваше имя"
            className="w-full rounded-xl border border-[var(--border)] bg-[#f8fafc] px-4 py-3 outline-none focus:border-[var(--primary)]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
          <input
            placeholder="+7 XXX XXX XX XX"
            className="w-full rounded-xl border border-[var(--border)] bg-[#f8fafc] px-4 py-3 outline-none focus:border-[var(--primary)]"
            value={phone}
            onChange={handlePhoneChange}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? "Отправка..." : "Отправить заявку"}
          </button>
          <a
            href="tel:+79637048177"
            className="btn-secondary w-full text-sm"
          >
            Или позвонить: +7 (963) 704-81-77
          </a>
        </div>
      </div>
    </div>
  );
}
