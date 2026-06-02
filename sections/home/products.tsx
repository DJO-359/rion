"use client";
import { LeadModal } from "@/components/ui/modals/lead-modal";
import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase";
import type { Product } from "@/shared/types/product";
import { ShoppingBag, Truck, MapPin, Shield, Headset } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

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
        <div className="relative z-10 mt-16 hidden xl:block">
          <div
            className="
              relative
              overflow-hidden
              rounded-[36px]
              border
              border-[#f6c15c]
              bg-[linear-gradient(180deg,#d5963a_0%,#9d6320_45%,#5d3814_100%)]
              shadow-[0_0_0_2px_rgba(255,215,120,0.45),0_25px_60px_rgba(201,139,52,0.5)]
            "
          >
            {/* INNER BORDER */}
            <div className="absolute inset-[3px] rounded-[32px] border border-[#ffd27b]/50" />

            <div className="relative grid grid-cols-5">
              {[
                {
                  icon: ShoppingBag,
                  title: "5000+",
                  text: "товаров в наличии",
                  large: true,
                },
                {
                  icon: Truck,
                  title: "10+",
                  text: "Ежедневные поставки",
                },
                {
                  icon: MapPin,
                  title: "Работаем",
                  text: "по всему Северному Кавказу",
                },
                {
                  icon: Shield,
                  title: "Гарантия качества",
                  text: "на всю продукцию",
                },
                {
                  icon: Headset,
                  title: "Поддержка",
                  text: "Поможем с выбором",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="
                    relative
                    flex
                    flex-col
                    items-center
                    justify-center
                    px-6
                    py-8
                    text-center
                  "
                >
                  {/* glowing divider */}
                  {index !== 0 && (
                    <>
                      <div
                        className="
                          absolute
                          left-0
                          top-1/2
                          h-[72%]
                          w-px
                          -translate-y-1/2
                          bg-[#ffd06a]
                          opacity-70
                        "
                      />

                      <div
                        className="
                          absolute
                          left-0
                          top-1/2
                          h-[72%]
                          w-[3px]
                          -translate-y-1/2
                          bg-[#ffd06a]/30
                          blur-sm
                        "
                      />
                    </>
                  )}

                  <div
                    className="
                      mb-4
                      rounded-full
                      text-[#ffd06a]
                      drop-shadow-[0_0_12px_rgba(255,208,106,0.95)]
                    "
                  >
                    <item.icon size={58} strokeWidth={1.8} />
                  </div>

                  {item.large ? (
                    <>
                      <div
                        className="
                          text-[34px]
                          font-bold
                          leading-none
                          text-white
                          drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]
                        "
                      >
                        {item.title}
                      </div>

                      <div
                        className="
                          mt-4
                          text-[17px]
                          font-medium
                          text-white
                        "
                      >
                        {item.text}
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="
                          text-[28px]
                          font-bold
                          text-white
                          drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]
                        "
                      >
                        {item.title}
                      </div>

                      <div
                        className="
                          mt-3
                          text-[17px]
                          leading-relaxed
                          text-white
                          max-w-[220px]
                        "
                      >
                        {item.text}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

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
                  className="mt-5 w-full rounded-2xl bg-[#C89B5E] py-3 font-medium text-black transition hover:opacity-90"
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
