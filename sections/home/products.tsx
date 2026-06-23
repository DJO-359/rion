"use client";



import { useEffect, useState } from "react";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import pb from "@/shared/lib/pocketbase";

import type { Product } from "@/shared/types/product";

import { LeadModal } from "@/components/ui/modals/lead-modal";

import { ProductCard } from "@/components/storefront/product-card";

import { ProductGridSkeleton } from "@/components/storefront/product-card-skeleton";

import { Container } from "@/components/layout/container";



export default function Products() {

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);



  useEffect(() => {

    pb.collection("products")

      .getFullList<Product>({ filter: "active = true", sort: "-created" })

      .then((data) => setProducts(data.slice(0, 5)))

      .catch(console.error)

      .finally(() => setLoading(false));

  }, []);



  return (

    <section className="bg-[#f8fafc] py-14 md:py-16">

      <Container>

        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">

            Популярные товары

          </h2>

          <Link

            href="/products"

            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:underline"

          >

            Смотреть все <ArrowRight size={16} />

          </Link>

        </div>



        {loading ? (

          <ProductGridSkeleton count={5} />

        ) : products.length === 0 ? (

          <div className="card-storefront py-16 text-center text-[var(--muted)]">

            Скоро добавим товары в каталог

          </div>

        ) : (

          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

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

      </Container>



      {selectedProduct && (

        <LeadModal

          productTitle={selectedProduct.title}

          productId={selectedProduct.id}

          productPrice={selectedProduct.price}

          productCategory={selectedProduct.category}

          productImage={selectedProduct.images?.[0]}

          productRecord={selectedProduct}

          onClose={() => setSelectedProduct(null)}

        />

      )}

    </section>

  );

}

