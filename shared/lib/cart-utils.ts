import type { Product } from "@/shared/types/product";
import type { CartLeadItem, ResolvedCartItem, StoredCartItem } from "@/shared/types/cart";
import { getDisplayPrice } from "@/shared/lib/product-pricing";

export const CART_STORAGE_KEY = "rion-cart";

export const STORE_PHONE = "+79637048177";
export const STORE_PHONE_DISPLAY = "+7 (963) 704-81-77";

export function parseProductPrice(price: string | number | undefined): number {
  if (price === undefined || price === null || price === "") return 0;
  const num = Number(String(price).replace(/\s/g, "").replace(",", "."));
  return Number.isNaN(num) ? 0 : num;
}

export function getStoredItemsCount(items: StoredCartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getResolvedItemsTotal(resolved: ResolvedCartItem[]): number {
  return resolved.reduce((sum, item) => {
    if (item.unavailable || !item.product) return sum;
    return sum + parseProductPrice(getDisplayPrice(item.product)) * item.quantity;
  }, 0);
}

export function buildProductsFilter(productIds: string[]): string {
  if (!productIds.length) return "";
  return productIds.map((id) => `id="${id}"`).join(" || ");
}

export function resolveCartItems(
  stored: StoredCartItem[],
  products: Product[],
): ResolvedCartItem[] {
  const productMap = new Map(products.map((p) => [p.id, p]));

  return stored.map((item) => {
    const product = productMap.get(item.productId) ?? null;
    const unavailable = !product || !product.active;
    return {
      productId: item.productId,
      quantity: item.quantity,
      product,
      unavailable,
    };
  });
}

export function toCartLeadItems(resolved: ResolvedCartItem[]): CartLeadItem[] {
  return resolved
    .filter((item) => item.product && !item.unavailable)
    .map((item) => ({
      productId: item.productId,
      title: item.product!.title,
      quantity: item.quantity,
      price: getDisplayPrice(item.product!),
    }));
}

export function formatItemsCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${count} товаров`;
  if (mod10 === 1) return `${count} товар`;
  if (mod10 >= 2 && mod10 <= 4) return `${count} товара`;
  return `${count} товаров`;
}

export function buildCartContactMessage(
  items: CartLeadItem[],
  totalPrice: number,
): string {
  const lines = items.map(
    (item) =>
      `• ${item.title} — ${item.quantity} шт. × ${item.price} ₽`,
  );
  return [
    "Здравствуйте! Хочу оформить заказ:",
    "",
    ...lines,
    "",
    `Итого: ${new Intl.NumberFormat("ru-RU").format(totalPrice)} ₽`,
  ].join("\n");
}

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/79637048177?text=${encodeURIComponent(message)}`;
}

export function getTelegramUrl(message: string): string {
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
  if (botUsername) {
    return `https://t.me/${botUsername}?text=${encodeURIComponent(message)}`;
  }
  return `https://t.me/share/url?text=${encodeURIComponent(message)}`;
}

export function getPhoneUrl(): string {
  return `tel:${STORE_PHONE}`;
}
