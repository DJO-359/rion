"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase";
import type { Product } from "@/shared/types/product";

type Lead = {
  id: string;
  name: string;
  phone: string;
  product: string;
  status: string;
  created_at: string;
  products?: Product;
};

const groupLeadsByDate = (leads: Lead[]) => {
  return leads.reduce((groups: Record<string, Lead[]>, lead) => {
    const date = new Date(lead.created_at);

    const today = new Date();

    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();

    const isYesterday = date.toDateString() === yesterday.toDateString();

    let label = "";

    if (isToday) {
      label = "Сегодня";
    } else if (isYesterday) {
      label = "Вчера";
    } else {
      label = date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    if (!groups[label]) {
      groups[label] = [];
    }

    groups[label].push(lead);

    return groups;
  }, {});
};

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const handleLogout = async () => {
    await fetch("/api/admin-logout", {
      method: "POST",
    });

    window.location.href = "/admin-login";
  };

  const newLeads = leads.filter((lead) => lead.status === "new").length;

  const processingLeads = leads.filter(
    (lead) => lead.status === "processing",
  ).length;

  const confirmedLeads = leads.filter(
    (lead) => lead.status === "confirmed",
  ).length;

  const canceledLeads = leads.filter(
    (lead) => lead.status === "canceled",
  ).length;

  useEffect(() => {
    fetchLeads();

    const channel = supabase
      .channel("leads-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
        },
        (payload) => {
          console.log("NEW LEAD:", payload);

          fetchLeads();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLeads = async () => {
    const { data } = await supabase
      .from("leads")
      .select(
        `
  *,
  products (*)
`,
      )
      .order("created_at", { ascending: false });

    setLeads(data || []);
    setLoading(false);
  };

  const filteredLeads = leads.filter((lead) => {
    const query = search.toLowerCase();

    const matchesSearch =
      lead.name.toLowerCase().includes(query) ||
      lead.phone.toLowerCase().includes(query) ||
      lead.product.toLowerCase().includes(query);

    const matchesFilter = filter === "all" ? true : lead.status === filter;

    return matchesSearch && matchesFilter;
  });

  const groupedLeads = groupLeadsByDate(filteredLeads);

  if (loading) {
    return <div className="p-10 text-white">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-[#07111f] p-8 text-white">
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">RION CRM</h1>
          <div className="mb-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            <div className="rounded-3xl bg-zinc-900 p-6">
              <p className="text-zinc-400">Новые</p>

              <h2 className="mt-2 text-4xl font-bold">{newLeads}</h2>
            </div>

            <div className="rounded-3xl bg-zinc-900 p-6">
              <p className="text-zinc-400">В обработке</p>

              <h2 className="mt-2 text-4xl font-bold">{processingLeads}</h2>
            </div>

            <div className="rounded-3xl bg-zinc-900 p-6">
              <p className="text-zinc-400">Подтверждены</p>

              <h2 className="mt-2 text-4xl font-bold">{confirmedLeads}</h2>
            </div>

            <div className="rounded-3xl bg-zinc-900 p-6">
              <p className="text-zinc-400">Отменены</p>

              <h2 className="mt-2 text-4xl font-bold">{canceledLeads}</h2>
            </div>
          </div>
          <p className="mt-2 text-[#B8C2CE]">Управление заявками</p>
        </div>

        <div className="rounded-xl bg-[#D6A85F] px-4 py-2 text-black">
          Leads: {leads.length}
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-xl px-4 py-2 ${
            filter === "all" ? "bg-violet-600" : "bg-zinc-800"
          }`}
        >
          Все
        </button>

        <button
          onClick={() => setFilter("new")}
          className={`rounded-xl px-4 py-2 ${
            filter === "new" ? "bg-yellow-500 text-black" : "bg-zinc-800"
          }`}
        >
          Новые
        </button>

        <button
          onClick={() => setFilter("processing")}
          className={`rounded-xl px-4 py-2 ${
            filter === "processing" ? "bg-blue-500" : "bg-zinc-800"
          }`}
        >
          В обработке
        </button>

        <button
          onClick={() => setFilter("confirmed")}
          className={`rounded-xl px-4 py-2 ${
            filter === "confirmed" ? "bg-green-500 text-black" : "bg-zinc-800"
          }`}
        >
          Подтвержденные
        </button>

        <button
          onClick={() => setFilter("canceled")}
          className={`rounded-xl px-4 py-2 ${
            filter === "canceled" ? "bg-red-500" : "bg-zinc-800"
          }`}
        >
          Отменённые
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-white/10">
        {/* HEAD */}
        <div className="grid grid-cols-5 border-b border-white/10 bg-white/5 p-4 font-medium">
          <div>Клиент</div>
          <div>Телефон</div>
          <div>Товар</div>
          <div>Статус</div>
          <div>Действия</div>
        </div>

        {/* ROWS */}
        {Object.entries(groupedLeads).map(([date, leads]) => (
          <div key={date}>
            <div className="bg-[#0f1724] px-6 py-4 text-lg font-semibold text-violet-400">
              {date}
            </div>

            {leads.map((lead) => (
              <div
                key={lead.id}
                className="grid grid-cols-5 items-center border-b border-white/5 p-4"
              >
                <div>{lead.name}</div>

                <div>
                  <a href={`tel:${lead.phone}`} className="text-[#D6A85F]">
                    {lead.phone}
                  </a>
                </div>

                <div className="text-sm text-[#B8C2CE]">
                  {lead.product}

                  <div className="mt-2 text-sm text-zinc-400">
                    <p>Бренд: {lead.products?.brand}</p>

                    <p>Страна: {lead.products?.country}</p>

                    <p>Размер: {lead.products?.size}</p>

                    <p>Материал: {lead.products?.material}</p>

                    <p>Цена: {lead.products?.price} ₽</p>
                  </div>
                </div>

                <div>
                  <select
                    value={lead.status || "new"}
                    onChange={async (e) => {
                      const newStatus = e.target.value;

                      const { error } = await supabase
                        .from("leads")
                        .update({
                          status: newStatus,
                        })
                        .eq("id", lead.id);

                      if (error) {
                        console.error(error);

                        alert("Ошибка обновления");
                      }
                    }}
                    className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
                  >
                    <option value="new">Новая</option>

                    <option value="processing">В обработке</option>

                    <option value="confirmed">Подтверждена</option>

                    <option value="canceled">Отменена</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`tel:${lead.phone}`}
                    className="rounded-lg bg-white/10 px-3 py-2 text-sm"
                  >
                    Позвонить
                  </a>

                  <a
                    href={`https://wa.me/${lead.phone}`}
                    target="_blank"
                    className="rounded-lg bg-[#25D366] px-3 py-2 text-sm text-black"
                  >
                    WhatsApp
                  </a>

                  <button
                    onClick={async () => {
                      const confirmed = confirm("Удалить заявку?");

                      if (!confirmed) return;

                      const { error } = await supabase
                        .from("leads")
                        .delete()
                        .eq("id", lead.id);

                      if (error) {
                        console.error(error);

                        alert(error.message);

                        return;
                      }
                    }}
                    className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="rounded-xl bg-red-500 px-4 py-2 text-white"
      >
        Выйти
      </button>
    </div>
  );
}
