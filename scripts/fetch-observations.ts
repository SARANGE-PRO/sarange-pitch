/**
 * scripts/fetch-observations.ts — récupération des observations réelles.
 *
 *   npm run fetch-observations            # complète les espèces sans données
 *   npm run fetch-observations -- --force # tout re-récupérer
 *
 * Écrit data/observations.json : { [slug]: Observation[] }.
 * Source : API iNaturalist (gratuite, sans clé). Chaque observation conserve
 * auteur, licence et URL source.
 *
 * ⚠️ Nécessite un accès réseau à api.inaturalist.org (ouvert au build Vercel).
 *    En environnement à egress restreint, lancez-le en local puis committez.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { speciesBase } from '../data/species';
import { fetchObservations } from '../lib/inaturalist';
import type { Observation } from '../lib/types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../data/observations.json');

// Corrections de taxon (familles/genres → terme iNaturalist exploitable).
const OVERRIDES: Record<string, string> = {
  'vipere-des-temples': 'Tropidolaemus wagleri',
  'chauve-souris': 'Chiroptera',
  'martin-pecheur': 'Alcedinidae',
  'chien-chat-errant': 'Canis familiaris',
};

const PER_SPECIES = 12;
const FORCE = process.argv.includes('--force');
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const existing: Record<string, Observation[]> =
    existsSync(OUT) && !FORCE ? JSON.parse(readFileSync(OUT, 'utf8') || '{}') : {};

  const result: Record<string, Observation[]> = { ...existing };
  const misses: string[] = [];
  let withData = 0;

  for (const species of speciesBase) {
    if (!FORCE && result[species.slug]?.length) continue;
    process.stdout.write(`· ${species.slug} … `);
    try {
      const obs = await fetchObservations(species.latinName, {
        query: OVERRIDES[species.slug],
        limit: PER_SPECIES,
      });
      if (obs.length) {
        result[species.slug] = obs.slice(0, PER_SPECIES);
        withData++;
        console.log(`${obs.length} obs`);
      } else {
        misses.push(species.slug);
        console.log('aucune observation');
      }
    } catch (err) {
      misses.push(species.slug);
      console.log(`échec (${(err as Error).message})`);
    }
    await sleep(700); // courtoisie envers l'API iNaturalist
  }

  writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n');
  console.log(`\n✓ ${withData} espèce(s) avec observations → data/observations.json`);
  if (misses.length) {
    console.log(`${misses.length} sans observation à proximité : ${misses.join(', ')}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
