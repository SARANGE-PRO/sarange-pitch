'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  Category,
  DangerLevel,
  ObservationZone,
  Species,
} from '@/lib/types';
import {
  EMPTY_FILTER,
  applyFilter,
  filterToSearchParams,
  isFilterActive,
  type SpeciesFilter,
} from '@/lib/filters';
import { CATEGORIES } from '@/data/taxonomy';
import { FilterBar } from './FilterBar';
import { SpeciesGrid } from './SpeciesGrid';

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export function SpeciesExplorer({
  species,
  initialFilter,
}: {
  species: Species[];
  initialFilter: SpeciesFilter;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<SpeciesFilter>(initialFilter);

  const filtered = useMemo(
    () => applyFilter(species, filter),
    [species, filter],
  );
  const active = isFilterActive(filter);

  // Synchronise l'URL (partage des filtres) — remplacement débounced.
  useEffect(() => {
    const t = setTimeout(() => {
      const qs = filterToSearchParams(filter).toString();
      router.replace(qs ? `/especes?${qs}` : '/especes', { scroll: false });
    }, 200);
    return () => clearTimeout(t);
  }, [filter, router]);

  const grouped = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        cat,
        items: filtered.filter((s) => s.category === cat.key),
      })).filter((g) => g.items.length > 0),
    [filtered],
  );

  return (
    <div className="flex flex-col gap-8">
      <FilterBar
        filter={filter}
        count={filtered.length}
        total={species.length}
        active={active}
        onToggleCategory={(c: Category) =>
          setFilter((f) => ({ ...f, categories: toggle(f.categories, c) }))
        }
        onToggleDanger={(d: DangerLevel) =>
          setFilter((f) => ({ ...f, dangers: toggle(f.dangers, d) }))
        }
        onToggleZone={(z: ObservationZone) =>
          setFilter((f) => ({ ...f, zones: toggle(f.zones, z) }))
        }
        onQuery={(q: string) => setFilter((f) => ({ ...f, query: q }))}
        onReset={() => setFilter(EMPTY_FILTER)}
      />

      {filtered.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-line py-20 text-center font-mono text-sm text-sand">
          Aucun spécimen ne correspond à ces filtres.
          <br />
          Essayez d’en retirer un.
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {grouped.map(({ cat, items }) => (
            <section key={cat.key} aria-labelledby={`grp-${cat.key}`}>
              <div className="mb-4 flex items-baseline gap-3 border-b border-line pb-2">
                <h2
                  id={`grp-${cat.key}`}
                  className="font-display text-xl font-semibold text-ivory"
                >
                  {cat.icon} {cat.label}
                </h2>
                <span className="font-mono text-xs text-sand">
                  ({items.length})
                </span>
              </div>
              <SpeciesGrid species={items} />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
