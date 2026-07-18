/**
 * Récupération d'observations réelles géolocalisées depuis l'API iNaturalist
 * (gratuite, sans clé, CORS ouvert). Utilisée au build par
 * scripts/fetch-observations.ts.
 *
 * Toutes les données proviennent d'iNaturalist ; chaque observation conserve
 * l'auteur, la licence et l'URL source pour l'attribution.
 */
import type { Observation } from '@/lib/types';
import { cleanTaxon } from '@/lib/wikimedia';

const API = 'https://api.inaturalist.org/v1/observations';
const USER_AGENT = 'KoikaSamui/1.0 (contact@sarange.fr)';

// Centre de l'archipel + rayon couvrant Samui, Phangan, Tao et Ang Thong.
export const ARCHIPELAGO = { lat: 9.75, lng: 99.95, radiusKm: 70 };

function licenseLabel(code?: string): string {
  if (!code) return 'Tous droits réservés';
  const c = code.toLowerCase();
  if (c === 'cc0') return 'CC0';
  if (c.startsWith('cc-')) return c.replace('cc-', 'CC ').toUpperCase();
  return code;
}

function toObservation(r: any): Observation | null {
  let lat: number | undefined;
  let lng: number | undefined;
  const coords = r?.geojson?.coordinates;
  if (Array.isArray(coords) && coords.length === 2) {
    lng = Number(coords[0]);
    lat = Number(coords[1]);
  } else if (typeof r?.location === 'string') {
    const [la, ln] = r.location.split(',').map(Number);
    lat = la;
    lng = ln;
  }
  if (lat === undefined || lng === undefined || Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  const photo: string | undefined = r?.photos?.[0]?.url;
  return {
    id: Number(r.id),
    lat,
    lng,
    date: r?.observed_on ?? '',
    observer: r?.user?.name || r?.user?.login || 'Observateur',
    license: licenseLabel(r?.license_code),
    url: r?.uri ?? `https://www.inaturalist.org/observations/${r.id}`,
    photoUrl: photo ? photo.replace('/square.', '/small.') : undefined,
    placeGuess: r?.place_guess ?? undefined,
  };
}

export interface FetchObservationsOptions {
  /** terme de taxon prioritaire (sinon dérivé du nom latin) */
  query?: string;
  limit?: number;
}

/** Observations récentes et vérifiables d'un taxon près de Koh Samui. */
export async function fetchObservations(
  latinName: string,
  opts: FetchObservationsOptions = {},
): Promise<Observation[]> {
  const taxon = opts.query ?? cleanTaxon(latinName);
  if (!taxon) return [];

  const url = new URL(API);
  const params: Record<string, string> = {
    taxon_name: taxon,
    lat: String(ARCHIPELAGO.lat),
    lng: String(ARCHIPELAGO.lng),
    radius: String(ARCHIPELAGO.radiusKm),
    verifiable: 'true',
    geo: 'true',
    photos: 'true',
    order_by: 'observed_on',
    order: 'desc',
    per_page: String(opts.limit ?? 25),
  };
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`iNaturalist → HTTP ${res.status}`);
  const data = await res.json();
  const results: any[] = data?.results ?? [];
  return results.map(toObservation).filter((o): o is Observation => o !== null);
}

/** URL de recherche iNaturalist (bouton « voir toutes les observations »). */
export function inaturalistSearchUrl(latinName: string, query?: string): string {
  const taxon = query ?? cleanTaxon(latinName);
  const u = new URL('https://www.inaturalist.org/observations');
  u.searchParams.set('taxon_name', taxon);
  u.searchParams.set('lat', String(ARCHIPELAGO.lat));
  u.searchParams.set('lng', String(ARCHIPELAGO.lng));
  u.searchParams.set('radius', String(ARCHIPELAGO.radiusKm));
  u.searchParams.set('verifiable', 'true');
  return u.toString();
}
