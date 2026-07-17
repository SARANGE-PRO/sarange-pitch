import Link from 'next/link';
import type { CategoryMeta } from '@/lib/types';

export function CategoryCard({
  category,
  count,
}: {
  category: CategoryMeta;
  count: number;
}) {
  return (
    <Link
      href={`/especes?categorie=${category.key}`}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-[var(--radius-lg)] border border-line bg-lacquer p-5 transition-all duration-200 hover:-translate-y-1 hover:border-gold/40 hover:shadow-gold-halo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <div className="flex items-start justify-between">
        <span className="text-3xl transition-transform duration-300 group-hover:scale-110" aria-hidden>
          {category.icon}
        </span>
        <span className="font-mono text-xs text-sand">
          {String(count).padStart(2, '0')}
        </span>
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold text-ivory">
          {category.label}
        </h3>
        <p className="mt-1 text-[13px] leading-relaxed text-sand/90">
          {category.blurb}
        </p>
      </div>
      <span className="mt-auto font-mono text-[11px] uppercase tracking-wider text-gold opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        Explorer →
      </span>
    </Link>
  );
}
