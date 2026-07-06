import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { Order } from '../lib/types';
import { money, statusLabel, formatDate } from '../lib/format';
import { TopBar } from '../components/TopBar';

const STATUS_STYLE: Record<string, string> = {
  new: 'bg-amber-50 text-amber-600',
  confirmed: 'bg-primary-tint text-primary',
  shipping: 'bg-blue-50 text-blue-600',
  delivered: 'bg-primary text-white',
  cancelled: 'bg-accent-tint text-accent',
};

export function Orders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  useEffect(() => {
    api.getOrders().then(setOrders);
  }, []);

  return (
    <div>
      <TopBar title="Buyurtmalarim" />
      <div className="space-y-3 px-4 py-4">
        {orders === null &&
          Array.from({ length: 2 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-card" />)}

        {orders && orders.length === 0 && (
          <div className="mt-24 text-center text-muted dark:text-d-muted">
            <div className="text-5xl">🧾</div>
            <p className="mt-3 text-sm">Hali buyurtma yo‘q</p>
            <Link to="/catalog" className="btn-primary mt-5 inline-flex">Xaridni boshlash</Link>
          </div>
        )}

        {orders?.map((o) => (
          <div key={o.id} className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display text-[15px] font-bold text-ink dark:text-d-ink">Buyurtma #{o.id}</div>
                <div className="text-xs text-muted dark:text-d-muted">{formatDate(o.created_at)}</div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLE[o.status] ?? 'bg-line text-muted'}`}>
                {statusLabel(o.status)}
              </span>
            </div>
            <div className="mt-3 space-y-1 border-t border-line pt-3 dark:border-d-line">
              {o.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="min-w-0 truncate pr-2 text-muted dark:text-d-muted">{it.product_name} × {it.quantity}</span>
                  <span className="shrink-0 font-medium text-ink dark:text-d-ink">{money(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3 dark:border-d-line">
              <span className="text-sm text-muted dark:text-d-muted">{o.address}</span>
              <span className="font-display font-extrabold text-ink dark:text-d-ink">{money(o.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
