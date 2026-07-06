import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, IS_DEMO } from '../lib/api';
import type { Me } from '../lib/types';
import { useStore } from '../lib/store';
import { IcBag, IcHeart, IcChevronRight, IcUser } from '../components/Icons';

export function Profile() {
  const nav = useNavigate();
  const { favorites } = useStore();
  const [me, setMe] = useState<Me | null>(null);
  const [lang, setLang] = useState('uz');

  useEffect(() => {
    api.getMe().then((m) => { setMe(m); setLang(m.lang); });
  }, []);

  return (
    <div>
      <header className="safe-t bg-gradient-to-b from-primary to-primary-bright px-4 pb-8 pt-6 text-white">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/20 text-2xl font-extrabold backdrop-blur">
            {me?.name?.[0] ?? <IcUser width={28} height={28} />}
          </span>
          <div>
            <div className="font-display text-xl font-extrabold">{me?.name ?? 'Mehmon'}</div>
            <div className="text-sm text-white/80">{me?.phone ?? (me?.username ? `@${me.username}` : '')}</div>
          </div>
        </div>
      </header>

      <div className="-mt-4 space-y-4 px-4">
        {/* quick stats */}
        <div className="card grid grid-cols-2 divide-x divide-line p-0 dark:divide-d-line">
          <button onClick={() => nav('/orders')} className="flex items-center justify-center gap-2 py-4">
            <IcBag width={20} height={20} className="text-primary" />
            <span className="text-sm font-semibold text-ink dark:text-d-ink">Buyurtmalar</span>
          </button>
          <div className="flex items-center justify-center gap-2 py-4">
            <IcHeart width={20} height={20} className="text-accent" />
            <span className="text-sm font-semibold text-ink dark:text-d-ink">Sevimli · {favorites.length}</span>
          </div>
        </div>

        {/* menu */}
        <div className="card divide-y divide-line dark:divide-d-line">
          <Row label="Buyurtmalarim" onClick={() => nav('/orders')} />
          <Row label="Yetkazish manzillari" />
          <Row label="Yordam va aloqa" />
          <Row label="Admin panel (demo)" onClick={() => nav('/admin')} />
        </div>

        {/* language */}
        <div className="card p-4">
          <div className="mb-2 text-sm font-semibold text-ink dark:text-d-ink">Til</div>
          <div className="flex gap-2">
            {[
              { code: 'uz', label: "O‘zbek" },
              { code: 'ru', label: 'Русский' },
            ].map((l) => (
              <button key={l.code} onClick={() => setLang(l.code)} className={`chip ${lang === l.code ? 'chip-active' : ''}`}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {IS_DEMO && (
          <p className="px-1 pb-2 text-center text-xs text-muted dark:text-d-muted">
            Demo rejim · ma’lumotlar namuna uchun
          </p>
        )}
      </div>
    </div>
  );
}

function Row({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between px-4 py-3.5 text-left active:bg-line/30 dark:active:bg-d-line/40">
      <span className="text-sm font-medium text-ink dark:text-d-ink">{label}</span>
      <IcChevronRight width={18} height={18} className="text-muted dark:text-d-muted" />
    </button>
  );
}
