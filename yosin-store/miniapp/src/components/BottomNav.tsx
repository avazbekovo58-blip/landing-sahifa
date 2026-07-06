import { NavLink } from 'react-router-dom';
import { IcHome, IcGrid, IcBag, IcUser } from './Icons';
import { useStore } from '../lib/store';

const items = [
  { to: '/', label: 'Bosh sahifa', Icon: IcHome, end: true },
  { to: '/catalog', label: 'Katalog', Icon: IcGrid, end: false },
  { to: '/cart', label: 'Savat', Icon: IcBag, end: false },
  { to: '/profile', label: 'Profil', Icon: IcUser, end: false },
];

export function BottomNav() {
  const { count } = useStore();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/90 backdrop-blur-lg safe-b dark:border-d-line dark:bg-d-surface/90">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {items.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10.5px] font-medium transition ${
                isActive ? 'text-primary' : 'text-muted dark:text-d-muted'
              }`
            }
          >
            <span className="relative">
              <Icon width={23} height={23} />
              {to === '/cart' && count > 0 && (
                <span className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
