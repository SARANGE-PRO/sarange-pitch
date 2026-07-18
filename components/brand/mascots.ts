/**
 * Mascotte KoïKoSamui — un naturaliste de terrain, décliné en 5 poses.
 * Une pose différente selon la page où l'on se trouve.
 */
export interface Mascot {
  src: string;
  w: number;
  h: number;
  /** description accessible de la pose */
  alt: string;
}

export const MASCOTS = {
  lanterne: {
    src: '/brand/mascot-lanterne.png',
    w: 300,
    h: 560,
    alt: 'Mascotte KoïKoSamui, lanterne et carnet en main',
  },
  loupe: {
    src: '/brand/mascot-loupe.png',
    w: 256,
    h: 560,
    alt: 'Mascotte KoïKoSamui observant à la loupe',
  },
  observe: {
    src: '/brand/mascot-observe.png',
    w: 325,
    h: 560,
    alt: 'Mascotte KoïKoSamui accroupie examinant un lézard',
  },
  lizard: {
    src: '/brand/mascot-lizard.png',
    w: 300,
    h: 560,
    alt: 'Mascotte KoïKoSamui tenant un lézard',
  },
  carte: {
    src: '/brand/mascot-carte.png',
    w: 380,
    h: 560,
    alt: 'Mascotte KoïKoSamui avec carte et boussole',
  },
} satisfies Record<string, Mascot>;

/** Pose de mascotte associée à la page courante. */
export function mascotForPath(pathname: string): Mascot {
  if (pathname.startsWith('/especes/')) return MASCOTS.observe;
  if (pathname.startsWith('/especes')) return MASCOTS.loupe;
  if (pathname.startsWith('/biomes')) return MASCOTS.lizard;
  if (pathname.startsWith('/carte')) return MASCOTS.carte;
  if (pathname.startsWith('/a-propos')) return MASCOTS.lanterne;
  return MASCOTS.lanterne; // accueil
}
