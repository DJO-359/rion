"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/shared/lib/supabase";
import { LeadModal } from "@/components/ui/modals/lead-modal";
import type { Product } from "@/shared/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
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

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <h1 className="mb-10 text-4xl font-bold">Каталог товаров</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900"
          >
            <div className="h-[260px] overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-5">
              <h2 className="text-2xl font-semibold">{product.title}</h2>

              <p className="mt-2 text-violet-400">{product.price} ₽</p>

              <p className="mt-1 text-zinc-500">{product.category}</p>
              <div className="mt-4 space-y-1 text-sm text-zinc-400">
                {product.brand && <p>Бренд: {product.brand}</p>}

                {product.country && <p>Страна: {product.country}</p>}

                {product.size && <p>Размер: {product.size}</p>}

                {product.material && <p>Материал: {product.material}</p>}
              </div>

              <div className="mt-5 flex gap-3">
                <Link
                  href={`/products/${product.id}`}
                  className="flex-1 rounded-2xl bg-zinc-800 py-3 text-center transition hover:bg-zinc-700"
                >
                  Подробнее
                </Link>

                <button
                  onClick={() => setSelectedProduct(product)}
                  className="flex-1 rounded-2xl bg-violet-600 py-3 transition hover:bg-violet-700"
                >
                  Узнать наличие
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <LeadModal
          productTitle={selectedProduct.title}
          productId={selectedProduct.id}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
