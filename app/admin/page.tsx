"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import pb from "@/shared/lib/pocketbase";
import { adminLogout, useAdminAuth } from "@/shared/hooks/use-admin-auth";
import type { Order } from "@/shared/types/product";
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

const LIMIT = 20;

export default function AdminPage() {
  const { authorized, loading: authLoading } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchOrders = useCallback(async (reset = false) => {
    try {
      const nextPage = reset ? 1 : pageRef.current + 1;

      const result = await pb.collection("orders").getList<Order>(nextPage, LIMIT, {
        sort: "-created",
        expand: "product",
      });

      if (reset) {
        setOrders(result.items);
        pageRef.current = 1;
      } else {
        setOrders((prev) => [...prev, ...result.items]);
        pageRef.current = nextPage;
      }

      setHasMore(result.items.length === LIMIT);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authorized) return;

    fetchOrders(true);

    pb.collection("orders").subscribe("*", () => {
      fetchOrders(true);
    });

    return () => {
      pb.collection("orders").unsubscribe("*");
    };
  }, [authorized, fetchOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = search.toLowerCase();
      const productTitle = order.expand?.product?.title?.toLowerCase() || "";
      const matchesSearch =
        order.name.toLowerCase().includes(query) ||
        order.phone.toLowerCase().includes(query) ||
        productTitle.includes(query);
      const matchesFilter = filter === "all" ? true : order.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [orders, search, filter]);

  const groupedOrders = useMemo(() => {
    return filteredOrders.reduce((acc: Record<string, Order[]>, order) => {
      const date = new Date(order.created);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let label = "";
      if (date.toDateString() === today.toDateString()) label = "Сегодня";
      else if (date.toDateString() === yesterday.toDateString())
        label = "Вчера";
      else label = date.toLocaleDateString("ru-RU");

      if (!acc[label]) acc[label] = [];
      acc[label].push(order);
      return acc;
    }, {});
  }, [filteredOrders]);

  const stats = {
    new: orders.filter((o) => o.status === "new").length,
    processing: orders.filter((o) => o.status === "processing").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    canceled: orders.filter((o) => o.status === "canceled").length,
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter(
    (order) => new Date(order.created) >= today,
  ).length;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekOrders = orders.filter(
    (order) => new Date(order.created) >= weekAgo,
  ).length;

  const confirmedOrders = stats.confirmed;
  const canceledOrders = stats.canceled;
  const conversion =
    orders.length > 0 ? Math.round((confirmedOrders / orders.length) * 100) : 0;
  const canceledPercent =
    orders.length > 0 ? Math.round((canceledOrders / orders.length) * 100) : 0;

  const popularProducts = useMemo(() => {
    const counts = orders.reduce(
      (acc, order) => {
        const title = order.expand?.product?.title;
        if (title) {
          acc[title] = (acc[title] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [orders]);

  const dailyOrders = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const count = orders.filter(
        (order) => new Date(order.created).toDateString() === d.toDateString(),
      ).length;
      days.push({
        date: d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
        count,
      });
    }
    return days;
  }, [orders]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await pb.collection("orders").update(orderId, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    } catch (error) {
      console.error("Ошибка обновления статуса:", error);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Удалить заявку?")) return;
    try {
      await pb.collection("orders").delete(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  const updateNotes = async (orderId: string, notes: string) => {
    try {
      await pb.collection("orders").update(orderId, { notes });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, notes } : o)),
      );
    } catch (error) {
      console.error("Ошибка сохранения заметки:", error);
    }
  };

  if (!authorized || authLoading || loading) {
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
            <div className="rounded-3xl bg-[#111827] p-6">
              <p className="text-zinc-400">Лидов сегодня</p>
              <h2 className="mt-2 text-4xl font-bold">{todayOrders}</h2>
            </div>
            <div className="rounded-3xl bg-[#111827] p-6">
              <p className="text-zinc-400">За 7 дней</p>
              <h2 className="mt-2 text-4xl font-bold">{weekOrders}</h2>
              <div className="mt-3 h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyOrders}>
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
            <div className="rounded-3xl bg-[#111827] p-6">
              <p className="text-zinc-400">Конверсия</p>
              <h2 className="mt-2 text-4xl font-bold text-green-400">
                {conversion}%
              </h2>
            </div>
            <div className="rounded-3xl bg-[#111827] p-6">
              <p className="text-zinc-400">Отмены</p>
              <h2 className="mt-2 text-4xl font-bold text-red-400">
                {canceledPercent}%
              </h2>
            </div>
          </div>

          {/* ПОПУЛЯРНЫЕ ТОВАРЫ */}
          <div className="mt-8 rounded-3xl bg-zinc-900 p-8 -mx-4 md:-mx-8">
            <h2 className="text-2xl font-bold mb-4">Популярные товары</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            Всего: {orders.length}
          </div>
          <a
            href="/admin/products"
            className="rounded-xl bg-zinc-700 px-4 py-2 text-white transition hover:bg-zinc-600"
          >
            Товары
          </a>
          <button
            onClick={adminLogout}
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
        {Object.entries(groupedOrders).map(([date, items]) => (
          <div key={date} className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-violet-400">{date}</h2>
            <div>
              {items.map((order, idx) => {
                const product = order.expand?.product;
                const imageUrl = product?.images?.[0]
                  ? pb.files.getURL(product, product.images[0])
                  : null;
                return (
                  <div
                    key={order.id}
                    className={`rounded-2xl bg-zinc-800 p-6 transition hover:bg-zinc-700/80 ${
                      idx !== items.length - 1 ? "mb-6" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20">
                            <span className="text-violet-400">👤</span>
                          </div>
                          <h3 className="text-xl font-semibold text-white">
                            {order.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 pl-13">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                            <span className="text-emerald-400">📞</span>
                          </div>
                          <a
                            href={`tel:${order.phone}`}
                            className="text-lg font-medium text-[#D6A85F] hover:underline"
                          >
                            {order.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order.id, e.target.value)
                          }
                          className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium ${
                            order.status === "new"
                              ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
                              : order.status === "processing"
                                ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                                : order.status === "confirmed"
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
                            href={`tel:${order.phone}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
                          >
                            📞 Позвонить
                          </a>
                          <a
                            href={`https://wa.me/${order.phone.replace(
                              /\D/g,
                              "",
                            )}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 rounded-lg bg-[#25D366] px-4 py-2 text-sm text-black hover:opacity-90"
                          >
                            💬 WhatsApp
                          </a>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-500/80 px-4 py-2 text-sm text-white hover:bg-red-600"
                          >
                            🗑️ Удалить
                          </button>
                        </div>
                      </div>
                    </div>

                    {imageUrl && (
                      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                        <img
                          src={imageUrl}
                          alt={product?.title || "Товар"}
                          className="h-[260px] w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="mt-6 border-t border-white/10 pt-6">
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 items-center">
                        <div>
                          <div className="text-xs uppercase tracking-wider text-[#B8C2CE]">
                            Товар
                          </div>
                          <div className="font-medium text-white">
                            {product?.title || "—"}
                          </div>
                        </div>
                        {product?.brand && (
                          <div>
                            <div className="text-xs uppercase tracking-wider text-[#B8C2CE]">
                              Бренд
                            </div>
                            <div className="text-white">{product.brand}</div>
                          </div>
                        )}
                        {product?.country && (
                          <div>
                            <div className="text-xs uppercase tracking-wider text-[#B8C2CE]">
                              Страна
                            </div>
                            <div className="text-white">{product.country}</div>
                          </div>
                        )}
                        {product?.size && (
                          <div>
                            <div className="text-xs uppercase tracking-wider text-[#B8C2CE]">
                              Размер
                            </div>
                            <div className="text-white">{product.size}</div>
                          </div>
                        )}
                        {product?.material && (
                          <div>
                            <div className="text-xs uppercase tracking-wider text-[#B8C2CE]">
                              Материал
                            </div>
                            <div className="text-white">{product.material}</div>
                          </div>
                        )}
                        {product?.price && (
                          <div>
                            <div className="text-xs uppercase tracking-wider text-[#B8C2CE]">
                              Цена
                            </div>
                            <div className="text-lg font-bold text-[#D6A85F]">
                              {product.price} ₽
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="mb-2 text-xs uppercase tracking-wider text-[#B8C2CE]">
                        Комментарий менеджера
                      </div>
                      <textarea
                        key={`${order.id}-${order.updated}`}
                        placeholder="✏️ Введите заметку по заявке..."
                        defaultValue={order.notes || ""}
                        onBlur={(e) => updateNotes(order.id, e.target.value)}
                        rows={2}
                        className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => fetchOrders()}
            className="rounded-2xl bg-violet-600 px-8 py-4 font-medium text-white transition hover:bg-violet-700"
          >
            Загрузить еще
          </button>
        </div>
      )}

      {filteredOrders.length === 0 && !loading && (
        <div className="py-20 text-center">
          <p className="text-[#B8C2CE]">Заявок не найдено</p>
        </div>
      )}
    </div>
  );
}
