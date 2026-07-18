'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import Link from 'next/link';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { SiteMarker } from './MapMarker';
import { cn } from '@/lib/cn';

export interface MapPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  tone?: 'gold' | 'teal';
  blurb?: string;
  href?: string;
  /** espèces cliquables listées dans la popup */
  species?: { name: string; slug: string }[];
  /** libellé de repli si la liste d'espèces est tronquée */
  moreLabel?: string;
  /** libellé du lien (défaut « Voir la fiche → ») */
  hrefLabel?: string;
  /** lien externe (nouvel onglet) plutôt que navigation interne */
  external?: boolean;
  /** vignette (observation iNaturalist) */
  photoUrl?: string;
}

function FitBounds({ points }: { points: MapPoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0]!.lat, points[0]!.lng], 11);
      return;
    }
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 11 });
  }, [map, points]);
  return null;
}

export default function IslandMap({
  points,
  center = [9.78, 99.93],
  zoom = 9,
  className,
  fit = false,
  activeId,
}: {
  points: MapPoint[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  fit?: boolean;
  activeId?: string;
}) {
  return (
    <div className={cn('h-full w-full', className)}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ background: '#0B1A15' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />
        {fit && <FitBounds points={points} />}
        {points.map((p) => (
          <SiteMarker
            key={p.id}
            position={[p.lat, p.lng]}
            tone={p.tone ?? 'gold'}
            active={p.id === activeId}
          >
            <div className="min-w-[170px] max-w-[230px]">
              {p.photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.photoUrl}
                  alt=""
                  className="mb-2 h-24 w-full rounded object-cover"
                />
              )}
              <p className="font-display text-sm font-semibold text-ivory">
                {p.name}
              </p>
              {p.blurb && (
                <p className="mt-1 text-xs leading-relaxed text-sand">{p.blurb}</p>
              )}
              {p.species && p.species.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
                  {p.species.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/especes/${s.slug}`}
                        className="font-mono text-[11px] text-gold hover:underline"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                  {p.moreLabel && (
                    <li className="font-mono text-[11px] text-sand">
                      {p.moreLabel}
                    </li>
                  )}
                </ul>
              )}
              {p.href &&
                (p.external ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block font-mono text-[11px] uppercase tracking-wider text-gold hover:underline"
                  >
                    {p.hrefLabel ?? 'Voir →'}
                  </a>
                ) : (
                  <Link
                    href={p.href}
                    className="mt-2 inline-block font-mono text-[11px] uppercase tracking-wider text-gold hover:underline"
                  >
                    {p.hrefLabel ?? 'Voir la fiche →'}
                  </Link>
                ))}
            </div>
          </SiteMarker>
        ))}
      </MapContainer>
    </div>
  );
}
