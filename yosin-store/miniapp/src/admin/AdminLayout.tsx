import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAdmin } from './AdminContext';
import { IcChart, IcBag, IcGrid, IcTag, IcChat, IcMega, IcSettings, IcLogout, IcLock } from '../components/Icons';

const NAV = [
  { to: '/admin', end: true, label: 'Dashboard', Icon: IcChart },
  { to: '/admin/products', end: false, label: 'Mahsulotlar', Icon: IcGrid },
  { to: '/admin/categories', end: false, label: 'Kategoriyalar', Icon: IcTag },
  { to: '/admin/orders', end: false, label: 'Buyurtmalar', Icon: IcBag },
  { to: '/admin/questions', end: false, label: 'Savollar', Icon: IcChat },
  { to: '/admin/broadcast', end: false, label: 'Broadcast', Icon: IcMega },
  { to: '/admin/settings', end: false, label: 'Sozlamalar', Icon: IcSettings },
];

export function AdminLayout() {
  const { authed, logout, settings } = useAdmin();
  const { pathname } = useLocation();

  if (!authed) return <AdminLogin />;

  const active = NAV.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to) && n.to !== '/admin')) ?? NAV[0];

  return (
    <div className="min-h-full bg-cream dark:bg-d-bg lg:flex">
      {/* sidebar (desktop) */}
      <aside className="hidden w-60 shrink-0 border-r border-line bg-surface p-4 dark:border-d-line dark:bg-d-surface lg:block">
        <Brand shop={settings.shop_name} />
        <nav className="mt-6 space-y-1">
          {NAV.map((n) => <NavItem key={n.to} {...n} />)}
        </nav>
        <button onClick={logout} className="mt-6 flex w-full items-center gap-2 rounded-btn px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-line/40 dark:text-d-muted dark:hover:bg-d-line/40">
          <IcLogout width={19} height={19} /> Chiqish
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* mobile top bar */}
        <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur safe-t dark:border-d-line dark:bg-d-surface/90 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Brand shop={settings.shop_name} />
            <button onClick={logout} aria-label="Chiqish" className="text-muted dark:text-d-muted"><IcLogout width={20} height={20} /></button>
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
            {NAV.map((n) => <NavChip key={n.to} {...n} />)}
          </div>
        </header>

        {/* desktop page title */}
        <div className="hidden items-center justify-between border-b border-line bg-surface px-6 py-4 dark:border-d-line dark:bg-d-surface lg:flex">
          <h1 className="font-display text-lg font-extrabold text-ink dark:text-d-ink">{active.label}</h1>
          <span className="text-xs text-muted dark:text-d-muted">Yosin Store · Admin</span>
        </div>

        <main className="mx-auto w-full max-w-4xl flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Brand({ shop }: { shop: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-btn bg-primary font-display text-base font-extrabold text-white">Y</span>
      <span className="font-display text-[15px] font-extrabold text-ink dark:text-d-ink">{shop}</span>
    </div>
  );
}

function NavItem({ to, end, label, Icon }: (typeof NAV)[number]) {
  return (
    <NavLink to={to} end={end}
      className={({ isActive }) =>
        `flex items-center gap-2.5 rounded-btn px-3 py-2.5 text-sm font-medium transition ${
          isActive ? 'bg-primary-tint text-primary dark:bg-primary/15' : 'text-muted hover:bg-line/40 dark:text-d-muted dark:hover:bg-d-line/40'
        }`
      }>
      <Icon width={19} height={19} /> {label}
    </NavLink>
  );
}

function NavChip({ to, end, label, Icon }: (typeof NAV)[number]) {
  return (
    <NavLink to={to} end={end}
      className={({ isActive }) => `chip shrink-0 ${isActive ? 'chip-active' : ''}`}>
      <Icon width={15} height={15} /> {label}
    </NavLink>
  );
}

function AdminLogin() {
  const { login } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!login(password)) setError(true);
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-cream px-6 dark:bg-d-bg">
      <form onSubmit={submit} className="card w-full max-w-sm p-6">
        <div className="flex flex-col items-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-white"><IcLock width={26} height={26} /></span>
          <h1 className="mt-4 font-display text-xl font-extrabold text-ink dark:text-d-ink">Admin panel</h1>
          <p className="mt-1 text-sm text-muted dark:text-d-muted">Yosin Store boshqaruvi</p>
        </div>
        <div className="mt-6 space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder="Parol"
            autoFocus
            className="input"
          />
          {error && <p className="text-sm text-accent">Parol noto‘g‘ri.</p>}
          <button type="submit" className="btn-primary w-full">Kirish</button>
          <p className="text-center text-xs text-muted dark:text-d-muted">Demo parol: <b>demo</b></p>
        </div>
      </form>
    </div>
  );
}
