import { useAdmin } from '../AdminContext';
import { money, formatDate, statusLabel } from '../../lib/format';
import { ORDER_STATUSES } from '../../lib/adminData';
import type { OrderStatus } from '../../lib/types';

const TONE: Record<string, string> = {
  new: 'text-amber-600', confirmed: 'text-primary', shipping: 'text-blue-600',
  delivered: 'text-primary', cancelled: 'text-accent',
};

export function AdminOrders() {
  const { orders, setOrderStatus } = useAdmin();

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="card p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-display text-[15px] font-bold text-ink dark:text-d-ink">Buyurtma #{o.id}</div>
              <div className="text-xs text-muted dark:text-d-muted">{formatDate(o.created_at)} · {o.phone}</div>
            </div>
            <div className="font-display font-extrabold text-ink dark:text-d-ink">{money(o.total)}</div>
          </div>

          <div className="mt-3 space-y-1 border-y border-line py-3 dark:border-d-line">
            {o.items.map((it, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="min-w-0 truncate pr-2 text-muted dark:text-d-muted">{it.product_name} × {it.quantity}</span>
                <span className="shrink-0 text-ink dark:text-d-ink">{money(it.price * it.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="min-w-0 truncate text-xs text-muted dark:text-d-muted">{o.address}</span>
            <select
              value={o.status}
              onChange={(e) => setOrderStatus(o.id, e.target.value as OrderStatus)}
              className={`rounded-btn border border-line bg-surface px-3 py-2 text-sm font-semibold dark:border-d-line dark:bg-d-surface ${TONE[o.status]}`}
            >
              {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{statusLabel(s.value)}</option>)}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
