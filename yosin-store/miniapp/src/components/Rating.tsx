import { IcStar } from './Icons';

// Compact star rating. Renders 5 stars with a partial fill on the fractional one.
export function Rating({ value, size = 14, showValue = true, count }: {
  value: number;
  size?: number;
  showValue?: boolean;
  count?: number;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-amber-500">
      <span className="flex">
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = value >= i + 1;
          const half = !filled && value > i + 0.25;
          return <IcStar key={i} width={size} height={size} filled={filled} half={half} />;
        })}
      </span>
      {showValue && <span className="text-xs font-semibold text-ink dark:text-d-ink">{value.toFixed(1)}</span>}
      {count != null && <span className="text-xs text-muted dark:text-d-muted">({count})</span>}
    </span>
  );
}
