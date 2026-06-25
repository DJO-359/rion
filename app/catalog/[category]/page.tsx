"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import pb from "@/shared/lib/pocketbase";
import type { Product } from "@/shared/types/product";
import { CATEGORY_MAP } from "@/shared/lib/catalog";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductGridSkeleton } from "@/components/storefront/product-card-skeleton";
import { LeadModal } from "@/components/ui/modals/lead-modal";
import { Container } from "@/components/layout/container";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.category as string;
  const category = CATEGORY_MAP[slug];
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    pb.collection("products")
      .getFullList<Product>({
        filter: `category="${category}" && active=true`,
        sort: "-created",
      })
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  if (!category) {
    return (
      <Container>
        <div className="py-20 text-center">Категория не найдена</div>
      </Container>
    );
  }

  return (
    <div className="py-10">
      <Container>
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
          <Link href="/" className="hover:text-[#D6A85F]">
            Главная
          </Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-[#D6A85F]">
            Каталог
          </Link>
          <ChevronRight size={14} />
          <span className="text-white">{category}</span>
        </nav>

        <h1 className="text-3xl font-bold md:text-4xl">{category}</h1>
        <p className="mt-2 text-[var(--muted)]">
          {loading ? "..." : `${products.length} товаров`}
        </p>

        <div className="mt-8">
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : products.length === 0 ? (
            <div className="card-storefront py-20 text-center text-[var(--muted)]">
              В этой категории пока нет товаров
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onLeadClick={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </div>
      </Container>

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
    </div>
  );
}
