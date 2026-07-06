import { useNavigate } from 'react-router-dom';
import { IcChevronLeft } from './Icons';

// Inner-page header with a back button and centered title.
export function TopBar({ title, right }: { title: string; right?: React.ReactNode }) {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream/85 backdrop-blur-lg safe-t dark:border-d-line dark:bg-d-bg/85">
      <div className="mx-auto flex max-w-md items-center gap-2 px-3 py-3">
        <button
          onClick={() => nav(-1)}
          aria-label="Orqaga"
          className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-ink transition active:scale-90 dark:border-d-line dark:bg-d-surface dark:text-d-ink"
        >
          <IcChevronLeft width={20} height={20} />
        </button>
        <h1 className="flex-1 truncate text-center text-[15px] font-bold text-ink dark:text-d-ink">{title}</h1>
        <div className="flex h-9 w-9 items-center justify-center">{right}</div>
      </div>
    </header>
  );
}
