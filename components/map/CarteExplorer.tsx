'use client';

import { useMemo, useState } from 'react';
import type { Category, Species } from '@/lib/types';
import { SITES, ISLANDS } from '@/data/locations';
import { CATEGORIES } from '@/data/taxonomy';
import { Chip } from '@/components/ui/Chip';
import { MapView } from './MapView';
import type { MapPoint } from './IslandMap';

const CAP = 6;

export function CarteExplorer({ species }: { species: Species[] }) {
  const [category, setCategory] = useState<Category | 'all'>('all');

  const matches = (s: Species) => category === 'all' || s.category === category;

  const sitePoints: MapPoint[] = useMemo(() => {
    return SITES.map((site) => {
      const here = species.filter(
        (s) => matches(s) && s.zones.some((z) => site.zones.includes(z)),
      );
      const shown = here.slice(0, CAP);
      return {
        id: site.id,
        name: site.name,
        lat: site.lat,
        lng: site.lng,
        tone: 'gold' as const,
        blurb: site.blurb,
        species: shown.map((s) => ({ name: s.commonName, slug: s.slug })),
        moreLabel:
          here.length > CAP ? `+${here.length - CAP} autres` : undefined,
      };
    }).filter((p) => p.species && p.species.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, species]);

  const islandPoints: MapPoint[] = ISLANDS.map((i) => ({
    id: `island-${i.id}`,
    name: i.name,
    lat: i.lat,
    lng: i.lng,
    tone: 'teal' as const,
    blurb: i.blurb,
  }));

  const points = [...islandPoints, ...sitePoints];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[11px] uppercase tracking-wider text-sand/80">
          Filtrer
        </span>
        <Chip active={category === 'all'} onClick={() => setCategory('all')}>
          Tout
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip
            key={c.key}
            active={category === c.key}
            onClick={() => setCategory(c.key)}
          >
            {c.icon} {c.label}
          </Chip>
        ))}
      </div>

      <MapView
        points={points}
        center={[9.78, 99.93]}
        zoom={9}
        wrapperClassName="h-[60vh] min-h-[420px]"
      />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-sand">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-teal" /> Îles de l’archipel
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-gold" /> Sites d’observation
        </span>
        <span className="text-sand/70">
          {sitePoints.length} site(s) actif(s) — cliquez un marqueur pour la liste
          des espèces.
        </span>
      </div>
    </div>
  );
}
