import type { PhotoCredit, Species } from '@/lib/types';
import { speciesBase } from '@/data/species';
import { ACTIVITY } from '@/data/activity';
import photosJson from '@/data/photos.json';

/**
 * Fusionne les données de base des espèces avec les photos récupérées
 * (data/photos.json, généré par scripts/fetch-images.ts) et le rythme d'activité.
 */
const photos = photosJson as Record<string, PhotoCredit[]>;

export const allSpecies: Species[] = speciesBase.map((base) => ({
  ...base,
  photos: photos[base.slug] ?? [],
  activity: ACTIVITY[base.slug] ?? 'variable',
}));

const bySlug = new Map(allSpecies.map((s) => [s.slug, s]));
const slugIndex = new Map(allSpecies.map((s, i) => [s.slug, i + 1]));

/** Numéro de spécimen (1-based) stable dans le catalogue complet. */
export function specimenNumber(slug: string): number {
  return slugIndex.get(slug) ?? 0;
}

/** Espèces précédente / suivante dans le catalogue (navigation de fiche). */
export function getAdjacentSpecies(slug: string): {
  prev?: Species;
  next?: Species;
} {
  const i = allSpecies.findIndex((s) => s.slug === slug);
  if (i === -1) return {};
  return { prev: allSpecies[i - 1], next: allSpecies[i + 1] };
}

export function getAllSpecies(): Species[] {
  return allSpecies;
}

export function getSpeciesBySlug(slug: string): Species | undefined {
  return bySlug.get(slug);
}

export function getAllSlugs(): string[] {
  return allSpecies.map((s) => s.slug);
}

/** Première photo disponible d'une espèce (ou undefined). */
export function primaryPhoto(species: Species): PhotoCredit | undefined {
  return species.photos[0];
}

/**
 * Espèces proches d'une espèce donnée : même catégorie en priorité,
 * complétées par les espèces partageant une zone d'observation.
 */
export function getSimilarSpecies(species: Species, limit = 4): Species[] {
  const sameCategory = allSpecies.filter(
    (s) => s.slug !== species.slug && s.category === species.category,
  );
  const sameZone = allSpecies.filter(
    (s) =>
      s.slug !== species.slug &&
      s.category !== species.category &&
      s.zones.some((z) => species.zones.includes(z)),
  );

  const seen = new Set<string>();
  const out: Species[] = [];
  for (const s of [...sameCategory, ...sameZone]) {
    if (seen.has(s.slug)) continue;
    seen.add(s.slug);
    out.push(s);
    if (out.length >= limit) break;
  }
  return out;
}

/** Compte des espèces par catégorie (pour l'accueil et les filtres). */
export function countByCategory(): Record<string, number> {
  return allSpecies.reduce<Record<string, number>>((acc, s) => {
    acc[s.category] = (acc[s.category] ?? 0) + 1;
    return acc;
  }, {});
}
