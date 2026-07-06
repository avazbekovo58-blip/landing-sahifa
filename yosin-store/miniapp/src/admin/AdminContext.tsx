// Admin state for the demo. Holds editable copies of the catalog, orders,
// questions and settings, mutated locally. In LIVE mode each mutator maps to an
// /admin/* API call (see root README §3) — the components stay identical.
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Category, Order, OrderStatus, Product, Settings } from '../lib/types';
import { PRODUCTS, CATEGORIES, ORDERS, SETTINGS } from '../lib/mockData';
import { QUESTIONS, STATS, type AdminQuestion, type Stats } from '../lib/adminData';

export type AdminProduct = Product & { is_active: boolean };

const AUTH_KEY = 'yosin.admin.auth';
// Demo gate only. Real auth is server-side (login/password or Telegram allowlist)
// and every /admin endpoint is protected — a client flag never grants access.
const DEMO_PASSWORD = 'demo';

interface AdminCtx {
  authed: boolean;
  login: (password: string) => boolean;
  logout: () => void;

  products: AdminProduct[];
  categories: Category[];
  orders: Order[];
  questions: AdminQuestion[];
  settings: Settings;
  stats: Stats;

  saveProduct: (p: AdminProduct) => void;
  deleteProduct: (id: number) => void;
  toggleActive: (id: number) => void;
  setOrderStatus: (id: number, status: OrderStatus) => void;
  answerQuestion: (id: number, answer: string) => void;
  updateSettings: (s: Settings) => void;
}

const Ctx = createContext<AdminCtx | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1');
  const [products, setProducts] = useState<AdminProduct[]>(() =>
    PRODUCTS.map((p) => ({ ...p, is_active: true })),
  );
  const [orders, setOrders] = useState<Order[]>(() => ORDERS.map((o) => ({ ...o })));
  const [questions, setQuestions] = useState<AdminQuestion[]>(() => QUESTIONS.map((q) => ({ ...q })));
  const [settings, setSettings] = useState<Settings>({ ...SETTINGS });

  function login(password: string) {
    const ok = password === DEMO_PASSWORD;
    if (ok) {
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    }
    return ok;
  }
  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  }

  function saveProduct(p: AdminProduct) {
    setProducts((prev) => {
      const exists = prev.some((x) => x.id === p.id);
      return exists ? prev.map((x) => (x.id === p.id ? p : x)) : [{ ...p, id: nextId(prev) }, ...prev];
    });
  }
  const deleteProduct = (id: number) => setProducts((prev) => prev.filter((p) => p.id !== id));
  const toggleActive = (id: number) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p)));

  const setOrderStatus = (id: number, status: OrderStatus) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

  const answerQuestion = (id: number, answer: string) =>
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, answer, status: 'answered' } : q)));

  const updateSettings = (s: Settings) => setSettings(s);

  const value = useMemo<AdminCtx>(
    () => ({
      authed, login, logout,
      products, categories: CATEGORIES, orders, questions, settings, stats: STATS,
      saveProduct, deleteProduct, toggleActive, setOrderStatus, answerQuestion, updateSettings,
    }),
    [authed, products, orders, questions, settings],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function nextId(list: { id: number }[]) {
  return list.reduce((m, x) => Math.max(m, x.id), 0) + 1;
}

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
