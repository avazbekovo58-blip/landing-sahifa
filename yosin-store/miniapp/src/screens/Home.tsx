import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import type { Category, Product } from '../lib/types';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { IcSearch, IcTruck, IcShield, IcSpark, IcChevronRight } from '../components/Icons';
import { SETTINGS } from '../lib/mockData';

const CATEGORY_TINTS = ['bg-primary-tint text-primary', 'bg-accent-tint text-accent', 'bg-amber-50 text-amber-600'];

export function Home() {
  const nav = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    api.getCategories().then(setCategories);
    api.getProducts({ sort: 'popular' }).then(setProducts);
  }, []);

  return (
    <div>
      {/* logo bar */}
      <header className="sticky top-0 z-30 bg-cream/85 backdrop-blur-lg safe-t dark:bg-d-bg/85">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-btn bg-primary font-display text-lg font-extrabold text-white">Y</span>
            <div className="leading-none">
              <div className="font-display text-[17px] font-extrabold text-ink dark:text-d-ink">{SETTINGS.shop_name}</div>
              <div className="text-[11px] text-muted dark:text-d-muted">Premium onlayn do‘kon</div>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-6 px-4 pt-1">
        {/* search shortcut */}
        <button
          onClick={() => nav('/catalog')}
          className="flex w-full items-center gap-2 rounded-btn border border-line bg-surface px-4 py-3 text-left text-muted shadow-soft dark:border-d-line dark:bg-d-surface dark:text-d-muted"
        >
          <IcSearch width={20} height={20} />
          <span className="text-sm">Mahsulot qidirish…</span>
        </button>

        {/* hero banner */}
        <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-primary to-primary-bright p-5 text-white shadow-card">
          <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-14 -left-6 h-40 w-40 rounded-full bg-white/10" />
          <div className="relative z-10 max-w-[68%]">
            <span className="inline-block rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold">−20% chegirma</span>
            <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight">Mavsumiy savdo boshlandi</h2>
            <p className="mt-1 text-sm text-white/85">Tanlangan mahsulotlarga maxsus narxlar</p>
            <Link to="/catalog" className="mt-4 inline-flex items-center gap-1.5 rounded-btn bg-white px-4 py-2.5 text-sm font-bold text-primary transition active:scale-95">
              Xarid qilish <IcChevronRight width={16} height={16} />
            </Link>
          </div>
        </div>

        {/* trust badges */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { Icon: IcTruck, t: 'Tez yetkazish', s: '1-2 kun' },
            { Icon: IcShield, t: 'Xavfsiz to‘lov', s: 'Kafolatli' },
            { Icon: IcSpark, t: 'Original', s: '100% asl' },
          ].map(({ Icon, t, s }) => (
            <div key={t} className="card flex flex-col items-center gap-1 px-1 py-3 text-center">
              <span className="text-primary"><Icon width={22} height={22} /></span>
              <span className="text-[12px] font-semibold text-ink dark:text-d-ink">{t}</span>
              <span className="text-[10.5px] text-muted dark:text-d-muted">{s}</span>
            </div>
          ))}
        </div>

        {/* categories */}
        <section>
          <SectionHead title="Kategoriyalar" to="/catalog" />
          <div className="grid grid-cols-3 gap-2.5">
            {categories.map((c, i) => (
              <Link
                key={c.id}
                to={`/catalog?category=${c.id}`}
                className="card flex flex-col items-center gap-2 px-2 py-4 transition active:scale-95"
              >
                <span className={`grid h-12 w-12 place-items-center rounded-full text-2xl ${CATEGORY_TINTS[i % CATEGORY_TINTS.length]}`}>
                  {c.icon}
                </span>
                <span className="text-[12.5px] font-semibold text-ink dark:text-d-ink">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* popular products */}
        <section>
          <SectionHead title="Ommabop mahsulotlar" to="/catalog" />
          <div className="grid grid-cols-2 gap-3">
            {products
              ? products.slice(0, 6).map((p) => <ProductCard key={p.id} product={p} />)
              : Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHead({ title, to }: { title: string; to: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="font-display text-[17px] font-extrabold text-ink dark:text-d-ink">{title}</h3>
      <Link to={to} className="flex items-center gap-0.5 text-[13px] font-semibold text-primary">
        Barchasi <IcChevronRight width={15} height={15} />
      </Link>
    </div>
  );
}
