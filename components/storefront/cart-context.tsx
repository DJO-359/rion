"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import pb from "@/shared/lib/pocketbase";
import type { Product } from "@/shared/types/product";
import type { ResolvedCartItem, StoredCartItem } from "@/shared/types/cart";
import {
  CART_STORAGE_KEY,
  getResolvedItemsTotal,
  getStoredItemsCount,
  resolveCartItems,
} from "@/shared/lib/cart-utils";
import { getDisplayPrice } from "@/shared/lib/product-pricing";

type CartContextValue = {
  items: StoredCartItem[];
  resolvedItems: ResolvedCartItem[];
  isLoading: boolean;
  fetchError: string | null;
  isSheetOpen: boolean;
  isCheckoutOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemsCount: () => number;
  openSheet: () => void;
  closeSheet: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  refreshProducts: () => Promise<void>;
  removeUnavailableItems: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): StoredCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredCartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.productId === "string" &&
        typeof item.quantity === "number" &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

function writeStorage(items: StoredCartItem[]) {
  if (typeof window === "undefined") return;
  try {
    if (items.length === 0) {
      localStorage.removeItem(CART_STORAGE_KEY);
    } else {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  } catch {
    // ignore quota / private mode errors
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<StoredCartItem[]>([]);
  const [resolvedItems, setResolvedItems] = useState<ResolvedCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const fetchSeq = useRef(0);

  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(items);
  }, [items, hydrated]);

  const refreshProducts = useCallback(async () => {
    if (!items.length) {
      setResolvedItems([]);
      setFetchError(null);
      return;
    }

    const seq = ++fetchSeq.current;
    setIsLoading(true);
    setFetchError(null);

    try {
      const productIds = [...new Set(items.map((i) => i.productId))];
      const filter = productIds.map((id) => `id="${id}"`).join(" || ");
      const products = await pb.collection("products").getFullList<Product>({
        filter,
      });

      if (seq !== fetchSeq.current) return;

      setResolvedItems(resolveCartItems(items, products));
    } catch {
      if (seq !== fetchSeq.current) return;
      setFetchError("Не удалось загрузить товары. Проверьте подключение к интернету.");
      setResolvedItems(
        items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          product: null,
          unavailable: true,
        })),
      );
    } finally {
      if (seq === fetchSeq.current) {
        setIsLoading(false);
      }
    }
  }, [items]);

  useEffect(() => {
    if (!hydrated || !items.length) {
      setResolvedItems([]);
      return;
    }
    void refreshProducts();
  }, [hydrated, items, refreshProducts]);

  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          quantity: 1,
          priceAtAdd: getDisplayPrice(product),
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const increaseQuantity = useCallback((productId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    );
  }, []);

  const decreaseQuantity = useCallback((productId: string) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setResolvedItems([]);
    setFetchError(null);
    writeStorage([]);
  }, []);

  const removeUnavailableItems = useCallback(() => {
    setItems((prev) => {
      const unavailableIds = new Set(
        resolvedItems.filter((i) => i.unavailable).map((i) => i.productId),
      );
      return prev.filter((i) => !unavailableIds.has(i.productId));
    });
  }, [resolvedItems]);

  const getItemsCount = useCallback(
    () => getStoredItemsCount(items),
    [items],
  );

  const getTotalPrice = useCallback(
    () => getResolvedItemsTotal(resolvedItems),
    [resolvedItems],
  );

  const openSheet = useCallback(() => {
    setIsSheetOpen(true);
    void refreshProducts();
  }, [refreshProducts]);

  const closeSheet = useCallback(() => setIsSheetOpen(false), []);
  const openCheckout = useCallback(() => setIsCheckoutOpen(true), []);
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

  const value = useMemo(
    () => ({
      items,
      resolvedItems,
      isLoading,
      fetchError,
      isSheetOpen,
      isCheckoutOpen,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      getTotalPrice,
      getItemsCount,
      openSheet,
      closeSheet,
      openCheckout,
      closeCheckout,
      refreshProducts,
      removeUnavailableItems,
    }),
    [
      items,
      resolvedItems,
      isLoading,
      fetchError,
      isSheetOpen,
      isCheckoutOpen,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      getTotalPrice,
      getItemsCount,
      openSheet,
      closeSheet,
      openCheckout,
      closeCheckout,
      refreshProducts,
      removeUnavailableItems,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
