"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import pb from "@/shared/lib/pocketbase";
import { LeadModal } from "@/components/ui/modals/lead-modal";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductGridSkeleton } from "@/components/storefront/product-card-skeleton";
import { Container } from "@/components/layout/container";
import type { Product } from "@/shared/types/product";
import { CATEGORIES } from "@/shared/lib/catalog";

function ProductsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    pb.collection("products")
      .getFullList<Product>({ filter: "active = true", sort: "-created" })
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchQuery =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);
      const matchCat = !activeCategory || p.category === activeCategory;
      return matchQuery && matchCat;
    });
  }, [products, query, activeCategory]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">Каталог товаров</h1>
        <p className="mt-2 text-[var(--muted)]">
          {loading ? "Загрузка..." : `Найдено: ${filtered.length} позиций`}
          {query && ` по запросу «${query}»`}
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={`rounded-full px-4 py-2 text-sm ${
            !activeCategory
              ? "bg-[#C89B5E] text-black"
              : "border border-white/10 bg-white/5"
          }`}
        >
          Все
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setActiveCategory(cat.title)}
            className={`rounded-full px-4 py-2 text-sm ${
              activeCategory === cat.title
                ? "bg-[#C89B5E] text-black"
                : "border border-white/10 bg-white/5"
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {loading ? (
        <ProductGridSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <div className="card-storefront py-20 text-center">
          <p className="text-lg text-[var(--muted)]">Товары не найдены</p>
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className="btn-secondary mt-4"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onLeadClick={setSelectedProduct}
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <LeadModal
          productTitle={selectedProduct.title}
          productId={selectedProduct.id}
          productPrice={selectedProduct.price}
          productCategory={selectedProduct.category}
          productRecord={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}

export default function ProductsPage() {
  return (
    <div className="py-10">
      <Container>
        <Suspense fallback={<ProductGridSkeleton count={6} />}>
          <ProductsContent />
        </Suspense>
      </Container>
    </div>
  );
}
