'use client';

import { useEffect, useState } from 'react';
import type { Activity, Species } from '@/lib/types';
import {
  PERIOD_META,
  isActiveNow,
  samuiHour,
  samuiPeriod,
  type SamuiPeriod,
} from '@/lib/time';
import { SpeciesGrid } from '@/components/species/SpeciesGrid';

const SIGNATURE: Record<SamuiPeriod, Activity> = {
  aube: 'diurne',
  jour: 'diurne',
  crepuscule: 'nocturne',
  nuit: 'nocturne',
};

export function ActiveNow({ species }: { species: Species[] }) {
  // Calcul côté client uniquement (heure réelle) → évite tout décalage d'hydratation.
  const [period, setPeriod] = useState<SamuiPeriod | null>(null);
  useEffect(() => setPeriod(samuiPeriod()), []);

  return (
    <section className="border-y border-line bg-lacquer/30">
      <div className="container-editorial py-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
              </span>
              En temps réel — Koh Samui
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ivory">
              Actives en ce moment
            </h2>
          </div>
          {period && (
            <div className="flex items-center gap-2 rounded-full border border-line bg-night/50 px-4 py-2">
              <span className="text-lg" aria-hidden>
                {PERIOD_META[period].icon}
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-gold">
                {PERIOD_META[period].label}
              </span>
            </div>
          )}
        </div>

        {period === null ? (
          <div className="h-64 animate-pulse rounded-[var(--radius-lg)] bg-lacquer" />
        ) : (
          <ActiveContent species={species} period={period} />
        )}
      </div>
    </section>
  );
}

function ActiveContent({
  species,
  period,
}: {
  species: Species[];
  period: SamuiPeriod;
}) {
  const active = species.filter((s) => isActiveNow(s.activity, period));
  const sig = SIGNATURE[period];
  const sorted = [...active].sort(
    (a, b) => Number(b.activity === sig) - Number(a.activity === sig),
  );
  // Rotation douce au fil de la journée pour varier la sélection.
  const start = sorted.length ? (samuiHour() * 4) % sorted.length : 0;
  const picked = [...sorted.slice(start), ...sorted.slice(0, start)].slice(0, 8);

  return (
    <>
      <p className="mb-6 max-w-xl text-sm leading-relaxed text-sand">
        {PERIOD_META[period].blurb} {picked.length} espèces à guetter là,
        maintenant.
      </p>
      <SpeciesGrid species={picked} />
    </>
  );
}
