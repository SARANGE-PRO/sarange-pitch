/**
 * Modèle de données — KoïKoSamui
 */

/** 0 = sûr · 1 = prudence · 2 = dangereux */
export type DangerLevel = 0 | 1 | 2;

export type Category =
  | 'mammifere'
  | 'reptile'
  | 'oiseau'
  | 'arthropode'
  | 'insecte'
  | 'marine';

/** Zone d'observation principale */
export type ObservationZone = 'terre' | 'air' | 'recif' | 'large' | 'urbain';

/** Rythme d'activité (pour la mise en avant selon l'heure de Koh Samui) */
export type Activity = 'diurne' | 'nocturne' | 'crepusculaire' | 'variable';

export interface PhotoCredit {
  url: string;
  photographer: string;
  license: string; // ex: "CC BY-SA 4.0"
  sourceUrl: string; // page Wikimedia/iNaturalist d'origine
  /** true si la photo illustre une espèce proche faute de photo de l'espèce exacte */
  approximate?: boolean;
  /** nom réellement photographié quand approximate = true */
  depicts?: string;
}

export interface ObservationSpot {
  name: string;
  lat: number;
  lng: number;
}

export interface Species {
  slug: string;
  commonName: string;
  latinName: string;
  category: Category;
  danger: DangerLevel;
  zones: ObservationZone[];
  /** rythme d'activité */
  activity: Activity;
  /** emoji du carnet de terrain (repère visuel de secours) */
  icon: string;
  shortNote: string; // description courte (liste)
  longDescription: string; // description détaillée (fiche)
  photos: PhotoCredit[];
  observationSpots?: ObservationSpot[];
}

/** Observation réelle géolocalisée (iNaturalist). */
export interface Observation {
  id: number;
  lat: number;
  lng: number;
  date: string; // YYYY-MM-DD (ou '')
  observer: string;
  license: string; // ex: "CC BY-NC"
  url: string; // page de l'observation sur iNaturalist
  photoUrl?: string;
  placeGuess?: string;
}

/** Enregistrement sonore (cri / chant) d'une espèce. */
export interface SoundClip {
  url: string; // fichier audio (mp3/m4a/wav)
  recordist: string;
  license: string; // ex: "CC BY-NC"
  source: 'xeno-canto' | 'iNaturalist';
  sourceUrl: string; // page d'origine
}

export interface CategoryMeta {
  key: Category;
  label: string;
  icon: string;
  blurb: string;
}

export interface DangerMeta {
  level: DangerLevel;
  label: string;
  cls: 'safe' | 'caution' | 'danger';
  description: string;
}

export interface ZoneMeta {
  key: ObservationZone;
  label: string;
}
