import type { ObservationZone } from '@/lib/types';

export interface Island {
  id: string;
  name: string;
  lat: number;
  lng: number;
  blurb: string;
}

export interface Site {
  id: string;
  name: string;
  island: string; // id de l'île de rattachement
  lat: number;
  lng: number;
  zones: ObservationZone[];
  blurb: string;
}

/** Les quatre pôles de l'archipel du sud du Golfe de Thaïlande. */
export const ISLANDS: Island[] = [
  {
    id: 'samui',
    name: 'Koh Samui',
    lat: 9.512,
    lng: 100.013,
    blurb:
      "Île principale : plages, cocoteraies, forêt intérieure et villages animés.",
  },
  {
    id: 'phangan',
    name: 'Koh Phangan',
    lat: 9.735,
    lng: 100.024,
    blurb:
      "Reliefs boisés, cascades et mangroves ; nature plus préservée au nord.",
  },
  {
    id: 'tao',
    name: 'Koh Tao',
    lat: 10.096,
    lng: 99.84,
    blurb:
      "La « tortue » : capitale de la plongée, récifs accessibles et vie marine dense.",
  },
  {
    id: 'angthong',
    name: "Parc marin d'Ang Thong",
    lat: 9.617,
    lng: 99.655,
    blurb:
      "42 îles calcaires protégées : lagons, grottes, forêts primaires et faune sauvage.",
  },
];

export const ISLAND_BY_ID: Record<string, Island> = Object.fromEntries(
  ISLANDS.map((i) => [i.id, i]),
);

/** Centre géographique de l'archipel, pour le cadrage initial de la carte. */
export const ARCHIPELAGO_CENTER = { lat: 9.78, lng: 99.93 };

/** Sites d'observation réels de l'archipel. */
export const SITES: Site[] = [
  {
    id: 'na-muang',
    name: 'Cascades de Na Muang',
    island: 'samui',
    lat: 9.47,
    lng: 99.99,
    zones: ['terre'],
    blurb:
      "Forêt intérieure et cascades — macaques, calaos, serpents arboricoles et papillons.",
  },
  {
    id: 'bophut',
    name: 'Fisherman’s Village, Bophut',
    island: 'samui',
    lat: 9.564,
    lng: 100.062,
    zones: ['urbain', 'air'],
    blurb:
      "Village côtier — geckos tokay, mynahs, milans brahminy et chauves-souris au crépuscule.",
  },
  {
    id: 'chaweng-reef',
    name: 'Récif de Chaweng',
    island: 'samui',
    lat: 9.535,
    lng: 100.073,
    zones: ['recif'],
    blurb:
      "Platier corallien proche du rivage — poissons de récif, poissons-clowns et labres.",
  },
  {
    id: 'than-sadet',
    name: 'Forêt de Than Sadet',
    island: 'phangan',
    lat: 9.752,
    lng: 100.058,
    zones: ['terre'],
    blurb:
      "Vallée forestière et rivière royale — primates, varans et serpents des sous-bois.",
  },
  {
    id: 'phangan-mangrove',
    name: 'Mangroves de Chaloklum',
    island: 'phangan',
    lat: 9.752,
    lng: 100.012,
    zones: ['terre', 'urbain'],
    blurb:
      "Palétuviers du nord — chat pêcheur, martins-pêcheurs, lucioles et élaphes des mangroves.",
  },
  {
    id: 'sail-rock',
    name: 'Sail Rock (Hin Bai)',
    island: 'phangan',
    lat: 9.898,
    lng: 100.043,
    zones: ['large', 'recif'],
    blurb:
      "Pinacle mythique en pleine mer — requins-baleines, barracudas et bancs de carangues.",
  },
  {
    id: 'shark-bay',
    name: 'Shark Bay (Ao Thian Ok)',
    island: 'tao',
    lat: 10.061,
    lng: 99.845,
    zones: ['recif'],
    blurb:
      "Baie-nurserie — requins à pointes noires, tortues vertes et raies pastenagues.",
  },
  {
    id: 'japanese-gardens',
    name: 'Japanese Gardens',
    island: 'tao',
    lat: 10.12,
    lng: 99.822,
    zones: ['recif'],
    blurb:
      "Jardin corallien peu profond — tortues, poissons-papillons, poulpes et nudibranches.",
  },
  {
    id: 'chumphon-pinnacle',
    name: 'Chumphon Pinnacle',
    island: 'tao',
    lat: 10.183,
    lng: 99.783,
    zones: ['large'],
    blurb:
      "Grand pinacle au large — requins-baleines, mérous géants et bancs de barracudas.",
  },
  {
    id: 'wua-talap',
    name: 'Wua Talap',
    island: 'angthong',
    lat: 9.606,
    lng: 99.664,
    zones: ['terre', 'recif'],
    blurb:
      "Île-QG du parc — macaques, langurs, muntjacs et sentiers vers le point de vue.",
  },
  {
    id: 'mae-koh',
    name: 'Lagon de Mae Koh',
    island: 'angthong',
    lat: 9.66,
    lng: 99.68,
    zones: ['recif', 'large'],
    blurb:
      "Lagon émeraude d'eau de mer — tortues vertes, poissons de récif et hérons.",
  },
];

export const SITE_BY_ID: Record<string, Site> = Object.fromEntries(
  SITES.map((s) => [s.id, s]),
);
