"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase";

type Lead = {
  id: string;
  name: string;
  phone: string;
  product: string;
  status: string;
  created_at: string;
};

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

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

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("leads").update({ status }).eq("id", id);

    fetchLeads();
  };

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

            <div className="text-sm text-[#B8C2CE]">{lead.product}</div>

            <div>
              <select
                value={lead.status || "new"}
                onChange={async (e) => {
                  const newStatus = e.target.value;

                  console.log("Меняем статус:", newStatus);

                  // UI UPDATE
                  setLeads((prev: any[]) =>
                    prev.map((item) =>
                      item.id === lead.id
                        ? { ...item, status: newStatus }
                        : item,
                    ),
                  );

                  // DB UPDATE
                  const { data, error } = await supabase
                    .from("leads")
                    .update({
                      status: newStatus,
                    })
                    .eq("id", lead.id)
                    .select();

                  console.log("RESULT:", data);

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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
