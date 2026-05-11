"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  // const [activeCategory, setActiveCategory] = useState("Популярное");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Ошибка загрузки товаров:", error);
      } else {
        console.log("✅ Загружено товаров:", data?.length || 0, data);
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-xl">Загрузка товаров...</div>;
  }

  return (
    <section className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Наши товары</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-zinc-900 rounded-3xl overflow-hidden group"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-3xl font-bold text-violet-400 mt-3">
                  {product.price} ₽
                </p>
                <p className="text-sm text-zinc-500 mt-1">{product.category}</p>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-center text-zinc-500 text-2xl py-12">
            Пока нет добавленных товаров
          </p>
        )}
      </div>
    </section>
  );
}
