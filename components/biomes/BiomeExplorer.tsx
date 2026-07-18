'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ObservationZone, Species } from '@/lib/types';
import { BIOMES, BIOME_BY_ZONE } from '@/data/biomes';
import { SpeciesGrid } from '@/components/species/SpeciesGrid';
import { cn } from '@/lib/cn';

export function BiomeExplorer({
  species,
  initialZone,
}: {
  species: Species[];
  initialZone: ObservationZone;
}) {
  const [zone, setZone] = useState<ObservationZone>(initialZone);
  const biome = BIOME_BY_ZONE[zone];

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const b of BIOMES)
      c[b.zone] = species.filter((s) => s.zones.includes(b.zone)).length;
    return c;
  }, [species]);

  const list = useMemo(
    () => species.filter((s) => s.zones.includes(zone)),
    [species, zone],
  );

  // URL partageable (?zone=…) sans rechargement.
  useEffect(() => {
    window.history.replaceState(null, '', `/biomes?zone=${zone}`);
  }, [zone]);

  return (
    <div className="flex flex-col gap-6">
      {/* Sélecteur de biomes */}
      <div
        className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Biomes"
      >
        {BIOMES.map((b) => {
          const active = b.zone === zone;
          return (
            <button
              key={b.zone}
              role="tab"
              aria-selected={active}
              onClick={() => setZone(b.zone)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-ui text-sm transition-all active:scale-95',
                active
                  ? 'bg-white/5'
                  : 'border-line text-sand hover:border-ivory/30 hover:text-ivory',
              )}
              style={
                active
                  ? { borderColor: b.accent, color: b.accent }
                  : undefined
              }
            >
              <span aria-hidden>{b.icon}</span>
              {b.name}
              <span className="font-mono text-[11px] opacity-70">
                {counts[b.zone]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scène immersive du biome (ré-animée à chaque changement) */}
      <div
        key={zone}
        className="page-enter kranok relative flex min-h-[36vh] flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] border border-line p-6 sm:p-8"
        style={{ background: biome.gradient }}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-16 h-72 w-72 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${biome.glow}, transparent 70%)` }}
          aria-hidden
        />
        <span
          className="pointer-events-none absolute -right-4 top-2 select-none text-[9rem] leading-none opacity-[0.12] sm:text-[13rem]"
          aria-hidden
        >
          {biome.icon}
        </span>

        <div className="relative max-w-2xl">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ color: biome.accent }}
          >
            Biome · {counts[zone]} espèces
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ivory sm:text-4xl">
            {biome.name}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-sand sm:text-[15px]">
            {biome.tagline}
          </p>
        </div>
      </div>

      {/* Faune du biome */}
      <div key={`grid-${zone}`} className="page-enter">
        <SpeciesGrid species={list} />
      </div>
    </div>
  );
}
