'use client';

import type {
  Category,
  DangerLevel,
  ObservationZone,
} from '@/lib/types';
import type { SpeciesFilter } from '@/lib/filters';
import { CATEGORIES, DANGERS, ZONES } from '@/data/taxonomy';
import { Chip } from '@/components/ui/Chip';
import { SearchInput } from '@/components/ui/SearchInput';

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
  return (
    <div className="sticky top-[calc(var(--header-h)+8px)] z-20 rounded-[var(--radius-lg)] border border-line bg-lacquer/85 p-4 backdrop-blur-md sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <SearchInput
            value={filter.query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Rechercher un animal (nom commun ou latin)…"
            aria-label="Rechercher une espèce"
          />
          <span className="hidden whitespace-nowrap font-mono text-xs text-sand sm:block">
            {count} / {total}
          </span>
        </div>

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
  );
}
