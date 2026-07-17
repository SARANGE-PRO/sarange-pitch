import type { ObservationSpot, Species } from '@/lib/types';
import { SITES, type Site } from '@/data/locations';

/**
 * Points d'observation d'une espèce sur la carte.
 * - si l'espèce déclare des spots précis, on les utilise ;
 * - sinon on dérive des sites réels dont la zone recoupe celles de l'espèce.
 */
export function getSpeciesSpots(species: Species): ObservationSpot[] {
  if (species.observationSpots && species.observationSpots.length) {
    return species.observationSpots;
  }
  return SITES.filter((site) =>
    site.zones.some((z) => species.zones.includes(z)),
  ).map((site) => ({ name: site.name, lat: site.lat, lng: site.lng }));
}

/** Sites réels compatibles avec les zones d'une espèce. */
export function getSitesForSpecies(species: Species): Site[] {
  return SITES.filter((site) =>
    site.zones.some((z) => species.zones.includes(z)),
  );
}

/** Toutes les espèces plausibles sur un site (via recoupement de zones). */
export function getSpeciesForSite(site: Site, species: Species[]): Species[] {
  return species.filter((s) => s.zones.some((z) => site.zones.includes(z)));
}
