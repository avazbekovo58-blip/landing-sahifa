import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import type { Product, Variant } from '../lib/types';
import { money, discountPercent } from '../lib/format';
import { useStore } from '../lib/store';
import { Rating } from '../components/Rating';
import { TopBar } from '../components/TopBar';
import { IcHeart, IcTruck, IcCheck, IcBag } from '../components/Icons';
import { haptic } from '../lib/telegram';
import { SETTINGS } from '../lib/mockData';

export function ProductScreen() {
  const { id } = useParams();
  const nav = useNavigate();
  const { add, toggleFav, isFav } = useStore();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [variant, setVariant] = useState<Variant | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.getProduct(Number(id)).then((p) => {
      setProduct(p ?? null);
      if (p) setVariant(p.variants.find((v) => v.stock > 0) ?? p.variants[0]);
    });
  }, [id]);

  if (product === undefined) return <ProductSkeleton />;
  if (product === null) {
    return (
      <div>
        <TopBar title="Mahsulot" />
        <p className="mt-20 text-center text-muted">Mahsulot topilmadi.</p>
      </div>
    );
  }

  const discount = variant ? discountPercent(variant.price, variant.old_price) : null;
  const fav = isFav(product.id);
  const outOfStock = variant ? variant.stock <= 0 : true;

  function handleAdd() {
    if (!variant || outOfStock) return;
    add(product!, variant);
    setAdded(true);
    haptic('success');
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div>
      <TopBar
        title={product.name}
        right={
          <button onClick={() => toggleFav(product.id)} aria-label="Sevimlilar" className={fav ? 'text-accent' : 'text-ink dark:text-d-ink'}>
            <IcHeart width={22} height={22} filled={fav} />
          </button>
        }
      />

      {/* gallery */}
      <div className="bg-surface dark:bg-d-surface">
        <div className="relative aspect-square">
          <img src={product.images[activeImg]} alt={product.name} className="h-full w-full object-cover" />
          {discount && (
            <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white shadow-cta">
              −{discount}%
            </span>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2 p-3">
            {product.images.map((im, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`h-14 w-14 overflow-hidden rounded-btn border-2 transition ${
                  i === activeImg ? 'border-primary' : 'border-transparent opacity-70'
                }`}
              >
                <img src={im} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-5 px-4 py-4">
        <div>
          {product.brand && <div className="text-xs font-medium uppercase tracking-wide text-muted dark:text-d-muted">{product.brand}</div>}
          <h1 className="mt-1 font-display text-xl font-extrabold leading-snug text-ink dark:text-d-ink">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Rating value={product.rating} count={product.reviews_count} />
            <span className="text-xs text-muted dark:text-d-muted">· {product.reviews_count} sharh</span>
          </div>
        </div>

        {/* price */}
        <div className="flex items-end gap-3">
          <span className="font-display text-3xl font-extrabold text-ink dark:text-d-ink">{variant && money(variant.price)}</span>
          {variant?.old_price && <span className="pb-1 text-base text-muted line-through dark:text-d-muted">{money(variant.old_price)}</span>}
        </div>

        {/* variant selector */}
        <div>
          <div className="mb-2 text-sm font-semibold text-ink dark:text-d-ink">Variant</div>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const disabled = v.stock <= 0;
              const active = variant?.id === v.id;
              return (
                <button
                  key={v.id}
                  disabled={disabled}
                  onClick={() => setVariant(v)}
                  className={`rounded-btn border px-3.5 py-2 text-sm font-medium transition
                    ${active ? 'border-primary bg-primary-tint text-primary dark:bg-primary/15'
                      : 'border-line bg-surface text-ink dark:border-d-line dark:bg-d-surface dark:text-d-ink'}
                    ${disabled ? 'cursor-not-allowed opacity-40 line-through' : 'active:scale-95'}`}
                >
                  {v.name}
                </button>
              );
            })}
          </div>
          {variant && (
            <p className={`mt-2 text-xs ${outOfStock ? 'text-accent' : 'text-primary'}`}>
              {outOfStock ? 'Omborda tugagan' : `Omborda mavjud · ${variant.stock} dona`}
            </p>
          )}
        </div>

        {/* attributes */}
        {product.attributes.length > 0 && (
          <div>
            <div className="mb-2 text-sm font-semibold text-ink dark:text-d-ink">Xususiyatlar</div>
            <dl className="card divide-y divide-line dark:divide-d-line">
              {product.attributes.map((a) => (
                <div key={a.key} className="flex justify-between px-4 py-2.5 text-sm">
                  <dt className="text-muted dark:text-d-muted">{a.key}</dt>
                  <dd className="font-medium text-ink dark:text-d-ink">{a.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* description */}
        <div>
          <div className="mb-2 text-sm font-semibold text-ink dark:text-d-ink">Tavsif</div>
          <p className="text-sm leading-relaxed text-muted dark:text-d-muted">{product.description}</p>
        </div>

        {/* delivery */}
        <div className="flex items-start gap-3 rounded-card bg-primary-tint px-4 py-3 dark:bg-primary/10">
          <span className="text-primary"><IcTruck width={22} height={22} /></span>
          <p className="text-sm text-primary dark:text-primary-soft">{SETTINGS.delivery_info}</p>
        </div>
      </div>

      {/* sticky add-to-cart bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur-lg safe-b dark:border-d-line dark:bg-d-surface/95">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button onClick={() => nav('/cart')} className="btn-ghost h-12 px-4" aria-label="Savat">
            <IcBag width={22} height={22} />
          </button>
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={`btn-cta h-12 flex-1 text-[15px] ${outOfStock ? 'opacity-50' : ''}`}
          >
            {added ? (<><IcCheck width={20} height={20} /> Qo‘shildi</>) : outOfStock ? 'Mavjud emas' : 'Savatga qo‘shish'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div>
      <TopBar title="Yuklanmoqda…" />
      <div className="skeleton aspect-square rounded-none" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-4 w-1/3 rounded" />
        <div className="skeleton h-6 w-2/3 rounded" />
        <div className="skeleton h-8 w-1/2 rounded" />
        <div className="skeleton h-24 w-full rounded-card" />
      </div>
    </div>
  );
}
