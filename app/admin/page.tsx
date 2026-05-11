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

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data } = await supabase
      .from("leads")
      .select("*")
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
                value={lead.status}
                onChange={(e) => updateStatus(lead.id, e.target.value)}
                className="rounded-lg bg-black/30 p-2 outline-none"
              >
                <option value="new">new</option>
                <option value="contacted">contacted</option>
                <option value="closed">closed</option>
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
