'use client';

import dynamic from 'next/dynamic';
import type { MapPoint } from './IslandMap';
import { cn } from '@/lib/cn';

function MapSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-lacquer-2">
      <span className="font-mono text-xs uppercase tracking-wider text-sand/60">
        Chargement de la carte…
      </span>
    </div>
  );
}

const DynamicMap = dynamic(() => import('./IslandMap'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

interface Props {
  points: MapPoint[];
  center?: [number, number];
  zoom?: number;
  fit?: boolean;
  activeId?: string;
  wrapperClassName?: string;
}

/** Enveloppe client de la carte Leaflet (rendu sans SSR). */
export function MapView({ wrapperClassName, ...props }: Props) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-lg)] border border-line',
        wrapperClassName,
      )}
    >
      <DynamicMap {...props} className="h-full w-full" />
    </div>
  );
}
