// Client-side cart + favorites store (React context).
// In the demo the cart lives here + localStorage; in LIVE mode the same actions
// would mirror to POST/DELETE /cart. Prices shown are always DB/variant prices.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartLine, Product, Variant } from './types';
import { haptic } from './telegram';

interface StoreCtx {
  items: CartLine[];
  count: number;
  total: number;
  favorites: number[];
  add: (product: Product, variant: Variant, qty?: number) => void;
  setQty: (variantId: number, qty: number) => void;
  remove: (variantId: number) => void;
  clear: () => void;
  toggleFav: (productId: number) => void;
  isFav: (productId: number) => boolean;
}

const Ctx = createContext<StoreCtx | null>(null);

const CART_KEY = 'yosin.cart';
const FAV_KEY = 'yosin.fav';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(() => load<CartLine[]>(CART_KEY, []));
  const [favorites, setFavorites] = useState<number[]>(() => load<number[]>(FAV_KEY, []));

  useEffect(() => localStorage.setItem(CART_KEY, JSON.stringify(items)), [items]);
  useEffect(() => localStorage.setItem(FAV_KEY, JSON.stringify(favorites)), [favorites]);

  function add(product: Product, variant: Variant, qty = 1) {
    haptic('medium');
    setItems((prev) => {
      const existing = prev.find((i) => i.variant_id === variant.id);
      if (existing) {
        return prev.map((i) =>
          i.variant_id === variant.id ? { ...i, quantity: i.quantity + qty } : i,
        );
      }
      const line: CartLine = {
        variant_id: variant.id,
        product_id: product.id,
        product_name: product.name,
        variant_name: variant.name,
        image: product.images[0],
        price: variant.price,
        quantity: qty,
      };
      return [...prev, line];
    });
  }

  function setQty(variantId: number, qty: number) {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.variant_id !== variantId)
        : prev.map((i) => (i.variant_id === variantId ? { ...i, quantity: qty } : i)),
    );
  }

  const remove = (variantId: number) =>
    setItems((prev) => prev.filter((i) => i.variant_id !== variantId));
  const clear = () => setItems([]);

  function toggleFav(productId: number) {
    haptic('light');
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  }
  const isFav = (productId: number) => favorites.includes(productId);

  const { count, total } = useMemo(
    () => ({
      count: items.reduce((n, i) => n + i.quantity, 0),
      total: items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    [items],
  );

  const value: StoreCtx = {
    items, count, total, favorites, add, setQty, remove, clear, toggleFav, isFav,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
