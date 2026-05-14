"use client";
import { LeadModal } from "@/components/ui/modals/lead-modal";
import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase";
type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  active: boolean;

  brand?: string;
  country?: string;
  size?: string;
  material?: string;
  description?: string;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  // const [activeCategory, setActiveCategory] = useState("Популярное");

  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
                {/* CATEGORY + BRAND */}
                <p className="text-sm text-zinc-500">
                  {product.category}
                  {product.brand && ` | ${product.brand}`}
                </p>

                {/* TITLE */}
                <h3 className="mt-2 text-xl font-semibold leading-snug">
                  {product.title}
                </h3>

                {/* SIZE */}
                {product.size && (
                  <p className="mt-2 text-sm text-zinc-500">{product.size}</p>
                )}

                {/* PRICE */}
                <p className="mt-4 text-3xl font-bold text-violet-400">
                  {product.price} ₽/м²
                </p>

                {/* BUTTON */}
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="mt-5 w-full rounded-2xl bg-[#D6A85F] py-3 font-medium text-black transition hover:opacity-90"
                >
                  Узнать наличие
                </button>
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
