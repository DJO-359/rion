"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/shared/lib/supabase";
import type { Product } from "@/shared/types/product";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Lead = {
  id: string;
  name: string;
  phone: string;
  product: string;
  status: string;
  notes?: string;
  created_at: string;
  products?: Product;
};

const LIMIT = 20;

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const handleLogout = async () => {
    await fetch("/api/admin-logout", { method: "POST" });
    window.location.href = "/admin-login";
  };

  const fetchLeads = async (reset = false) => {
    try {
      const currentPage = reset ? 0 : page;
      const from = currentPage * LIMIT;
      const to = from + LIMIT - 1;

      const { data, error } = await supabase
        .from("leads")
        .select(`*, products (*)`)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error(error);
        return;
      }

      if (reset) {
        setLeads(data || []);
        setPage(1);
      } else {
        setLeads((prev) => [...prev, ...(data || [])]);
        setPage((prev) => prev + 1);
      }

      if (!data || data.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLeads(true);

    const channel = supabase
      .channel("leads-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => fetchLeads(true),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const query = search.toLowerCase();
      const matchesSearch =
        lead.name.toLowerCase().includes(query) ||
        lead.phone.toLowerCase().includes(query) ||
        lead.product.toLowerCase().includes(query);
      const matchesFilter = filter === "all" ? true : lead.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [leads, search, filter]);

  const groupedLeads = useMemo(() => {
    return filteredLeads.reduce((acc: Record<string, Lead[]>, lead) => {
      const date = new Date(lead.created_at);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let label = "";
      if (date.toDateString() === today.toDateString()) label = "Сегодня";
      else if (date.toDateString() === yesterday.toDateString())
        label = "Вчера";
      else label = date.toLocaleDateString("ru-RU");

      if (!acc[label]) acc[label] = [];
      acc[label].push(lead);
      return acc;
    }, {});
  }, [filteredLeads]);

  const stats = {
    new: leads.filter((l) => l.status === "new").length,
    processing: leads.filter((l) => l.status === "processing").length,
    confirmed: leads.filter((l) => l.status === "confirmed").length,
    canceled: leads.filter((l) => l.status === "canceled").length,
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayLeads = leads.filter(
    (lead) => new Date(lead.created_at) >= today,
  ).length;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekLeads = leads.filter(
    (lead) => new Date(lead.created_at) >= weekAgo,
  ).length;

  const confirmedLeads = stats.confirmed;
  const canceledLeads = stats.canceled;

  const conversion =
    leads.length > 0 ? Math.round((confirmedLeads / leads.length) * 100) : 0;

  const canceledPercent =
    leads.length > 0 ? Math.round((canceledLeads / leads.length) * 100) : 0;

  const popularProducts = Object.values(
    leads.reduce(
      (acc: Record<string, { name: string; count: number }>, lead) => {
        if (!acc[lead.product]) {
          acc[lead.product] = { name: lead.product, count: 0 };
        }
        acc[lead.product].count++;
        return acc;
      },
      {},
    ),
  ).sort((a, b) => b.count - a.count);

  // Данные для графика "за 7 дней"
  const dailyLeads = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const dateStr = d.toDateString();
      const count = leads.filter(
        (lead) => new Date(lead.created_at).toDateString() === dateStr,
      ).length;
      days.push({
        date: d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
        count,
      });
    }
    return days;
  }, [leads]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07111f]">
        <div className="text-white">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111f] p-4 md:p-8">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">RION CRM</h1>
          <p className="mt-2 text-[#B8C2CE]">Управление заявками</p>

          {/* АНАЛИТИКА с графиками */}
          <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {/* Лидов сегодня */}
            <div className="rounded-3xl bg-[#111827] p-6">
              <p className="text-zinc-400">Лидов сегодня</p>
              <h2 className="mt-2 text-4xl font-bold">{todayLeads}</h2>
            </div>

            {/* За 7 дней + мини-график */}
            <div className="rounded-3xl bg-[#111827] p-6">
              <p className="text-zinc-400">За 7 дней</p>
              <h2 className="mt-2 text-4xl font-bold">{weekLeads}</h2>
              <div className="mt-3 h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyLeads}>
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Tooltip
                      contentStyle={{ background: "#1f2937", border: "none" }}
                      labelStyle={{ color: "#fff" }}
                      formatter={(value) => [`${value} лидов`, "Динамика"]}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Конверсия */}
            <div className="rounded-3xl bg-[#111827] p-6">
              <p className="text-zinc-400">Конверсия</p>
              <h2 className="mt-2 text-4xl font-bold text-green-400">
                {conversion}%
              </h2>
            </div>

            {/* Отмены */}
            <div className="rounded-3xl bg-[#111827] p-6">
              <p className="text-zinc-400">Отмены</p>
              <h2 className="mt-2 text-4xl font-bold text-red-400">
                {canceledPercent}%
              </h2>
            </div>
          </div>

          {/* ПОПУЛЯРНЫЕ ТОВАРЫ – растянутый блок */}
          {/* ПОПУЛЯРНЫЕ ТОВАРЫ – растянутый блок */}
          <div className="mt-8 rounded-3xl bg-zinc-900 p-8 -mx-4 md:-mx-8">
            <h2 className="text-2xl font-bold mb-4">Популярные товары</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* левая колонка – список как на скрине */}
              <div className="space-y-3">
                {popularProducts.slice(0, 5).map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-center border-b border-gray-700 pb-2"
                  >
                    <span className="text-white font-medium">{item.name}</span>
                    <span className="text-violet-400 font-bold">
                      {item.count} лидов
                    </span>
                  </div>
                ))}
                {popularProducts.length === 0 && (
                  <div className="text-gray-400">Нет данных</div>
                )}
              </div>

              {/* правая колонка – вертикальные бары */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={popularProducts.slice(0, 5)}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{
                        fill: "#cbd5e1",
                        fontSize: 11,
                        angle: -15,
                        textAnchor: "end",
                      }}
                      interval={0}
                      height={60}
                    />
                    <YAxis tick={{ fill: "#cbd5e1" }} />
                    <Tooltip
                      contentStyle={{ background: "#1f2937", border: "none" }}
                      formatter={(value) => [`${value} лидов`, "Популярность"]}
                    />
                    <Bar dataKey="count" fill="#a855f7" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-[#C89B5E] px-4 py-2 font-medium text-black">
            Всего: {leads.length}
          </div>
          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          >
            Выйти
          </button>
        </div>
      </div>

      {/* СТАТУСЫ */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 p-6">
          <p className="text-yellow-400">Новые</p>
          <h2 className="mt-2 text-3xl font-bold text-white">{stats.new}</h2>
        </div>
        <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-blue-500/5 p-6">
          <p className="text-blue-400">В обработке</p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            {stats.processing}
          </h2>
        </div>
        <div className="rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/20 to-green-500/5 p-6">
          <p className="text-green-400">Подтверждены</p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            {stats.confirmed}
          </h2>
        </div>
        <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/20 to-red-500/5 p-6">
          <p className="text-red-400">Отменены</p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            {stats.canceled}
          </h2>
        </div>
      </div>

      {/* ПОИСК */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Поиск по имени, телефону или товару..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 text-white outline-none focus:border-violet-500"
        />
      </div>

      {/* ФИЛЬТРЫ */}
      <div className="mb-8 flex flex-wrap gap-3">
        {[
          { value: "all", label: "Все" },
          { value: "new", label: "🟡 Новые" },
          { value: "processing", label: "🔵 В обработке" },
          { value: "confirmed", label: "🟢 Подтверждены" },
          { value: "canceled", label: "🔴 Отменены" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            className={`rounded-xl px-5 py-2 font-medium transition ${
              filter === item.value
                ? "bg-violet-600 text-white"
                : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* КАРТОЧКИ ЗАЯВОК */}
      <div>
        {Object.entries(groupedLeads).map(([date, items]) => (
          <div key={date} className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-violet-400">{date}</h2>
            <div>
              {items.map((lead, idx) => (
                <div
                  key={lead.id}
                  className={`rounded-2xl bg-zinc-800 p-6 transition hover:bg-zinc-700/80 ${
                    idx !== items.length - 1 ? "mb-6" : ""
                  }`}
                >
                  {/* Шапка: имя и телефон */}
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20">
                          <span className="text-violet-400">👤</span>
                        </div>
                        <h3 className="text-xl font-semibold text-white">
                          {lead.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 pl-13">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                          <span className="text-emerald-400">📞</span>
                        </div>
                        <a
                          href={`tel:${lead.phone}`}
                          className="text-lg font-medium text-[#D6A85F] hover:underline"
                        >
                          {lead.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <select
                        value={lead.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          setLeads((prev) =>
                            prev.map((l) =>
                              l.id === lead.id
                                ? { ...l, status: newStatus }
                                : l,
                            ),
                          );
                          await supabase
                            .from("leads")
                            .update({ status: newStatus })
                            .eq("id", lead.id);
                        }}
                        className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium ${
                          lead.status === "new"
                            ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
                            : lead.status === "processing"
                              ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                              : lead.status === "confirmed"
                                ? "border-green-500/50 bg-green-500/10 text-green-400"
                                : "border-red-500/50 bg-red-500/10 text-red-400"
                        }`}
                      >
                        <option value="new">🟡 Новый</option>
                        <option value="processing">🔵 В обработке</option>
                        <option value="confirmed">🟢 Подтвержден</option>
                        <option value="canceled">🔴 Отменен</option>
                      </select>

                      <div className="flex gap-2">
                        <a
                          href={`tel:${lead.phone}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
                        >
                          📞 Позвонить
                        </a>
                        <a
                          href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 rounded-lg bg-[#25D366] px-4 py-2 text-sm text-black hover:opacity-90"
                        >
                          💬 WhatsApp
                        </a>
                        <button
                          onClick={async () => {
                            if (!confirm("Удалить заявку?")) return;
                            await supabase
                              .from("leads")
                              .delete()
                              .eq("id", lead.id);
                            setLeads((prev) =>
                              prev.filter((l) => l.id !== lead.id),
                            );
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-500/80 px-4 py-2 text-sm text-white hover:bg-red-600"
                        >
                          🗑️ Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                  {lead.products?.image && (
                    <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                      <img
                        src={lead.products.image}
                        alt={lead.product}
                        className="h-[260px] w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Характеристики товара */}
                  <div className="mt-6 border-t border-white/10 pt-6">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 items-center">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-[#B8C2CE]">
                          Товар
                        </div>
                        <div className="font-medium text-white">
                          {lead.product}
                        </div>
                      </div>
                      {lead.products?.brand && (
                        <div>
                          <div className="text-xs uppercase tracking-wider text-[#B8C2CE]">
                            Бренд
                          </div>
                          <div className="text-white">
                            {lead.products.brand}
                          </div>
                        </div>
                      )}
                      {lead.products?.country && (
                        <div>
                          <div className="text-xs uppercase tracking-wider text-[#B8C2CE]">
                            Страна
                          </div>
                          <div className="text-white">
                            {lead.products.country}
                          </div>
                        </div>
                      )}
                      {lead.products?.size && (
                        <div>
                          <div className="text-xs uppercase tracking-wider text-[#B8C2CE]">
                            Размер
                          </div>
                          <div className="text-white">{lead.products.size}</div>
                        </div>
                      )}
                      {lead.products?.material && (
                        <div>
                          <div className="text-xs uppercase tracking-wider text-[#B8C2CE]">
                            Материал
                          </div>
                          <div className="text-white">
                            {lead.products.material}
                          </div>
                        </div>
                      )}
                      {lead.products?.price && (
                        <div>
                          <div className="text-xs uppercase tracking-wider text-[#B8C2CE]">
                            Цена
                          </div>
                          <div className="text-lg font-bold text-[#D6A85F]">
                            {lead.products.price} ₽
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Комментарий менеджера */}
                  <div className="mt-6">
                    <div className="mb-2 text-xs uppercase tracking-wider text-[#B8C2CE]">
                      Комментарий менеджера
                    </div>
                    <textarea
                      placeholder="✏️ Введите заметку по заявке..."
                      defaultValue={lead.notes || ""}
                      onBlur={async (e) => {
                        const value = e.target.value;
                        await supabase
                          .from("leads")
                          .update({ notes: value })
                          .eq("id", lead.id);
                      }}
                      rows={2}
                      className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Загрузить ещё */}
      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => fetchLeads()}
            className="rounded-2xl bg-violet-600 px-8 py-4 font-medium text-white transition hover:bg-violet-700"
          >
            Загрузить еще
          </button>
        </div>
      )}

      {filteredLeads.length === 0 && !loading && (
        <div className="py-20 text-center">
          <p className="text-[#B8C2CE]">Заявок не найдено</p>
        </div>
      )}
    </div>
  );
}
