"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { supabase } from "@/shared/lib/supabase";
import { LeadModal } from "@/components/ui/modals/lead-modal";
import type { Product } from "@/shared/types/product";

const categoryMap: Record<string, string> = {
  plitka: "Плитка",
  laminat: "Ламинат",
  santehnika: "Сантехника",
  smesiteli: "Смесители",
  lyustry: "Люстры",
  kovry: "Ковры",
};

export default function CategoryPage() {
  const params = useParams();

  const slug = params.category as string;

  const category = categoryMap[slug];

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .eq("active", true)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(error);
        return;
      }

      setProducts(data || []);
    };

    fetchProducts();
  }, [category]);

  return (
    <section className="min-h-screen bg-zinc-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14">
          <h1 className="text-5xl font-bold">{category}</h1>

          <p className="mt-3 text-zinc-400">
            Найдено товаров: {products.length}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-3xl bg-zinc-900"
            >
              <img
                src={product.image}
                alt={product.title}
                className="h-72 w-full object-cover"
              />

              <div className="p-6">
                <h2 className="text-2xl font-semibold">{product.title}</h2>

                <p className="mt-3 text-3xl font-bold text-violet-400">
                  {product.price} ₽
                </p>

                {product.brand && (
                  <p className="mt-2 text-zinc-400">Бренд: {product.brand}</p>
                )}

                {product.country && (
                  <p className="text-zinc-400">Страна: {product.country}</p>
                )}

                {product.material && (
                  <p className="text-zinc-400">Материал: {product.material}</p>
                )}

                <button
                  onClick={() => setSelectedProduct(product)}
                  className="mt-6 w-full rounded-2xl bg-violet-600 py-4 text-lg font-medium transition hover:bg-violet-700"
                >
                  Узнать наличие
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="mt-20 text-center text-zinc-500">
            Товары не найдены
          </div>
        )}
      </div>

      {selectedProduct && (
        <LeadModal
          productTitle={selectedProduct.title}
          productId={selectedProduct.id}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
