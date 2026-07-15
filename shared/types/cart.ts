import type { Product } from "@/shared/types/product";

export type StoredCartItem = {
  productId: string;
  quantity: number;
  priceAtAdd?: string;
};

export type CartContactMethod = "whatsapp" | "telegram" | "phone";

export type CartLeadItem = {
  productId: string;
  title: string;
  quantity: number;
  price: string;
};

export type CartLeadPayload = {
  type: "cart";
  contactMethod: CartContactMethod;
  items: CartLeadItem[];
  totalPrice: number;
};

export type ResolvedCartItem = {
  productId: string;
  quantity: number;
  product: Product | null;
  unavailable: boolean;
};
