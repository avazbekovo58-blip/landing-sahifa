import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { api } from '../lib/api';
import { money } from '../lib/format';
import { TopBar } from '../components/TopBar';
import { IcCheck } from '../components/Icons';
import { haptic } from '../lib/telegram';
import { ME } from '../lib/mockData';

export function Checkout() {
  const { items, total, clear } = useStore();
  const nav = useNavigate();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(ME.phone ?? '');
  const [payment] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<number | null>(null);

  const valid = address.trim().length > 4 && phone.trim().length >= 7;

  async function submit() {
    if (!valid || loading) return;
    setLoading(true);
    // Total shown here is informational — the server recomputes it from DB prices.
    const res = await api.createOrder({ address, phone, payment_method: payment });
    clear();
    haptic('success');
    setDone(res.order_id);
    setLoading(false);
  }

  if (done !== null) {
    return (
      <div>
        <TopBar title="Buyurtma" />
        <div className="mt-20 flex flex-col items-center px-8 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-primary text-white animate-pop">
            <IcCheck width={40} height={40} />
          </span>
          <h2 className="mt-5 font-display text-xl font-extrabold text-ink dark:text-d-ink">Buyurtma qabul qilindi!</h2>
          <p className="mt-1 text-sm text-muted dark:text-d-muted">Buyurtma raqami #{done}. Administrator tez orada bog‘lanadi.</p>
          <button onClick={() => nav('/orders')} className="btn-primary mt-6">Buyurtmalarim</button>
          <button onClick={() => nav('/')} className="mt-3 text-sm font-semibold text-primary">Bosh sahifaga</button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <TopBar title="Rasmiylashtirish" />
        <p className="mt-24 text-center text-sm text-muted dark:text-d-muted">Savat bo‘sh.</p>
      </div>
    );
  }

  return (
    <div>
      <TopBar title="Rasmiylashtirish" />
      <div className="space-y-5 px-4 py-4">
        <section className="space-y-3">
          <h3 className="font-display text-base font-bold text-ink dark:text-d-ink">Yetkazish manzili</h3>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Shahar, tuman, ko‘cha, uy…"
            rows={3}
            className="input resize-none"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Telefon raqam"
            inputMode="tel"
            className="input"
          />
        </section>

        <section className="space-y-2">
          <h3 className="font-display text-base font-bold text-ink dark:text-d-ink">To‘lov usuli</h3>
          <label className="card flex items-center gap-3 p-4">
            <span className="grid h-5 w-5 place-items-center rounded-full border-2 border-primary">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            <div>
              <div className="text-sm font-semibold text-ink dark:text-d-ink">Naqd pul</div>
              <div className="text-xs text-muted dark:text-d-muted">Yetkazishda to‘lash</div>
            </div>
          </label>
        </section>

        {/* order summary */}
        <section className="card p-4">
          <h3 className="mb-3 font-display text-base font-bold text-ink dark:text-d-ink">Buyurtma</h3>
          <div className="space-y-2">
            {items.map((i) => (
              <div key={i.variant_id} className="flex justify-between text-sm">
                <span className="min-w-0 truncate pr-2 text-muted dark:text-d-muted">{i.product_name} × {i.quantity}</span>
                <span className="shrink-0 font-medium text-ink dark:text-d-ink">{money(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3 dark:border-d-line">
            <span className="font-semibold text-ink dark:text-d-ink">Jami</span>
            <span className="font-display text-lg font-extrabold text-ink dark:text-d-ink">{money(total)}</span>
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur-lg safe-b dark:border-d-line dark:bg-d-surface/95">
        <div className="mx-auto max-w-md">
          <button onClick={submit} disabled={!valid || loading} className={`btn-cta w-full py-3.5 text-[15px] ${!valid || loading ? 'opacity-50' : ''}`}>
            {loading ? 'Yuborilmoqda…' : `Buyurtmani tasdiqlash · ${money(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
