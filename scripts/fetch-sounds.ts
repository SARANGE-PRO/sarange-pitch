/**
 * scripts/fetch-sounds.ts — récupération des cris / chants.
 *
 *   npm run fetch-sounds            # complète les espèces sans son
 *   npm run fetch-sounds -- --force # tout re-récupérer
 *
 * Écrit data/sounds.json : { [slug]: SoundClip }.
 * Source : iNaturalist (sans clé) + xeno-canto (si XENOCANTO_KEY défini).
 *
 * ⚠️ Nécessite un accès réseau (ouvert au build Vercel). En egress restreint,
 *    lancez-le en local puis committez. Aucune variable d'env obligatoire.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { speciesBase } from '../data/species';
import { resolveSound } from '../lib/sound-sources';
import type { SoundClip } from '../lib/types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../data/sounds.json');

// Termes de recherche affinés (facultatif).
const OVERRIDES: Record<string, string> = {
  'gecko-tokay': 'Gekko gecko',
  cigale: 'Cicadidae',
  'chauve-souris': 'Chiroptera',
  'martin-pecheur': 'Alcedinidae',
};

// La vie marine ne vocalise pas de façon exploitable → on l'ignore.
const SKIP_CATEGORIES = new Set(['marine']);

const FORCE = process.argv.includes('--force');
const XC_KEY = process.env.XENOCANTO_KEY?.trim() || undefined;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const existing: Record<string, SoundClip> =
    existsSync(OUT) && !FORCE ? JSON.parse(readFileSync(OUT, 'utf8') || '{}') : {};
  const result: Record<string, SoundClip> = { ...existing };
  let found = 0;

  console.log(
    `Source(s) : iNaturalist${XC_KEY ? ' + xeno-canto' : ' (xeno-canto désactivé : pas de clé)'}\n`,
  );

  for (const species of speciesBase) {
    if (SKIP_CATEGORIES.has(species.category)) continue;
    if (!FORCE && result[species.slug]) continue;
    process.stdout.write(`· ${species.slug} … `);
    try {
      const clip = await resolveSound(species.latinName, {
        xcKey: XC_KEY,
        query: OVERRIDES[species.slug],
      });
      if (clip) {
        result[species.slug] = clip;
        found++;
        console.log(`ok (${clip.source})`);
      } else {
        console.log('aucun son libre');
      }
    } catch (err) {
      console.log(`échec (${(err as Error).message})`);
    }
    await sleep(600);
  }

  writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n');
  console.log(`\n✓ ${found} son(s) → data/sounds.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
