"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { supabase } from "@/shared/lib/supabase";

import { LeadModal } from "@/components/ui/modals/lead-modal";

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
};

export default function ProductDetailsPage() {
  const params = useParams();

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setProduct(data);

    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  if (loading) {
    return <div className="p-10 text-white">Загрузка...</div>;
  }

  if (!product) {
    return <div className="p-10 text-white">Товар не найден</div>;
  }

  return (
    <div className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2">
        {/* IMAGE */}
        <div className="overflow-hidden rounded-3xl border border-zinc-800">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* INFO */}
        <div>
          <h1 className="text-5xl font-bold">{product.title}</h1>

          <p className="mt-5 text-3xl text-violet-400">{product.price} ₽</p>

          <p className="mt-3 text-zinc-500">Категория: {product.category}</p>

          <button
            onClick={() => setOpenModal(true)}
            className="mt-10 rounded-2xl bg-violet-600 px-8 py-5 text-xl font-medium transition hover:bg-violet-700"
          >
            Узнать наличие
          </button>
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <LeadModal
          productTitle={product.title}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
}
