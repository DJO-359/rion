"use client";

import { useState } from "react";
import { supabase } from "@/shared/lib/supabase";

type Props = {
  product?: any;
  onClose: () => void;
};
export function LeadModal({ product, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async () => {
    console.log("submit works");

    const { error } = await supabase.from("leads").insert({
      name,
      phone,

      product: product.title,

      product_id: product.id,

      status: "new",
    });

    if (error) {
      console.error("SUPABASE ERROR:", error);
      alert("Ошибка");
      return;
    }

    alert("Заявка отправлена");

    setName("");
    setPhone("");

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
      <div className="w-[420px] rounded-2xl border border-white/10 bg-[#0f1724] p-6">
        <h2 className="text-xl font-semibold">Получить консультацию</h2>

        {product && (
          <p className="mt-2 text-sm text-[#B8C2CE]">Товар: {product.title}</p>
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
