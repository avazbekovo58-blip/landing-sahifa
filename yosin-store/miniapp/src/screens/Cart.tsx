import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { money } from '../lib/format';
import { TopBar } from '../components/TopBar';
import { IcPlus, IcMinus, IcTrash, IcBag } from '../components/Icons';

export function CartScreen() {
  const { items, total, setQty, remove } = useStore();
  const nav = useNavigate();

  if (items.length === 0) {
    return (
      <div>
        <TopBar title="Savat" />
        <div className="mt-24 flex flex-col items-center px-8 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-primary-tint text-primary dark:bg-primary/10">
            <IcBag width={34} height={34} />
          </span>
          <h2 className="mt-5 font-display text-lg font-bold text-ink dark:text-d-ink">Savat bo‘sh</h2>
          <p className="mt-1 text-sm text-muted dark:text-d-muted">Yoqqan mahsulotlarni savatga qo‘shing.</p>
          <Link to="/catalog" className="btn-primary mt-6">Xaridni boshlash</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title={`Savat · ${items.length}`} />
      <div className="space-y-3 px-4 py-4">
        {items.map((i) => (
          <div key={i.variant_id} className="card flex gap-3 p-2.5">
            <Link to={`/product/${i.product_id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-btn bg-line/40 dark:bg-d-line">
              <img src={i.image} alt={i.product_name} className="h-full w-full object-cover" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-ink dark:text-d-ink">{i.product_name}</div>
                  <div className="text-xs text-muted dark:text-d-muted">{i.variant_name}</div>
                </div>
                <button onClick={() => remove(i.variant_id)} aria-label="O‘chirish" className="text-muted transition active:scale-90 dark:text-d-muted">
                  <IcTrash width={18} height={18} />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="font-display text-[15px] font-extrabold text-ink dark:text-d-ink">{money(i.price * i.quantity)}</div>
                <div className="flex items-center gap-2 rounded-full border border-line dark:border-d-line">
                  <button onClick={() => setQty(i.variant_id, i.quantity - 1)} aria-label="Kamaytirish" className="grid h-8 w-8 place-items-center text-ink transition active:scale-90 dark:text-d-ink">
                    <IcMinus width={16} height={16} />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold text-ink dark:text-d-ink">{i.quantity}</span>
                  <button onClick={() => setQty(i.variant_id, i.quantity + 1)} aria-label="Ko‘paytirish" className="grid h-8 w-8 place-items-center text-ink transition active:scale-90 dark:text-d-ink">
                    <IcPlus width={16} height={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* summary */}
        <div className="card space-y-2 p-4">
          <div className="flex justify-between text-sm text-muted dark:text-d-muted">
            <span>Mahsulotlar</span><span>{money(total)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted dark:text-d-muted">
            <span>Yetkazish</span><span className="text-primary">Bepul</span>
          </div>
          <div className="border-t border-line pt-2 dark:border-d-line" />
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink dark:text-d-ink">Jami</span>
            <span className="font-display text-xl font-extrabold text-ink dark:text-d-ink">{money(total)}</span>
          </div>
        </div>
      </div>

      {/* checkout bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur-lg safe-b dark:border-d-line dark:bg-d-surface/95">
        <div className="mx-auto max-w-md">
          <button onClick={() => nav('/checkout')} className="btn-cta w-full py-3.5 text-[15px]">
            Rasmiylashtirish · {money(total)}
          </button>
        </div>
      </div>
    </div>
  );
}
