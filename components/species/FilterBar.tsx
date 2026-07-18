'use client';

import { useState } from 'react';
import type {
  Category,
  DangerLevel,
  ObservationZone,
} from '@/lib/types';
import type { SpeciesFilter } from '@/lib/filters';
import { CATEGORIES, DANGERS, ZONES } from '@/data/taxonomy';
import { Chip } from '@/components/ui/Chip';
import { SearchInput } from '@/components/ui/SearchInput';
import { cn } from '@/lib/cn';

interface Props {
  filter: SpeciesFilter;
  count: number;
  total: number;
  active: boolean;
  onToggleCategory: (c: Category) => void;
  onToggleDanger: (d: DangerLevel) => void;
  onToggleZone: (z: ObservationZone) => void;
  onQuery: (q: string) => void;
  onReset: () => void;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-full font-mono text-[11px] uppercase tracking-wider text-sand/80 sm:w-20">
        {label}
      </span>
      {children}
    </div>
  );
}

export function FilterBar({
  filter,
  count,
  total,
  active,
  onToggleCategory,
  onToggleDanger,
  onToggleZone,
  onQuery,
  onReset,
}: Props) {
  const [open, setOpen] = useState(false);
  const activeCount =
    filter.categories.length + filter.dangers.length + filter.zones.length;

  return (
    <div className="sticky top-[calc(var(--header-h)_+_env(safe-area-inset-top)_+_8px)] z-30 rounded-[var(--radius-lg)] border border-line bg-lacquer shadow-card">
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        {/* Recherche — toujours visible */}
        <div className="flex items-center gap-3">
          <SearchInput
            value={filter.query}
            onChange={(e) => onQuery(e.target.value)}
            onClear={() => onQuery('')}
            placeholder="Rechercher (nom commun ou latin)…"
            aria-label="Rechercher une espèce"
          />
          <span className="hidden whitespace-nowrap font-mono text-xs text-sand sm:block">
            {count} / {total}
          </span>
          {/* Bascule filtres — mobile uniquement */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex shrink-0 items-center gap-2 rounded-full border border-line px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-ivory sm:hidden"
          >
            Filtres
            {activeCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] text-night">
                {activeCount}
              </span>
            )}
            <svg
              className={cn('h-3 w-3 transition-transform', open && 'rotate-180')}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden
            >
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Filtres — repliés sur mobile, toujours visibles ≥ sm */}
        <div className={cn('flex-col gap-4', open ? 'flex' : 'hidden sm:flex')}>
          <Row label="Catégorie">
            {CATEGORIES.map((c) => (
              <Chip
                key={c.key}
                active={filter.categories.includes(c.key)}
                onClick={() => onToggleCategory(c.key)}
              >
                {c.icon} {c.label}
              </Chip>
            ))}
          </Row>

          <Row label="Danger">
            {DANGERS.map((d) => (
              <Chip
                key={d.level}
                tone={d.cls}
                active={filter.dangers.includes(d.level)}
                onClick={() => onToggleDanger(d.level)}
              >
                {d.label}
              </Chip>
            ))}
          </Row>

          <Row label="Lieu">
            {ZONES.map((z) => (
              <Chip
                key={z.key}
                active={filter.zones.includes(z.key)}
                onClick={() => onToggleZone(z.key)}
              >
                {z.label}
              </Chip>
            ))}
          </Row>

          <div className="flex items-center justify-between border-t border-line pt-3">
            <span className="font-mono text-xs text-sand sm:hidden">
              {count} / {total} affichés
            </span>
            <button
              type="button"
              onClick={onReset}
              disabled={!active}
              className="ml-auto font-mono text-[11px] uppercase tracking-wider text-gold underline-offset-4 hover:underline disabled:opacity-40"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
