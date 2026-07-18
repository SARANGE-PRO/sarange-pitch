/**
 * Helpers de récupération d'images libres depuis Wikimedia Commons / Wikipédia.
 *
 * Stratégie (par espèce) :
 *   1. Interroger Wikipédia (pageimages) pour l'image principale de la page du taxon.
 *   2. Récupérer les métadonnées du fichier sur Commons (auteur, licence, page source).
 *   3. Fallback : recherche d'image directe sur Commons si aucune page taxon.
 *
 * Toutes les images renvoyées proviennent de Wikimedia (licences CC / domaine
 * public). L'auteur, la licence et l'URL source sont conservés pour l'attribution
 * obligatoire (CC-BY / CC-BY-SA).
 */
import type { PhotoCredit } from '@/lib/types';

const WIKIPEDIA_API = 'https://en.wikipedia.org/w/api.php';
const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT =
  'KoiKoSamui/1.0 (https://koikosamui.example; contact@sarange.fr) fetch-images script';

// Licences acceptées (réutilisation légale). On écarte le reste par prudence.
const ACCEPTED_LICENSE = /(^cc)|(public domain)|(^pd)|(cc0)|(no restrictions)/i;

async function apiGet(
  endpoint: string,
  params: Record<string, string>,
): Promise<any> {
  const url = new URL(endpoint);
  url.searchParams.set('format', 'json');
  url.searchParams.set('origin', '*');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': USER_AGENT, 'Api-User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`${endpoint} → HTTP ${res.status}`);
  return res.json();
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** Nom de fichier Commons de l'image principale de la page Wikipédia du taxon. */
async function wikipediaPageImage(
  title: string,
): Promise<{ file?: string; thumb?: string }> {
  const data = await apiGet(WIKIPEDIA_API, {
    action: 'query',
    prop: 'pageimages',
    piprop: 'name|thumbnail',
    pithumbsize: '1400',
    titles: title,
    redirects: '1',
  });
  const pages = data?.query?.pages ?? {};
  for (const key of Object.keys(pages)) {
    const page = pages[key];
    if (page?.pageimage) {
      return {
        file: `File:${page.pageimage}`,
        thumb: page?.thumbnail?.source,
      };
    }
  }
  return {};
}

/** Recherche directe d'un fichier image sur Commons (fallback). */
async function commonsSearchFile(query: string): Promise<string | undefined> {
  const data = await apiGet(COMMONS_API, {
    action: 'query',
    generator: 'search',
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: '6', // fichiers
    gsrlimit: '1',
  });
  const pages = data?.query?.pages ?? {};
  const first = Object.values(pages)[0] as any;
  return first?.title;
}

/** Métadonnées d'attribution d'un fichier Commons. */
async function commonsImageInfo(
  file: string,
): Promise<PhotoCredit | undefined> {
  const data = await apiGet(COMMONS_API, {
    action: 'query',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    titles: file,
  });
  const pages = data?.query?.pages ?? {};
  const page = Object.values(pages)[0] as any;
  const info = page?.imageinfo?.[0];
  if (!info?.url) return undefined;

  const ext = info.extmetadata ?? {};
  const license: string =
    ext.LicenseShortName?.value ?? ext.License?.value ?? 'Licence inconnue';
  if (!ACCEPTED_LICENSE.test(license)) return undefined;

  const artistRaw: string = ext.Artist?.value ?? 'Auteur inconnu';
  return {
    url: info.url,
    photographer: stripHtml(artistRaw) || 'Auteur inconnu',
    license: stripHtml(license),
    sourceUrl: info.descriptionurl ?? `https://commons.wikimedia.org/wiki/${file}`,
  };
}

export interface ResolveOptions {
  /** Terme de recherche prioritaire (nom d'une espèce représentative). */
  query?: string;
  /** Vrai si la photo illustre une espèce proche (taxon supérieur). */
  approximate?: boolean;
  /** Nom réellement photographié (si approximate). */
  depicts?: string;
}

/** Résout une photo créditée pour un taxon donné. */
export async function resolvePhoto(
  latinName: string,
  opts: ResolveOptions = {},
): Promise<PhotoCredit | undefined> {
  const primary = opts.query ?? cleanTaxon(latinName);
  const candidates = [primary, cleanTaxon(latinName)].filter(
    (v, i, a) => v && a.indexOf(v) === i,
  );

  for (const candidate of candidates) {
    try {
      const { file } = await wikipediaPageImage(candidate);
      const target = file ?? (await commonsSearchFile(candidate));
      if (!target) continue;
      const credit = await commonsImageInfo(target);
      if (credit) {
        return opts.approximate
          ? { ...credit, approximate: true, depicts: opts.depicts ?? candidate }
          : credit;
      }
    } catch {
      // on tente le candidat suivant
    }
  }
  return undefined;
}

/** Nettoie un nom latin pour en faire une requête de taxon exploitable. */
export function cleanTaxon(latinName: string): string {
  const base = latinName
    .replace(/\(.*?\)/g, '') // parenthèses : "(pop. littorale)"
    .replace(/\bspp?\.?/gi, ''); // "spp." / "sp."
  const first = base.split('/')[0] ?? base; // "Canis / Felis" → premier
  return first.replace(/\s+/g, ' ').trim();
}
