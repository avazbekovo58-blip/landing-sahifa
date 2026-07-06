// API client implementing the contract (root README §3).
//
// Two modes, decided at build time by VITE_API_BASE:
//   - empty  -> DEMO mode: served from local mock data (no backend needed).
//   - set    -> LIVE mode: real fetch() to the n8n webhooks, authenticated with
//               Telegram initData. The UI code is identical in both modes.
import { initData } from './telegram';
import { CATEGORIES, PRODUCTS, ORDERS, ME, SETTINGS } from './mockData';
import type { Category, Product, Order, Me, Settings } from './types';

const BASE = import.meta.env.VITE_API_BASE ?? '';
export const IS_DEMO = BASE === '';

// small delay so skeleton loaders are visible and the demo feels real
const wait = (ms = 220) => new Promise((r) => setTimeout(r, ms));

async function http<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'X-Init-Data': initData(), // server validates HMAC + derives user id
      ...(opts.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export interface ProductQuery {
  category?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  sort?: 'popular' | 'price_asc' | 'price_desc' | 'new';
}

function priceOf(p: Product) {
  return Math.min(...p.variants.map((v) => v.price));
}

// ---- DEMO filtering/sorting mirrors what the server does in LIVE mode ----
function filterProducts(q: ProductQuery): Product[] {
  let list = PRODUCTS.slice();
  if (q.category) list = list.filter((p) => p.category_id === q.category);
  if (q.search) {
    const s = q.search.toLowerCase();
    list = list.filter(
      (p) => p.name.toLowerCase().includes(s) || (p.brand ?? '').toLowerCase().includes(s),
    );
  }
  if (q.min_price != null) list = list.filter((p) => priceOf(p) >= q.min_price!);
  if (q.max_price != null) list = list.filter((p) => priceOf(p) <= q.max_price!);
  switch (q.sort) {
    case 'price_asc': list.sort((a, b) => priceOf(a) - priceOf(b)); break;
    case 'price_desc': list.sort((a, b) => priceOf(b) - priceOf(a)); break;
    case 'new': list.sort((a, b) => b.id - a.id); break;
    default: list.sort((a, b) => b.rating - a.rating); // popular
  }
  return list;
}

export const api = {
  async getSettings(): Promise<Settings> {
    if (IS_DEMO) { await wait(); return SETTINGS; }
    return http('/settings');
  },

  async getCategories(): Promise<Category[]> {
    if (IS_DEMO) { await wait(); return CATEGORIES; }
    return http('/categories');
  },

  async getProducts(q: ProductQuery = {}): Promise<Product[]> {
    if (IS_DEMO) { await wait(); return filterProducts(q); }
    const params = new URLSearchParams();
    Object.entries(q).forEach(([k, v]) => v != null && v !== '' && params.set(k, String(v)));
    return http(`/products?${params.toString()}`);
  },

  async getProduct(id: number): Promise<Product | undefined> {
    if (IS_DEMO) { await wait(); return PRODUCTS.find((p) => p.id === id); }
    return http(`/products/${id}`);
  },

  async getOrders(): Promise<Order[]> {
    if (IS_DEMO) { await wait(); return ORDERS; }
    return http('/orders');
  },

  async getMe(): Promise<Me> {
    if (IS_DEMO) { await wait(); return ME; }
    return http('/me');
  },

  // In LIVE mode the server recomputes the total from DB variant prices —
  // the client-sent items/total are never trusted (root README §4).
  async createOrder(payload: { address: string; phone: string; payment_method: string }): Promise<{ order_id: number; status: string }> {
    if (IS_DEMO) { await wait(400); return { order_id: Math.floor(Math.random() * 9000) + 1000, status: 'new' }; }
    return http('/orders', { method: 'POST', body: JSON.stringify(payload) });
  },
};
