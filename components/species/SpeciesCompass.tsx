'use client';

import { useEffect, useRef, useState } from 'react';
import {
  bearingDeg,
  cardinal,
  distanceKm,
  formatDistance,
  type LatLng,
} from '@/lib/geo-math';
import { cn } from '@/lib/cn';

interface Spot {
  name: string;
  lat: number;
  lng: number;
}
type Status =
  | 'idle'
  | 'locating'
  | 'ready'
  | 'denied'
  | 'unavailable'
  | 'insecure';

interface EnrichedSpot extends Spot {
  distanceKm: number;
  bearing: number;
}

export function SpeciesCompass({
  spots,
  name,
}: {
  spots: Spot[];
  name: string;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [pos, setPos] = useState<LatLng | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const watchId = useRef<number | null>(null);
  const orientAttached = useRef(false);

  const onOrient = (e: DeviceOrientationEvent) => {
    const any = e as unknown as { webkitCompassHeading?: number };
    let hd: number | null = null;
    if (typeof any.webkitCompassHeading === 'number') {
      hd = any.webkitCompassHeading;
    } else if (e.absolute && typeof e.alpha === 'number') {
      hd = (360 - e.alpha) % 360;
    }
    if (hd !== null && !Number.isNaN(hd)) setHeading(hd);
  };

  const attachOrientation = () => {
    if (orientAttached.current) return;
    orientAttached.current = true;
    window.addEventListener('deviceorientationabsolute', onOrient as EventListener, true);
    window.addEventListener('deviceorientation', onOrient as EventListener, true);
  };

  const activate = async () => {
    // La géolocalisation exige un contexte sécurisé (HTTPS).
    if (typeof window !== 'undefined' && window.isSecureContext === false) {
      setStatus('insecure');
      return;
    }
    if (!('geolocation' in navigator)) {
      setStatus('unavailable');
      return;
    }

    // Permission capteur d'orientation (iOS).
    const DOE = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    try {
      if (DOE && typeof DOE.requestPermission === 'function') {
        const res = await DOE.requestPermission();
        if (res === 'granted') attachOrientation();
      } else {
        attachOrientation();
      }
    } catch {
      /* pas d'orientation → boussole statique */
    }

    setStatus('locating');
    const onOk = (p: GeolocationPosition) => {
      setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
      setStatus('ready');
    };
    const onErr = (err: GeolocationPositionError) => {
      setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable');
    };
    // Fix immédiat, puis suivi.
    navigator.geolocation.getCurrentPosition(onOk, onErr, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    });
    watchId.current = navigator.geolocation.watchPosition(onOk, () => {}, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 30000,
    });
  };

  useEffect(() => {
    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
      window.removeEventListener('deviceorientationabsolute', onOrient as EventListener, true);
      window.removeEventListener('deviceorientation', onOrient as EventListener, true);
    };
  }, []);

  const enriched: EnrichedSpot[] = pos
    ? [...spots]
        .map((s) => ({
          ...s,
          distanceKm: distanceKm(pos, s),
          bearing: bearingDeg(pos, s),
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm)
    : [];
  const nearest = enriched[0];
  const others = enriched.slice(1);
  const h = heading ?? 0;
  const far = nearest ? nearest.distanceKm > 300 : false;

  const errorMessage =
    status === 'denied'
      ? 'Localisation refusée. Autorise-la dans les réglages du site pour boussoler vers les lieux d’observation.'
      : status === 'insecure'
        ? 'La boussole nécessite une connexion sécurisée (HTTPS).'
        : status === 'unavailable'
          ? 'Localisation indisponible sur cet appareil ou ce navigateur.'
          : null;

  return (
    <div className="rounded-[var(--radius-lg)] border border-line bg-lacquer/40 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden>
            🧭
          </span>
          <h3 className="font-display text-sm font-semibold text-ivory">
            Boussole de terrain
          </h3>
        </div>
        {(status === 'idle' || errorMessage) && (
          <button
            type="button"
            onClick={activate}
            className="rounded-full border border-gold/50 px-3 py-1.5 font-ui text-xs text-gold transition-colors hover:bg-gold/10 active:scale-95"
          >
            {errorMessage ? 'Réessayer' : 'Activer'}
          </button>
        )}
      </div>

      {status === 'idle' && (
        <p className="mt-3 text-xs leading-relaxed text-sand">
          Sur place ? Active la boussole pour t’orienter vers les {spots.length}{' '}
          lieu{spots.length > 1 ? 'x' : ''} d’observation (position + capteurs du
          téléphone).
        </p>
      )}
      {status === 'locating' && (
        <p className="mt-3 animate-pulse font-mono text-xs text-sand">
          Localisation en cours…
        </p>
      )}
      {errorMessage && (
        <div className="mt-3">
          <p className="text-xs leading-relaxed text-amber-warn">{errorMessage}</p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-sand/70">
            Lieux d’observation
          </p>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {spots.map((s, i) => (
              <li
                key={`${s.name}-${i}`}
                className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-sand"
              >
                {s.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === 'ready' && nearest && (
        <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          {/* Cadran */}
          <div className="relative h-52 w-52 shrink-0 select-none rounded-full border-2 border-line bg-night/50">
            <div
              className="absolute inset-0 transition-transform duration-150 ease-out"
              style={{ transform: `rotate(${-h}deg)` }}
            >
              <span className="absolute left-1/2 top-2 -translate-x-1/2 font-mono text-xs font-bold text-laque">
                N
              </span>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[11px] text-sand">
                E
              </span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[11px] text-sand">
                S
              </span>
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[11px] text-sand">
                O
              </span>
            </div>

            {others.map((s, i) => (
              <div
                key={`${s.name}-${i}`}
                className="absolute inset-0 transition-transform duration-150 ease-out"
                style={{ transform: `rotate(${s.bearing - h}deg)` }}
              >
                <span
                  className="absolute left-1/2 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-night bg-teal"
                  title={`${s.name} · ${formatDistance(s.distanceKm)}`}
                />
              </div>
            ))}

            <div
              className="absolute inset-0 transition-transform duration-150 ease-out"
              style={{ transform: `rotate(${nearest.bearing - h}deg)` }}
            >
              <div className="absolute left-1/2 top-3 flex -translate-x-1/2 flex-col items-center">
                <div className="h-0 w-0 border-x-[7px] border-b-[13px] border-x-transparent border-b-gold" />
                <div className="h-[70px] w-[3px] bg-gradient-to-b from-gold to-gold/10" />
              </div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
              <span className="h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_10px_rgba(201,162,39,0.7)]" />
              <span className="mt-2 font-display text-xl font-semibold text-ivory">
                {formatDistance(nearest.distanceKm)}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-gold">
                {cardinal(nearest.bearing)}
              </span>
            </div>
          </div>

          {/* Liste des lieux */}
          <div className="w-full">
            {heading === null && (
              <p className="mb-2 font-mono text-[10px] leading-relaxed text-sand/70">
                Capteur de cap indisponible → boussole statique (Nord en haut).
              </p>
            )}
            {far && (
              <p className="mb-2 text-xs leading-relaxed text-amber-warn">
                Tu es loin de l’archipel — direction générale indiquée.
              </p>
            )}
            <ul className="flex flex-col gap-1.5">
              {enriched.map((s, i) => (
                <li
                  key={`${s.name}-${i}`}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-[var(--radius)] border px-3 py-2',
                    i === 0 ? 'border-gold/40 bg-gold/5' : 'border-line bg-night/30',
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className={cn(
                        'h-2 w-2 shrink-0 rounded-full',
                        i === 0 ? 'bg-gold' : 'bg-teal',
                      )}
                    />
                    <span className="truncate text-sm text-ivory">{s.name}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-sand">
                    {cardinal(s.bearing)} · {formatDistance(s.distanceKm)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
