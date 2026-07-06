import { useState } from 'react';
import { useAdmin, type AdminProduct } from '../AdminContext';
import { money } from '../../lib/format';
import type { Variant } from '../../lib/types';
import { IcPlus, IcEdit, IcTrash } from '../../components/Icons';

const blank = (): AdminProduct => ({
  id: 0, category_id: 1, name: '', description: '', brand: '', images: [''],
  variants: [{ id: Date.now(), name: '', price: 0, stock: 0 }],
  attributes: [], rating: 0, reviews_count: 0, is_active: true,
});

export function AdminProducts() {
  const { products, categories, deleteProduct, toggleActive } = useAdmin();
  const [editing, setEditing] = useState<AdminProduct | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted dark:text-d-muted">{products.length} ta mahsulot</span>
        <button onClick={() => setEditing(blank())} className="btn-primary py-2.5 text-sm">
          <IcPlus width={18} height={18} /> Qo‘shish
        </button>
      </div>

      <div className="space-y-2.5">
        {products.map((p) => {
          const prices = p.variants.map((v) => v.price);
          const stock = p.variants.reduce((s, v) => s + v.stock, 0);
          const cat = categories.find((c) => c.id === p.category_id);
          return (
            <div key={p.id} className="card flex items-center gap-3 p-2.5">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-btn bg-line/40 dark:bg-d-line">
                {p.images[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-ink dark:text-d-ink">{p.name || '—'}</span>
                  {!p.is_active && <span className="rounded-full bg-line px-1.5 py-0.5 text-[10px] font-bold text-muted dark:bg-d-line dark:text-d-muted">Yashirin</span>}
                </div>
                <div className="text-xs text-muted dark:text-d-muted">
                  {cat?.name} · {money(Math.min(...prices))} · {stock} dona
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleActive(p.id)} title="Ko‘rinish"
                  className={`h-6 w-10 rounded-full p-0.5 transition ${p.is_active ? 'bg-primary' : 'bg-line dark:bg-d-line'}`}>
                  <span className={`block h-5 w-5 rounded-full bg-white transition ${p.is_active ? 'translate-x-4' : ''}`} />
                </button>
                <button onClick={() => setEditing(p)} aria-label="Tahrirlash" className="grid h-9 w-9 place-items-center rounded-btn text-muted transition hover:bg-line/40 dark:text-d-muted dark:hover:bg-d-line/40">
                  <IcEdit width={18} height={18} />
                </button>
                <button onClick={() => confirm('O‘chirilsinmi?') && deleteProduct(p.id)} aria-label="O‘chirish" className="grid h-9 w-9 place-items-center rounded-btn text-accent transition hover:bg-accent-tint">
                  <IcTrash width={18} height={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && <ProductEditModal product={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function ProductEditModal({ product, onClose }: { product: AdminProduct; onClose: () => void }) {
  const { categories, saveProduct } = useAdmin();
  const [draft, setDraft] = useState<AdminProduct>({ ...product, variants: product.variants.map((v) => ({ ...v })) });
  const isNew = product.id === 0;

  const set = <K extends keyof AdminProduct>(k: K, v: AdminProduct[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const setVariant = (i: number, patch: Partial<Variant>) =>
    setDraft((d) => ({ ...d, variants: d.variants.map((v, idx) => (idx === i ? { ...v, ...patch } : v)) }));
  const addVariant = () =>
    setDraft((d) => ({ ...d, variants: [...d.variants, { id: Date.now(), name: '', price: 0, stock: 0 }] }));
  const removeVariant = (i: number) =>
    setDraft((d) => ({ ...d, variants: d.variants.filter((_, idx) => idx !== i) }));

  const valid = draft.name.trim() && draft.variants.length > 0 && draft.variants.every((v) => v.name.trim());

  function save() {
    if (!valid) return;
    saveProduct(draft);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-surface p-5 dark:bg-d-surface sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-lg font-extrabold text-ink dark:text-d-ink">
          {isNew ? 'Yangi mahsulot' : 'Mahsulotni tahrirlash'}
        </h2>

        <div className="mt-4 space-y-3">
          <Field label="Nomi">
            <input className="input" value={draft.name} onChange={(e) => set('name', e.target.value)} placeholder="Mahsulot nomi" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Brend">
              <input className="input" value={draft.brand ?? ''} onChange={(e) => set('brand', e.target.value)} />
            </Field>
            <Field label="Kategoriya">
              <select className="input" value={draft.category_id} onChange={(e) => set('category_id', Number(e.target.value))}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Rasm havolasi (URL)">
            <input className="input" value={draft.images[0] ?? ''} onChange={(e) => set('images', [e.target.value])} placeholder="https://…" />
          </Field>
          <Field label="Tavsif">
            <textarea className="input resize-none" rows={2} value={draft.description} onChange={(e) => set('description', e.target.value)} />
          </Field>

          {/* variants */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-semibold text-ink dark:text-d-ink">Variantlar (narx + stok)</span>
              <button onClick={addVariant} className="text-sm font-semibold text-primary">+ variant</button>
            </div>
            <div className="space-y-2">
              {draft.variants.map((v, i) => (
                <div key={v.id} className="flex items-center gap-2">
                  <input className="input flex-1" value={v.name} onChange={(e) => setVariant(i, { name: e.target.value })} placeholder="Nomi (M / Qora)" />
                  <input className="input w-24" type="number" value={v.price || ''} onChange={(e) => setVariant(i, { price: Number(e.target.value) })} placeholder="Narx" />
                  <input className="input w-16" type="number" value={v.stock || ''} onChange={(e) => setVariant(i, { stock: Number(e.target.value) })} placeholder="Stok" />
                  {draft.variants.length > 1 && (
                    <button onClick={() => removeVariant(i)} className="text-accent"><IcTrash width={18} height={18} /></button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1">Bekor</button>
          <button onClick={save} disabled={!valid} className={`btn-primary flex-1 ${!valid ? 'opacity-50' : ''}`}>Saqlash</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted dark:text-d-muted">{label}</span>
      {children}
    </label>
  );
}
