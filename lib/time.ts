import type { Activity } from '@/lib/types';

export type SamuiPeriod = 'aube' | 'jour' | 'crepuscule' | 'nuit';

/** Heure locale (0–23) à Koh Samui (Asia/Bangkok, UTC+7, sans heure d'été). */
export function samuiHour(date: Date = new Date()): number {
  const h = new Intl.DateTimeFormat('fr-FR', {
    hour: 'numeric',
    hour12: false,
    timeZone: 'Asia/Bangkok',
  }).format(date);
  return parseInt(h, 10) % 24;
}

/** Période du jour à Koh Samui. */
export function samuiPeriod(date: Date = new Date()): SamuiPeriod {
  const h = samuiHour(date);
  if (h >= 5 && h < 7) return 'aube';
  if (h >= 7 && h < 18) return 'jour';
  if (h >= 18 && h < 20) return 'crepuscule';
  return 'nuit';
}

export const PERIOD_META: Record<
  SamuiPeriod,
  { label: string; blurb: string; icon: string }
> = {
  aube: {
    label: 'Aube',
    icon: '🌅',
    blurb: 'Le réveil de l’archipel — la faune diurne s’active.',
  },
  jour: {
    label: 'Plein jour',
    icon: '☀️',
    blurb: 'Oiseaux, primates et vie du récif à leur pic d’activité.',
  },
  crepuscule: {
    label: 'Crépuscule',
    icon: '🌆',
    blurb: 'L’heure charnière : la faune nocturne prend le relais.',
  },
  nuit: {
    label: 'Nuit',
    icon: '🌙',
    blurb: 'Chasseurs nocturnes, geckos et lucioles entrent en scène.',
  },
};

/** Les rythmes d'activité « actifs » pour une période donnée. */
const ACTIVE_BY_PERIOD: Record<SamuiPeriod, Activity[]> = {
  aube: ['diurne', 'crepusculaire', 'variable'],
  jour: ['diurne', 'variable'],
  crepuscule: ['nocturne', 'crepusculaire', 'variable'],
  nuit: ['nocturne', 'variable'],
};

export function isActiveNow(activity: Activity, period: SamuiPeriod): boolean {
  return ACTIVE_BY_PERIOD[period].includes(activity);
}
