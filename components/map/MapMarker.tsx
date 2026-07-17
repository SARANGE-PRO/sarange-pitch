'use client';

import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import type { ReactNode } from 'react';

type Tone = 'gold' | 'teal';

/** Icône DivIcon pulsante (aucun asset externe → pas de bug d'icône Leaflet). */
export function pulseIcon(tone: Tone, active = false): L.DivIcon {
  return L.divIcon({
    className: 'km-marker-wrap',
    html: `<span class="km-marker ${tone === 'teal' ? 'km-teal' : ''} ${
      active ? 'km-active' : ''
    }"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
}

export function SiteMarker({
  position,
  tone = 'gold',
  active = false,
  onClick,
  children,
}: {
  position: [number, number];
  tone?: Tone;
  active?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}) {
  return (
    <Marker
      position={position}
      icon={pulseIcon(tone, active)}
      eventHandlers={onClick ? { click: onClick } : undefined}
    >
      {children ? <Popup>{children}</Popup> : null}
    </Marker>
  );
}
