import { Link } from 'react-router-dom';
import type { Product } from '../lib/types';
import { money, discountPercent } from '../lib/format';
import { useStore } from '../lib/store';
import { Rating } from './Rating';
import { IcHeart, IcPlus } from './Icons';

// Cheapest variant drives the "starting from" price shown on the card.
function cheapest(p: Product) {
  return p.variants.reduce((a, b) => (b.price < a.price ? b : a), p.variants[0]);
}

export function ProductCard({ product }: { product: Product }) {
  const { add, toggleFav, isFav } = useStore();
  const v = cheapest(product);
  const discount = discountPercent(v.price, v.old_price);
  const fav = isFav(product.id);

  return (
    <div className="card group relative flex flex-col overflow-hidden animate-fade-up">
      {/* image */}
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-line/40 dark:bg-d-line">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {discount && (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-white shadow-cta">
            −{discount}%
          </span>
        )}
      </Link>

      {/* favorite */}
      <button
        onClick={() => toggleFav(product.id)}
        aria-label="Sevimlilar"
        className={`absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full backdrop-blur
          ${fav ? 'bg-accent/90 text-white' : 'bg-white/85 text-ink dark:bg-black/40 dark:text-d-ink'} transition active:scale-90`}
      >
        <IcHeart width={16} height={16} filled={fav} />
      </button>

      {/* body */}
      <div className="flex flex-1 flex-col p-2.5">
        {product.brand && (
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted dark:text-d-muted">{product.brand}</span>
        )}
        <Link to={`/product/${product.id}`} className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-ink dark:text-d-ink">
          {product.name}
        </Link>
        <div className="mt-1">
          <Rating value={product.rating} count={product.reviews_count} />
        </div>

        <div className="mt-auto flex items-end justify-between pt-2.5">
          <div className="leading-tight">
            <div className="font-display text-[15px] font-extrabold text-ink dark:text-d-ink">{money(v.price)}</div>
            {v.old_price && (
              <div className="text-[11px] text-muted line-through dark:text-d-muted">{money(v.old_price)}</div>
            )}
          </div>
          <button
            onClick={() => add(product, v)}
            aria-label="Savatga qo‘shish"
            className="grid h-9 w-9 place-items-center rounded-btn bg-primary text-white shadow-soft transition active:scale-90 active:animate-pop"
          >
            <IcPlus width={18} height={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-square rounded-none" />
      <div className="space-y-2 p-2.5">
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="skeleton h-4 w-2/5 rounded" />
      </div>
    </div>
  );
}
