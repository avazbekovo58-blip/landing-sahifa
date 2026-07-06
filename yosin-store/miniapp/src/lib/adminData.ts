// Admin-side demo data. Mirrors the /admin API contract (root README §3).
// In LIVE mode these are replaced by GET /admin/stats, /admin/questions, etc.
import type { OrderStatus } from './types';

export interface Stats {
  sales_today: number;
  sales_week: number;
  sales_month: number;
  orders_new: number;
  orders_total: number;
  customers: number;
}

export const STATS: Stats = {
  sales_today: 1_247_000,
  sales_week: 8_930_000,
  sales_month: 34_120_000,
  orders_new: 3,
  orders_total: 128,
  customers: 412,
};

// Simple 7-day sales series for the dashboard mini-chart (so'm).
export const SALES_7D: { day: string; value: number }[] = [
  { day: 'Du', value: 1_100_000 },
  { day: 'Se', value: 1_640_000 },
  { day: 'Ch', value: 980_000 },
  { day: 'Pa', value: 2_050_000 },
  { day: 'Ju', value: 1_720_000 },
  { day: 'Sh', value: 2_480_000 },
  { day: 'Ya', value: 1_247_000 },
];

export interface AdminQuestion {
  id: number;
  user_id: number;
  user_name: string;
  question: string;
  status: 'open' | 'answered';
  answer?: string;
  created_at: string;
}

export const QUESTIONS: AdminQuestion[] = [
  {
    id: 1, user_id: 1002, user_name: 'Aziz Karimov', status: 'open',
    question: 'Smartfon Aurora X ga 256GB versiyasi qachon keladi?',
    created_at: '2026-07-05T09:12:00Z',
  },
  {
    id: 2, user_id: 1003, user_name: 'Dilnoza', status: 'open',
    question: 'Krossovka 44 o‘lchami bormi?',
    created_at: '2026-07-05T15:40:00Z',
  },
  {
    id: 3, user_id: 1001, user_name: 'Demo Mijoz', status: 'answered',
    question: 'Yetkazish narxi qancha?',
    answer: 'Toshkent bo‘ylab bepul, viloyatlarga 30 000 so‘m.',
    created_at: '2026-07-03T11:00:00Z',
  },
];

export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'new', label: 'Yangi' },
  { value: 'confirmed', label: 'Tasdiqlangan' },
  { value: 'shipping', label: 'Yo‘lda' },
  { value: 'delivered', label: 'Yetkazildi' },
  { value: 'cancelled', label: 'Bekor qilindi' },
];
