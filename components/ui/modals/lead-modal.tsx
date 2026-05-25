"use client";

import { useState } from "react";
import { toast } from "sonner";

type Props = {
  productTitle: string;
  productId: string;
  onClose: () => void;
};

export function LeadModal({ productTitle, productId, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Валидация и форматирование телефона
  const validateAndFormatPhone = (phone: string): string => {
    // Удаляем все кроме цифр и плюса
    let cleaned = phone.replace(/[^\d+]/g, "");

    // Если начинается с 8, меняем на +7
    if (cleaned.startsWith("8")) {
      cleaned = "+7" + cleaned.slice(1);
    }

    // Если нет плюса и не начинается с 8, добавляем +7
    if (!cleaned.startsWith("+") && cleaned.length > 0) {
      cleaned = "+7" + cleaned;
    }

    return cleaned;
  };

  const handleSubmit = async () => {
    // Базовая валидация
    if (!name.trim()) {
      toast("Введите ваше имя");
      return;
    }

    if (!phone.trim()) {
      toast("Введите номер телефона");
      return;
    }

    const formattedPhone = validateAndFormatPhone(phone);

    // Проверка длины телефона (10-15 цифр после очистки)
    const digitsOnly = formattedPhone.replace(/\D/g, "");
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      toast("Введите корректный номер телефона (10-15 цифр)");
      return;
    }

    setIsLoading(true);

    console.log("📤 Sending lead:", {
      name,
      originalPhone: phone,
      formattedPhone,
      productTitle,
      productId,
    });

    try {
      const response = await fetch("/api/leads/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: formattedPhone,
          product: productTitle,
          productId,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("JSON parse error:", jsonError);
        throw new Error("Неверный ответ от сервера");
      }

      if (!response.ok) {
        console.error("API ERROR:", data.error);
        toast(data.error || "Ошибка при отправке заявки");
        return;
      }

      console.log("✅ Lead sent successfully:", data);
      toast("✅ Заявка успешно отправлена!");

      // Очищаем форму
      setName("");
      setPhone("");

      // Закрываем модалку
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      toast("❌ Ошибка сервера. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  // Форматирование телефона при вводе (опционально)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Убираем все не-цифры
    const digits = value.replace(/\D/g, "");

    // Форматируем как +7 XXX XXX XX XX
    if (digits.length === 0) {
      setPhone("");
    } else if (digits.length <= 1) {
      setPhone(`+${digits}`);
    } else if (digits.length <= 4) {
      setPhone(`+${digits.slice(0, 1)} ${digits.slice(1)}`);
    } else if (digits.length <= 7) {
      setPhone(
        `+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4)}`,
      );
    } else if (digits.length <= 9) {
      setPhone(
        `+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`,
      );
    } else {
      setPhone(
        `+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`,
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
      <div className="w-[420px] rounded-2xl border border-white/10 bg-[#0f1724] p-6">
        <h2 className="text-xl font-semibold">Получить консультацию</h2>

        {productId && (
          <p className="mt-2 text-sm text-[#B8C2CE]">Товар: {productTitle}</p>
        )}

        <div className="mt-5 flex flex-col gap-3">
          <input
            placeholder="Ваше имя"
            className="rounded-lg bg-black/30 p-3 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />

          <input
            placeholder="+7 XXX XXX XX XX"
            className="rounded-lg bg-black/30 p-3 outline-none"
            value={phone}
            onChange={handlePhoneChange}
            disabled={isLoading}
          />

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-2 rounded-xl bg-[#D6A85F] py-3 font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Отправка..." : "Отправить заявку"}
          </button>

          <button
            onClick={onClose}
            className="text-sm text-[#B8C2CE] transition-colors hover:text-white"
            disabled={isLoading}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
