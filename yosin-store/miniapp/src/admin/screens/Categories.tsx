import { useAdmin } from '../AdminContext';
import { IcTag } from '../../components/Icons';

export function AdminCategories() {
  const { categories, products } = useAdmin();
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted dark:text-d-muted">{categories.length} ta kategoriya</p>
      <div className="space-y-2.5">
        {categories.map((c) => {
          const count = products.filter((p) => p.category_id === c.id).length;
          return (
            <div key={c.id} className="card flex items-center gap-3 p-3.5">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-tint text-xl dark:bg-primary/15">{c.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-ink dark:text-d-ink">{c.name}</div>
                <div className="text-xs text-muted dark:text-d-muted">{count} ta mahsulot · /{c.slug}</div>
              </div>
              <span className="text-muted dark:text-d-muted"><IcTag width={18} height={18} /></span>
            </div>
          );
        })}
      </div>
      <p className="px-1 text-xs text-muted dark:text-d-muted">
        Kategoriya qo‘shish/tahrirlash jonli backendda <code>/admin/categories</code> orqali ishlaydi.
      </p>
    </div>
  );
}
