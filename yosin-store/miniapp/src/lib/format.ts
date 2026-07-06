import { CURRENCY } from './mockData';

/** "3 990 000 so'm" — grouped thousands, localized separator. */
export function money(value: number): string {
  return `${Math.round(value).toLocaleString('ru-RU').replace(/,/g, ' ')} ${CURRENCY}`;
}

/** Discount percentage from old vs current price, or null if no discount. */
export function discountPercent(price: number, oldPrice?: number | null): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Yangi',
  confirmed: 'Tasdiqlangan',
  shipping: 'Yo‘lda',
  delivered: 'Yetkazildi',
  cancelled: 'Bekor qilindi',
};
export const statusLabel = (s: string) => STATUS_LABELS[s] ?? s;

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' });
}
