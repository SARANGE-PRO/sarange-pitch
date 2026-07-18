import type { ObservationZone } from '@/lib/types';

export interface Biome {
  zone: ObservationZone;
  name: string;
  tagline: string;
  icon: string;
  /** couleur d'accent du biome */
  accent: string;
  /** dégradé de fond de la scène */
  gradient: string;
  /** lueur d'ambiance (halo animé) */
  glow: string;
}

/**
 * Biomes de l'archipel, calqués sur les zones d'observation.
 * Un voyage de la terre à la mer, chacun avec son ambiance chromatique
 * (dans la palette Lanna Futur, assombrie pour rester nocturne).
 */
export const BIOMES: Biome[] = [
  {
    zone: 'terre',
    name: 'Jungle & forêt',
    tagline:
      "Des cascades de Na Muang aux sous-bois d'Ang Thong — primates, serpents et grands herbivores.",
    icon: '🌴',
    accent: '#4C9A6A',
    gradient:
      'radial-gradient(120% 100% at 18% -10%, rgba(76,154,106,0.24), transparent 60%), linear-gradient(180deg, #0d2018 0%, #0B1A15 70%)',
    glow: 'rgba(76,154,106,0.35)',
  },
  {
    zone: 'urbain',
    name: 'Village & maison',
    tagline:
      'Geckos tokay, mynahs et milans brahminy — la faune qui partage le quotidien des bourgs.',
    icon: '🏘️',
    accent: '#C9A227',
    gradient:
      'radial-gradient(120% 100% at 30% -10%, rgba(201,162,39,0.20), transparent 60%), linear-gradient(180deg, #17140c 0%, #0B1A15 70%)',
    glow: 'rgba(201,162,39,0.35)',
  },
  {
    zone: 'air',
    name: 'Canopée & ciel',
    tagline:
      'Rapaces côtiers, calaos et passereaux — le peuple ailé au-dessus de la cime et des criques.',
    icon: '🪶',
    accent: '#17A398',
    gradient:
      'radial-gradient(120% 100% at 80% -10%, rgba(23,163,152,0.22), transparent 60%), linear-gradient(180deg, #0b201d 0%, #0B1A15 70%)',
    glow: 'rgba(23,163,152,0.35)',
  },
  {
    zone: 'recif',
    name: 'Récif corallien',
    tagline:
      'Jardins de corail, poissons-clowns et stations de nettoyage — la vie foisonnante du platier.',
    icon: '🐠',
    accent: '#2BB8C4',
    gradient:
      'radial-gradient(120% 110% at 50% -10%, rgba(43,184,196,0.24), transparent 60%), linear-gradient(180deg, #082226 0%, #0B1A15 70%)',
    glow: 'rgba(43,184,196,0.4)',
  },
  {
    zone: 'large',
    name: 'Grand large',
    tagline:
      'Pinacles et bleu profond — requins-baleines, raies manta et barracudas du Golfe.',
    icon: '🌊',
    accent: '#3E88B8',
    gradient:
      'radial-gradient(120% 120% at 50% -12%, rgba(41,110,160,0.30), transparent 60%), linear-gradient(180deg, #07161f 0%, #0B1A15 70%)',
    glow: 'rgba(62,136,184,0.4)',
  },
];

export const BIOME_BY_ZONE: Record<ObservationZone, Biome> = Object.fromEntries(
  BIOMES.map((b) => [b.zone, b]),
) as Record<ObservationZone, Biome>;
