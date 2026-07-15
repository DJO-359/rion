"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  CheckCircle2,
  Truck,
  Shield,
  Phone,
  ZoomIn,
  ShoppingCart,
} from "lucide-react";
import pb from "@/shared/lib/pocketbase";
import { LeadModal } from "@/components/ui/modals/lead-modal";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductGridSkeleton } from "@/components/storefront/product-card-skeleton";
import { Container } from "@/components/layout/container";
import { useCart } from "@/components/storefront/cart-context";
import { toast } from "sonner";
import type { Product } from "@/shared/types/product";
import {
  formatPrice,
  getPriceUnit,
  getProductBadges,
  getProductImageUrl,
} from "@/shared/lib/product-utils";

export default function ProductDetailsPage() {
  const params = useParams();
  const { addToCart, getItemsCount } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    setLoading(true);
    setCurrentImageIndex(0);

    pb.collection("products")
      .getOne<Product>(id)
      .then(async (data) => {
        setProduct(data);
        const related = await pb.collection("products").getFullList<Product>({
          filter: `category="${data.category}" && active=true && id != "${id}"`,
          sort: "-created",
        });
        setSimilar(related.slice(0, 3));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <Container>
        <div className="py-10">
          <ProductGridSkeleton count={1} />
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold">Товар не найден</h1>
          <Link href="/products" className="btn-primary mt-6 inline-flex">
            В каталог
          </Link>
        </div>
      </Container>
    );
  }

  const images = product.images ?? [];
  const mainImage = images.length
    ? getProductImageUrl(product, currentImageIndex)
    : "/placeholder.svg";
  const badges = getProductBadges(product);

  const specs = [
    { label: "Категория", value: product.category },
    { label: "Бренд", value: product.brand },
    { label: "Страна", value: product.country },
    { label: "Размер", value: product.size },
    { label: "Материал", value: product.material },
  ].filter((s) => s.value);

  const hasCartItems = getItemsCount() > 0;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Товар добавлен в корзину");
  };

  return (
    <>
      <Container>
        <nav className="flex flex-wrap items-center gap-2 py-6 text-sm text-[var(--muted)]">
          <Link href="/" className="hover:text-[#D6A85F]">
            Главная
          </Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-[#D6A85F]">
            Каталог
          </Link>
          <ChevronRight size={14} />
          <span>{product.category}</span>
          <ChevronRight size={14} />
          <span className="line-clamp-1 text-white">{product.title}</span>
        </nav>

        <div className="grid gap-10 pb-24 lg:grid-cols-2 lg:gap-14">
          {/* Gallery */}
          <div>
            <div
              className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#141f33] ${
                zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
              onClick={() => setZoomed(!zoomed)}
            >
              <img
                src={mainImage}
                alt={product.title}
                className={`aspect-square w-full object-cover transition-transform duration-300 ${
                  zoomed ? "scale-150" : "hover:scale-[1.02]"
                }`}
              />
              <button
                type="button"
                className="absolute right-4 top-4 rounded-full bg-black/50 p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomed(!zoomed);
                }}
              >
                <ZoomIn size={18} />
              </button>
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((p) =>
                        p === 0 ? images.length - 1 : p - 1,
                      );
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((p) => (p + 1) % images.length);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2"
                  >
                    ▶
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${
                      idx === currentImageIndex
                        ? "border-[#C89B5E]"
                        : "border-transparent opacity-70"
                    }`}
                  >
                    <img
                      src={getProductImageUrl(product, idx)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={b.label}
                  className="rounded-md bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400"
                >
                  {b.label}
                </span>
              ))}
            </div>

            {product.brand && (
              <p className="mt-4 text-sm uppercase tracking-widest text-[var(--muted)]">
                {product.brand}
              </p>
            )}

            <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
              {product.title}
            </h1>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-bold text-[#D6A85F]">
                {formatPrice(product.price)}
              </span>
              <span className="text-lg text-[var(--muted)]">
                {getPriceUnit(product.category)}
              </span>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              {[
                { icon: CheckCircle2, text: "В наличии на складе" },
                { icon: Truck, text: "Доставка по СКФО от 1 дня" },
                { icon: Shield, text: "Гарантия производителя" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 text-sm text-[var(--muted)]"
                >
                  <item.icon size={18} className="shrink-0 text-emerald-400" />
                  {item.text}
                </div>
              ))}
            </div>

            {product.description && (
              <p className="mt-6 leading-relaxed text-[var(--muted)]">
                {product.description}
              </p>
            )}

            <div className="mt-8 hidden gap-3 lg:flex">
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-primary flex flex-1 items-center justify-center gap-2 py-4 text-base"
              >
                <ShoppingCart size={18} />В корзину
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalProduct(product);
                  setOpenModal(true);
                }}
                className="btn-secondary flex-1 py-4 text-base bg-red-500"
              >
                Узнать наличие и цену
              </button>
              <a href="tel:+79637048177" className="btn-secondary px-6 ">
                <Phone size={18} />
              </a>
              <a
                href={`https://wa.me/79637048177?text=${encodeURIComponent(`Здравствуйте! Интересует: ${product.title}`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary px-6"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {specs.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-bold">Характеристики</h2>
            <div className="card-storefront overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {specs.map((spec, i) => (
                    <tr
                      key={spec.label}
                      className={i % 2 === 0 ? "bg-white/[0.02]" : ""}
                    >
                      <td className="px-6 py-4 text-[var(--muted)]">
                        {spec.label}
                      </td>
                      <td className="px-6 py-4 font-medium">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {similar.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-bold">Похожие товары</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {similar.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={i}
                  onLeadClick={(p) => {
                    setModalProduct(p);
                    setOpenModal(true);
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </Container>

      {/* Sticky mobile CTA */}
      <div
        className={`fixed inset-x-0 z-40 border-t border-white/10 bg-[#07111f]/95 p-4 backdrop-blur-lg lg:hidden ${
          hasCartItems ? "bottom-16" : "bottom-0"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs text-[var(--muted)]">
              {product.title}
            </div>
            <div className="text-xl font-bold text-[#D6A85F]">
              {formatPrice(product.price)} {getPriceUnit(product.category)}
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-primary flex shrink-0 items-center gap-1.5 px-4 py-3"
          >
            <ShoppingCart size={16} />В корзину
          </button>
          <button
            type="button"
            onClick={() => {
              setModalProduct(product);
              setOpenModal(true);
            }}
            className="btn-secondary shrink-0 px-4 py-3 text-sm"
          >
            Заявка
          </button>
        </div>
      </div>

      {openModal && modalProduct && (
        <LeadModal
          productTitle={modalProduct.title}
          productId={modalProduct.id}
          productPrice={modalProduct.price}
          productCategory={modalProduct.category}
          productRecord={modalProduct}
          onClose={() => {
            setOpenModal(false);
            setModalProduct(null);
          }}
        />
      )}
    </>
  );
}
