import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, type ProductQuery } from '../lib/api';
import type { Category, Product } from '../lib/types';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { IcSearch, IcFilter } from '../components/Icons';

const SORTS: { value: NonNullable<ProductQuery['sort']>; label: string }[] = [
  { value: 'popular', label: 'Ommabop' },
  { value: 'price_asc', label: 'Arzon avval' },
  { value: 'price_desc', label: 'Qimmat avval' },
  { value: 'new', label: 'Yangi' },
];

export function Catalog() {
  const [params, setParams] = useSearchParams();
  const activeCat = params.get('category') ? Number(params.get('category')) : undefined;

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<ProductQuery['sort']>('popular');
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  // debounce search a touch so typing feels smooth
  const query = useMemo<ProductQuery>(() => ({ category: activeCat, search, sort }), [activeCat, search, sort]);
  useEffect(() => {
    setProducts(null);
    const t = setTimeout(() => api.getProducts(query).then(setProducts), 180);
    return () => clearTimeout(t);
  }, [query]);

  const setCat = (id?: number) => {
    const next = new URLSearchParams(params);
    if (id == null) next.delete('category');
    else next.set('category', String(id));
    setParams(next, { replace: true });
  };

  return (
    <div>
      <header className="sticky top-0 z-30 space-y-3 bg-cream/90 px-4 pb-3 pt-3 backdrop-blur-lg safe-t dark:bg-d-bg/90">
        {/* search + sort */}
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-btn border border-line bg-surface px-3.5 py-2.5 dark:border-d-line dark:bg-d-surface">
            <IcSearch width={19} height={19} className="text-muted dark:text-d-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Qidirish…"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/70 dark:text-d-ink"
            />
          </div>
          <button
            onClick={() => setShowSort((s) => !s)}
            aria-label="Saralash"
            className="grid h-[42px] w-[42px] place-items-center rounded-btn border border-line bg-surface text-ink transition active:scale-95 dark:border-d-line dark:bg-d-surface dark:text-d-ink"
          >
            <IcFilter width={20} height={20} />
          </button>
        </div>

        {showSort && (
          <div className="flex flex-wrap gap-2">
            {SORTS.map((s) => (
              <button
                key={s.value}
                onClick={() => { setSort(s.value); setShowSort(false); }}
                className={`chip ${sort === s.value ? 'chip-active' : ''}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* category rail */}
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          <button onClick={() => setCat(undefined)} className={`chip shrink-0 ${activeCat == null ? 'chip-active' : ''}`}>
            Hammasi
          </button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)} className={`chip shrink-0 ${activeCat === c.id ? 'chip-active' : ''}`}>
              <span>{c.icon}</span> {c.name}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 pt-2">
        {products && products.length === 0 ? (
          <div className="mt-20 text-center text-muted dark:text-d-muted">
            <div className="text-5xl">🔍</div>
            <p className="mt-3 text-sm">Hech narsa topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products
              ? products.map((p) => <ProductCard key={p.id} product={p} />)
              : Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
