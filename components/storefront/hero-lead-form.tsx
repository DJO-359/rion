"use client";

import { useState } from "react";
import { Phone, User } from "lucide-react";
import { toast } from "sonner";

type Props = {
  onSuccess?: () => void;
};

export function HeroLeadForm({ onSuccess }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Введите имя");
    if (!phone.trim()) return toast.error("Введите телефон");
    if (!agreed) return toast.error("Нужно согласие на обработку данных");

    setLoading(true);
    try {
      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          productId: "general_consultation",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Не удалось отправить заявку. Позвоните нам.");
        return;
      }
      toast.success("Заявка принята! Перезвоним за 10 минут.");
      setName("");
      setPhone("");
      onSuccess?.();
    } catch {
      toast.error("Ошибка сети. Позвоните: +7 (963) 704-81-77");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[#f8fafc] px-5 py-4">
        <User size={18} className="shrink-0 text-[var(--primary)]" />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше имя"
          className="w-full bg-transparent text-slate-900 outline-none placeholder:text-[var(--muted-foreground)]"
        />
      </div>
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[#f8fafc] px-5 py-4">
        <Phone size={18} className="shrink-0 text-[var(--primary)]" />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 (___) ___-__-__"
          className="w-full bg-transparent text-slate-900 outline-none placeholder:text-[var(--muted-foreground)]"
        />
      </div>
      <label className="flex gap-3 text-sm leading-relaxed text-[var(--muted)]">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 accent-[var(--primary)]"
        />
        Согласие на обработку персональных данных
      </label>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Отправка..." : "Получить консультацию"}
      </button>
      <p className="text-center text-sm text-[var(--muted-foreground)]">
        Перезвоним за 10 минут · Без спама
      </p>
    </form>
  );
}
