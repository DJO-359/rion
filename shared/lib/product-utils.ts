import type { Product } from "@/shared/types/product";
import pb from "@/shared/lib/pocketbase";

const SQM_CATEGORIES = ["Плитка", "Ламинат", "Ковры"];

export function getProductImageUrl(product: Product, index = 0) {
  if (!product.images?.length) return "/placeholder.svg";
  return pb.files.getURL(product, product.images[index] ?? product.images[0]);
}

export function getPriceUnit(category: string) {
  return SQM_CATEGORIES.includes(category) ? "₽/м²" : "₽";
}

export function formatPrice(price: string | number) {
  const num = Number(String(price).replace(/\s/g, "").replace(",", "."));
  if (Number.isNaN(num)) return String(price);
  return new Intl.NumberFormat("ru-RU").format(num);
}

export function isProductNew(product: Product) {
  const created = new Date(product.created);
  const days = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
  return days <= 30;
}

export function isProductHit(product: Product) {
  return product.status === "hit" || product.status === "Хит";
}

export function getProductBadges(product: Product) {
  const badges: Array<{ label: string; variant: "stock" | "hit" | "new" }> = [];
  if (product.active) badges.push({ label: "В наличии", variant: "stock" });
  if (isProductHit(product)) badges.push({ label: "Хит продаж", variant: "hit" });
  if (isProductNew(product)) badges.push({ label: "Новинка", variant: "new" });
  return badges;
}
