"use client";



import Link from "next/link";

import { motion } from "framer-motion";

import { Heart } from "lucide-react";

import type { Product } from "@/shared/types/product";

import {

  formatPrice,

  getPriceUnit,

  getProductBadges,

  getProductImageUrl,

} from "@/shared/lib/product-utils";



type Props = {

  product: Product;

  index?: number;

  onLeadClick?: (product: Product) => void;

};



const badgeStyles = {

  stock: "bg-emerald-500 text-white",

  hit: "bg-[var(--primary)] text-white",

  new: "bg-blue-500 text-white",

};



export function ProductCard({ product, index = 0, onLeadClick }: Props) {

  const badges = getProductBadges(product);

  const imageUrl = getProductImageUrl(product);

  const stockBadge = badges.find((b) => b.variant === "stock");



  return (

    <motion.article

      initial={{ opacity: 0, y: 20 }}

      whileInView={{ opacity: 1, y: 0 }}

      viewport={{ once: true, margin: "-40px" }}

      transition={{ duration: 0.45, delay: index * 0.06 }}

      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"

    >

      <div className="relative aspect-square overflow-hidden bg-[#f4f6f9]">

        <Link href={`/products/${product.id}`} className="block h-full w-full">

          <img

            src={imageUrl}

            alt={product.title}

            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"

            loading="lazy"

          />

        </Link>

        {stockBadge && (

          <span

            className={`absolute left-3 top-3 rounded-lg px-2 py-1 text-[11px] font-semibold ${badgeStyles.stock}`}

          >

            в наличии

          </span>

        )}

        <button

          type="button"

          aria-label="В избранное"

          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-sm transition hover:text-red-500"

          onClick={(e) => e.preventDefault()}

        >

          <Heart size={16} />

        </button>

      </div>



      <div className="flex flex-1 flex-col p-4">

        <Link href={`/products/${product.id}`}>

          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-slate-800 transition-colors group-hover:text-[var(--primary)]">

            {product.title}

          </h3>

        </Link>

        <div className="mt-auto pt-3">

          <div className="flex items-baseline gap-1.5">

            <span className="text-lg font-bold text-slate-900">

              {formatPrice(product.price)}

            </span>

            <span className="text-xs text-[var(--muted-foreground)]">

              {getPriceUnit(product.category)}

            </span>

          </div>

          <button

            type="button"

            onClick={() => onLeadClick?.(product)}

            className="btn-secondary mt-3 w-full py-2.5 text-sm"

          >

            Узнать наличие

          </button>

        </div>

      </div>

    </motion.article>

  );

}

