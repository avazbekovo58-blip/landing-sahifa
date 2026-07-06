import { useState } from 'react';
import { useAdmin } from '../AdminContext';
import type { Settings } from '../../lib/types';
import { IcCheck } from '../../components/Icons';

export function AdminSettings() {
  const { settings, updateSettings } = useAdmin();
  const [draft, setDraft] = useState<Settings>({ ...settings });
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setSaved(false);
  };

  function save() {
    updateSettings(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="card space-y-3 p-4">
        <Field label="Do‘kon nomi">
          <input className="input" value={draft.shop_name} onChange={(e) => set('shop_name', e.target.value)} />
        </Field>
        <Field label="Valyuta">
          <input className="input" value={draft.currency} onChange={(e) => set('currency', e.target.value)} />
        </Field>
        <Field label="Yetkazish ma’lumoti">
          <textarea className="input resize-none" rows={2} value={draft.delivery_info} onChange={(e) => set('delivery_info', e.target.value)} />
        </Field>
      </div>

      <button onClick={save} className="btn-primary w-full">
        {saved ? (<><IcCheck width={18} height={18} /> Saqlandi</>) : 'Saqlash'}
      </button>

      <p className="px-1 text-center text-xs text-muted dark:text-d-muted">
        Sozlamalar <code>settings</code> jadvalida saqlanadi — do‘konni kod o‘zgartirmasdan moslaydi.
      </p>
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
