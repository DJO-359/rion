"use client";

import { useState } from "react";

type Props = {
  productTitle?: string;
  onClose: () => void;
};

export function LeadModal({ productTitle, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    // позже подключим API / Supabase
    console.log({
      name,
      phone,
      product: productTitle || "Общий запрос",
    });

    alert("Заявка отправлена!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
      <div className="w-[420px] rounded-2xl border border-white/10 bg-[#0f1724] p-6">
        <h2 className="text-xl font-semibold">Получить консультацию</h2>

        {productTitle && (
          <p className="mt-2 text-sm text-[#B8C2CE]">Товар: {productTitle}</p>
        )}

        <div className="mt-5 flex flex-col gap-3">
          <input
            placeholder="Ваше имя"
            className="rounded-lg bg-black/30 p-3 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Телефон"
            className="rounded-lg bg-black/30 p-3 outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="mt-2 rounded-xl bg-[#D6A85F] py-3 font-medium text-black"
          >
            Отправить заявку
          </button>

          <button onClick={onClose} className="text-sm text-[#B8C2CE]">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
