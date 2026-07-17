import type {
  CategoryMeta,
  DangerMeta,
  ZoneMeta,
  Category,
  DangerLevel,
  ObservationZone,
} from '@/lib/types';

export const CATEGORIES: CategoryMeta[] = [
  {
    key: 'mammifere',
    label: 'Mammifères',
    icon: '🐾',
    blurb: 'De la canopée aux fermes : primates, félins discrets et grands herbivores.',
  },
  {
    key: 'reptile',
    label: 'Reptiles',
    icon: '🦎',
    blurb: 'Geckos, varans et serpents — des couleuvres planeuses aux vipères des temples.',
  },
  {
    key: 'oiseau',
    label: 'Oiseaux',
    icon: '🪶',
    blurb: 'Rapaces côtiers, calaos de forêt et passereaux au chant familier.',
  },
  {
    key: 'arthropode',
    label: 'Arachnides & myriapodes',
    icon: '🕷️',
    blurb: 'Tisseuses dorées, chasseuses nocturnes et mille-pattes venimeux.',
  },
  {
    key: 'insecte',
    label: 'Insectes',
    icon: '🦋',
    blurb: 'Fourmis architectes, lucioles des khlongs et cigales des soirées tropicales.',
  },
  {
    key: 'marine',
    label: 'Vie marine',
    icon: '🐠',
    blurb: 'Du requin-baleine à l’hippocampe : le récif et le grand large du Golfe.',
  },
];

export const CATEGORY_BY_KEY: Record<Category, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c]),
) as Record<Category, CategoryMeta>;

export const DANGERS: DangerMeta[] = [
  {
    level: 0,
    label: 'Inoffensif',
    cls: 'safe',
    description: 'Aucun risque particulier pour un observateur respectueux.',
  },
  {
    level: 1,
    label: 'Prudence',
    cls: 'caution',
    description: 'Piqûre, morsure ou contact désagréable — gardez vos distances.',
  },
  {
    level: 2,
    label: 'Dangereux',
    cls: 'danger',
    description: 'Venin puissant ou blessure sérieuse possible — ne jamais approcher.',
  },
];

export const DANGER_BY_LEVEL: Record<DangerLevel, DangerMeta> = Object.fromEntries(
  DANGERS.map((d) => [d.level, d]),
) as Record<DangerLevel, DangerMeta>;

export const ZONES: ZoneMeta[] = [
  { key: 'terre', label: 'Terre / forêt' },
  { key: 'air', label: 'Air' },
  { key: 'recif', label: 'Récif' },
  { key: 'large', label: 'Large' },
  { key: 'urbain', label: 'Maison / village' },
];

export const ZONE_BY_KEY: Record<ObservationZone, ZoneMeta> = Object.fromEntries(
  ZONES.map((z) => [z.key, z]),
) as Record<ObservationZone, ZoneMeta>;
