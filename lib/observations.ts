import type { Observation } from '@/lib/types';
import observationsJson from '@/data/observations.json';

/**
 * Observations réelles par espèce (data/observations.json, généré par
 * scripts/fetch-observations.ts). Vide tant que le script n'a pas tourné.
 */
const observations = observationsJson as Record<string, Observation[]>;

export function getObservations(slug: string): Observation[] {
  return observations[slug] ?? [];
}

export function hasObservations(slug: string): boolean {
  return (observations[slug]?.length ?? 0) > 0;
}
