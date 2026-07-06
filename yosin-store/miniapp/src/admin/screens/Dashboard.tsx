import { useAdmin } from '../AdminContext';
import { money, statusLabel, formatDate } from '../../lib/format';
import { SALES_7D } from '../../lib/adminData';

export function AdminDashboard() {
  const { stats, orders } = useAdmin();
  const max = Math.max(...SALES_7D.map((d) => d.value));

  return (
    <div className="space-y-5">
      {/* stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard label="Bugungi sotuv" value={money(stats.sales_today)} tone="primary" />
        <StatCard label="Haftalik" value={money(stats.sales_week)} />
        <StatCard label="Oylik" value={money(stats.sales_month)} />
        <StatCard label="Yangi buyurtma" value={String(stats.orders_new)} tone="accent" />
        <StatCard label="Jami buyurtma" value={String(stats.orders_total)} />
        <StatCard label="Mijozlar" value={String(stats.customers)} />
      </div>

      {/* 7-day chart */}
      <div className="card p-4">
        <h3 className="mb-4 font-display text-base font-bold text-ink dark:text-d-ink">So‘nggi 7 kun sotuvi</h3>
        {/* bars in a fixed-height row so percentage heights resolve, labels below */}
        <div className="flex h-40 items-end gap-2">
          {SALES_7D.map((d) => (
            <div
              key={d.day}
              className="flex-1 rounded-t-md bg-primary/85 transition-all"
              style={{ height: `${Math.max(6, (d.value / max) * 100)}%` }}
              title={money(d.value)}
            />
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          {SALES_7D.map((d) => (
            <span key={d.day} className="flex-1 text-center text-[11px] text-muted dark:text-d-muted">{d.day}</span>
          ))}
        </div>
      </div>

      {/* recent orders */}
      <div className="card overflow-hidden">
        <h3 className="border-b border-line px-4 py-3 font-display text-base font-bold text-ink dark:border-d-line dark:text-d-ink">
          So‘nggi buyurtmalar
        </h3>
        <div className="divide-y divide-line dark:divide-d-line">
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-ink dark:text-d-ink">Buyurtma #{o.id}</div>
                <div className="text-xs text-muted dark:text-d-muted">{formatDate(o.created_at)} · {o.address}</div>
              </div>
              <div className="text-right">
                <div className="font-display text-sm font-extrabold text-ink dark:text-d-ink">{money(o.total)}</div>
                <div className="text-[11px] text-muted dark:text-d-muted">{statusLabel(o.status)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone?: 'primary' | 'accent' }) {
  const accentBar =
    tone === 'primary' ? 'bg-primary' : tone === 'accent' ? 'bg-accent' : 'bg-line dark:bg-d-line';
  return (
    <div className="card relative overflow-hidden p-4">
      <span className={`absolute inset-x-0 top-0 h-1 ${accentBar}`} />
      <div className="text-xs text-muted dark:text-d-muted">{label}</div>
      <div className="mt-1 font-display text-lg font-extrabold text-ink dark:text-d-ink">{value}</div>
    </div>
  );
}
