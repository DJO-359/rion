import type { Product } from "@/shared/types/product";

function toNumber(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return 0;
  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
}

export function formatPrice(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return "";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return new Intl.NumberFormat("ru-RU").format(num);
}

/**
 * У товара вообще есть скидочные данные
 * (нужно для скидочного блока)
 */
export function hasProductDiscount(product: Product) {
  return Boolean(product.old_price) && toNumber(product.discount_percent) > 0;
}

/**
 * Скидка активна прямо сейчас
 * - old_price есть
 * - discount_percent > 0
 * - и либо discount_unlimited = true
 * - либо текущая дата попадает в discount_start / discount_end
 */
export function isDiscountActive(product: Product) {
  if (!hasProductDiscount(product)) return false;

  if (product.discount_unlimited) {
    return true;
  }

  if (product.discount_start && product.discount_end) {
    const now = new Date();
    const start = new Date(product.discount_start);
    const end = new Date(product.discount_end);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return false;
    }

    return now >= start && now <= end;
  }

  return false;
}

/**
 * Какой процент показывать на бейдже
 */
export function getDiscountPercentForDisplay(product: Product) {
  return isDiscountActive(product) ? toNumber(product.discount_percent) : 0;
}

/**
 * Основная цена карточки
 * Всегда показываем текущее поле price
 */
export function getDisplayPrice(product: Product) {
  return product.price;
}

/**
 * Старую цену показываем только если скидка активна
 */
export function getOldPriceForDisplay(product: Product) {
  return isDiscountActive(product) ? product.old_price || null : null;
}
