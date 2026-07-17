import type {
  Category,
  DangerLevel,
  ObservationZone,
  Species,
} from '@/lib/types';

export interface SpeciesFilter {
  categories: Category[];
  dangers: DangerLevel[];
  zones: ObservationZone[];
  query: string;
}

export const EMPTY_FILTER: SpeciesFilter = {
  categories: [],
  dangers: [],
  zones: [],
  query: '',
};

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** Un item passe-t-il le filtre ? */
export function matchesFilter(item: Species, filter: SpeciesFilter): boolean {
  if (filter.categories.length && !filter.categories.includes(item.category)) {
    return false;
  }
  if (filter.dangers.length && !filter.dangers.includes(item.danger)) {
    return false;
  }
  if (
    filter.zones.length &&
    !item.zones.some((z) => filter.zones.includes(z))
  ) {
    return false;
  }
  if (filter.query.trim()) {
    const q = normalize(filter.query.trim());
    if (
      !normalize(item.commonName).includes(q) &&
      !normalize(item.latinName).includes(q)
    ) {
      return false;
    }
  }
  return true;
}

export function applyFilter(
  items: Species[],
  filter: SpeciesFilter,
): Species[] {
  return items.filter((i) => matchesFilter(i, filter));
}

export function isFilterActive(filter: SpeciesFilter): boolean {
  return (
    filter.categories.length > 0 ||
    filter.dangers.length > 0 ||
    filter.zones.length > 0 ||
    filter.query.trim().length > 0
  );
}

/* ----------------------------- URL query params ----------------------------- */

type SearchParams = Record<string, string | string[] | undefined>;

function parseList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value.join(',') : value;
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const CATEGORY_VALUES: Category[] = [
  'mammifere',
  'reptile',
  'oiseau',
  'arthropode',
  'insecte',
  'marine',
];
const ZONE_VALUES: ObservationZone[] = [
  'terre',
  'air',
  'recif',
  'large',
  'urbain',
];

export function filterFromSearchParams(params: SearchParams): SpeciesFilter {
  const categories = parseList(params.categorie).filter((c): c is Category =>
    CATEGORY_VALUES.includes(c as Category),
  );
  const zones = parseList(params.lieu).filter((z): z is ObservationZone =>
    ZONE_VALUES.includes(z as ObservationZone),
  );
  const dangers = parseList(params.danger)
    .map((d) => Number(d))
    .filter((d): d is DangerLevel => d === 0 || d === 1 || d === 2);
  const query = typeof params.q === 'string' ? params.q : '';

  return { categories, dangers, zones, query };
}

export function filterToSearchParams(filter: SpeciesFilter): URLSearchParams {
  const params = new URLSearchParams();
  if (filter.categories.length) params.set('categorie', filter.categories.join(','));
  if (filter.dangers.length) params.set('danger', filter.dangers.join(','));
  if (filter.zones.length) params.set('lieu', filter.zones.join(','));
  if (filter.query.trim()) params.set('q', filter.query.trim());
  return params;
}
