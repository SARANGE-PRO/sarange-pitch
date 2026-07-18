/**
 * Récupération d'un enregistrement sonore libre pour une espèce.
 * Deux sources gratuites, complémentaires :
 *   - iNaturalist (sans clé) — couvre oiseaux, insectes, amphibiens, certains
 *     mammifères. Source par défaut (aucune variable d'env requise).
 *   - xeno-canto v3 (clé gratuite optionnelle via XENOCANTO_KEY) — meilleurs
 *     chants d'oiseaux.
 *
 * Utilisé au build par scripts/fetch-sounds.ts. Chaque clip conserve
 * enregistreur, licence et URL source pour l'attribution.
 */
import type { SoundClip } from '@/lib/types';
import { cleanTaxon } from '@/lib/wikimedia';

const UA = 'KoiKoSamui/1.0 (contact@sarange.fr)';
const CC = /(^cc)|(cc0)|(public domain)/i;

function fmtInatLicense(code?: string): string {
  if (!code) return 'Licence inconnue';
  const c = code.toLowerCase();
  if (c === 'cc0') return 'CC0';
  if (c.startsWith('cc-')) return c.replace('cc-', 'CC ').toUpperCase();
  return code;
}

function fmtXcLicense(lic?: string): string {
  if (!lic) return 'CC';
  const m = lic.match(/licenses\/([a-z-]+)\//i);
  if (m && m[1]) return `CC ${m[1].toUpperCase()}`;
  if (/publicdomain|zero/i.test(lic)) return 'CC0';
  return 'CC';
}

/** Son depuis une observation iNaturalist (sans clé). */
export async function fetchInatSound(
  latinName: string,
  query?: string,
): Promise<SoundClip | null> {
  const taxon = query ?? cleanTaxon(latinName);
  if (!taxon) return null;

  const url = new URL('https://api.inaturalist.org/v1/observations');
  const params: Record<string, string> = {
    taxon_name: taxon,
    sounds: 'true',
    order_by: 'votes',
    order: 'desc',
    per_page: '10',
  };
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`iNaturalist sounds → HTTP ${res.status}`);
  const data = await res.json();

  // On garde le son au format le plus compatible (mp3/m4a > wav).
  const order = ['.mp3', '.m4a', '.mpga', '.aac', '.ogg', '.wav'];
  const rank = (u: string) => {
    const l = u.toLowerCase();
    const i = order.findIndex((ext) => l.includes(ext));
    return i === -1 ? order.length : i;
  };
  const https = (u: string) =>
    u.startsWith('//') ? `https:${u}` : u.replace(/^http:/, 'https:');

  let best: SoundClip | null = null;
  let bestRank = Infinity;
  for (const obs of data?.results ?? []) {
    for (const sound of obs?.sounds ?? []) {
      const file: string | undefined = sound?.file_url;
      const license: string | undefined =
        sound?.license_code ?? obs?.license_code;
      if (!file || !license || !CC.test(license)) continue;
      const r = rank(file);
      if (r < bestRank) {
        bestRank = r;
        best = {
          url: https(file),
          recordist: obs?.user?.name || obs?.user?.login || 'Observateur',
          license: fmtInatLicense(license),
          source: 'iNaturalist',
          sourceUrl:
            obs?.uri ?? `https://www.inaturalist.org/observations/${obs.id}`,
        };
      }
    }
  }
  return best;
}

/** Son depuis xeno-canto v3 (nécessite une clé gratuite). */
export async function fetchXenoCanto(
  latinName: string,
  key: string,
  query?: string,
): Promise<SoundClip | null> {
  const taxon = query ?? cleanTaxon(latinName);
  if (!taxon || !key) return null;

  const url = new URL('https://xeno-canto.org/api/3/recordings');
  url.searchParams.set('query', `${taxon} q:A`);
  url.searchParams.set('key', key);
  url.searchParams.set('per_page', '5');

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`xeno-canto → HTTP ${res.status}`);
  const data = await res.json();
  const rec = (data?.recordings ?? [])[0];
  if (!rec?.file) return null;
  const file: string = rec.file.startsWith('//') ? `https:${rec.file}` : rec.file;
  return {
    url: file,
    recordist: rec.rec || 'Enregistreur',
    license: fmtXcLicense(rec.lic),
    source: 'xeno-canto',
    sourceUrl: rec.url?.startsWith('//') ? `https:${rec.url}` : rec.url,
  };
}

/** Résout le meilleur clip : xeno-canto (si clé) prioritaire, sinon iNaturalist. */
export async function resolveSound(
  latinName: string,
  opts: { xcKey?: string; query?: string } = {},
): Promise<SoundClip | null> {
  if (opts.xcKey) {
    try {
      const xc = await fetchXenoCanto(latinName, opts.xcKey, opts.query);
      if (xc) return xc;
    } catch {
      /* on bascule sur iNaturalist */
    }
  }
  try {
    return await fetchInatSound(latinName, opts.query);
  } catch {
    return null;
  }
}
