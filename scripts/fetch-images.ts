/**
 * scripts/fetch-images.ts — récupération one-shot des photos libres.
 *
 *   npm run fetch-images            # complète les espèces sans photo
 *   npm run fetch-images -- --force # re-récupère tout
 *
 * Écrit data/photos.json : { [slug]: PhotoCredit[] }.
 * Chaque photo provient de Wikimedia Commons (licence CC / domaine public),
 * avec auteur, licence et URL source conservés pour l'attribution légale.
 *
 * ⚠️  Nécessite un accès réseau à en.wikipedia.org et commons.wikimedia.org.
 *     Dans un environnement à egress restreint, lancez ce script en local
 *     puis committez data/photos.json.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { speciesBase } from '../data/species';
import { resolvePhoto, type ResolveOptions } from '../lib/wikimedia';
import type { PhotoCredit } from '../lib/types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../data/photos.json');

/**
 * Requêtes de secours pour les taxons de niveau supérieur (famille / genre /
 * "spp.") : on cible une espèce représentative de l'archipel et on marque la
 * photo comme illustrative (approximate) avec le nom réellement photographié.
 */
const OVERRIDES: Record<string, ResolveOptions> = {
  'chauve-souris': { query: 'Pteropus lylei', approximate: true, depicts: 'Roussette de Lyle (Pteropus lylei)' },
  'chien-chat-errant': { query: 'Free-ranging dog', approximate: true, depicts: 'Chien errant' },
  // Oiseaux (familles → espèce régionale représentative)
  'martin-pecheur': { query: 'Todiramphus chloris', approximate: true, depicts: 'Martin-chasseur à collier blanc (Todiramphus chloris)' },
  'pygargue-aigle-de-mer': { query: 'Haliaeetus leucogaster', approximate: true, depicts: 'Pygargue blagre (Haliaeetus leucogaster)' },
  calao: { query: 'Anthracoceros albirostris', approximate: true, depicts: 'Calao pie oriental (Anthracoceros albirostris)' },
  bulbul: { query: 'Pycnonotus goiavier', approximate: true, depicts: 'Bulbul goiavier (Pycnonotus goiavier)' },
  loriot: { query: 'Oriolus chinensis', approximate: true, depicts: 'Loriot à nuque noire (Oriolus chinensis)' },
  mynah: { query: 'Acridotheres tristis', approximate: true, depicts: 'Martin triste (Acridotheres tristis)' },
  perruche: { query: 'Psittacula krameri', approximate: true, depicts: 'Perruche à collier (Psittacula krameri)' },
  'mouette-sterne': { query: 'Sternula albifrons', approximate: true, depicts: 'Petite sterne (Sternula albifrons)' },
  // Reptiles (genres → espèce régionale)
  'serpent-fouet': { query: 'Ahaetulla prasina', approximate: true, depicts: 'Ahaetulla prasina' },
  'elaphe-des-mangroves': { query: 'Gonyosoma oxycephalum', approximate: true, depicts: 'Gonyosoma oxycephalum' },
  boiga: { query: 'Boiga dendrophila', approximate: true, depicts: 'Serpent des mangroves (Boiga dendrophila)' },
  // Correction taxonomique : vipère des temples = Tropidolaemus wagleri
  'vipere-des-temples': { query: 'Tropidolaemus wagleri' },
  // Arachnides & myriapodes
  'araignee-sauteuse': { query: 'Salticidae', approximate: true, depicts: 'Araignée sauteuse (Salticidae)' },
  nephile: { query: 'Nephila pilipes', approximate: true, depicts: 'Nephila pilipes' },
  'araignee-crabe-geante': { query: 'Heteropoda venatoria', approximate: true, depicts: 'Heteropoda venatoria' },
  tarentule: { query: 'Cyriopagopus albostriatus', approximate: true, depicts: 'Mygale zébrée thaïe (Cyriopagopus albostriatus)' },
  'scorpion-noir-thailandais': { query: 'Heterometrus laoticus', approximate: true, depicts: 'Heterometrus laoticus' },
  'scolopendre-geante': { query: 'Scolopendra subspinipes', approximate: true, depicts: 'Scolopendra subspinipes' },
  // Insectes
  'mante-religieuse': { query: 'Hierodula', approximate: true, depicts: 'Mante (Hierodula)' },
  moustique: { query: 'Aedes aegypti', approximate: true, depicts: 'Aedes aegypti' },
  cafard: { query: 'Periplaneta americana', approximate: true, depicts: 'Periplaneta americana' },
  papillon: { query: 'Troides aeacus', approximate: true, depicts: 'Troides aeacus' },
  libellule: { query: 'Orthetrum sabina', approximate: true, depicts: 'Orthetrum sabina' },
  luciole: { query: 'Lampyridae', approximate: true, depicts: 'Luciole (Lampyridae)' },
  cigale: { query: 'Cicadidae', approximate: true, depicts: 'Cigale (Cicadidae)' },
  'coq-de-combat': { query: 'Gallus gallus domesticus', approximate: true, depicts: 'Coq domestique' },
  'macaque-mangeur-crabes': { query: 'Macaca fascicularis' },
  // Vie marine (taxons larges → espèce représentative)
  diodon: { query: 'Diodon hystrix', approximate: true, depicts: 'Diodon hystrix' },
  nudibranche: { query: 'Chromodoris', approximate: true, depicts: 'Nudibranche (Chromodoris)' },
  'poulpe-seiche-calmar': { query: 'Octopus cyanea', approximate: true, depicts: 'Poulpe de récif (Octopus cyanea)' },
  'crevette-mantis': { query: 'Odontodactylus scyllarus', approximate: true, depicts: 'Odontodactylus scyllarus' },
  hippocampe: { query: 'Hippocampus kuda', approximate: true, depicts: 'Hippocampus kuda' },
};

const FORCE = process.argv.includes('--force');
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const existing: Record<string, PhotoCredit[]> =
    existsSync(OUT) && !FORCE
      ? JSON.parse(readFileSync(OUT, 'utf8') || '{}')
      : {};

  const result: Record<string, PhotoCredit[]> = { ...existing };
  const misses: string[] = [];
  let fetched = 0;

  for (const species of speciesBase) {
    if (!FORCE && result[species.slug]?.length) continue;

    const opts = OVERRIDES[species.slug] ?? {};
    process.stdout.write(`· ${species.slug} … `);
    try {
      const photo = await resolvePhoto(species.latinName, opts);
      if (photo) {
        result[species.slug] = [photo];
        fetched++;
        console.log(`ok${photo.approximate ? ' (illustration)' : ''}`);
      } else {
        misses.push(species.slug);
        console.log('aucune photo libre');
      }
    } catch (err) {
      misses.push(species.slug);
      console.log(`échec (${(err as Error).message})`);
    }
    await sleep(300); // courtoisie envers l'API Wikimedia
  }

  writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n');

  console.log(`\n✓ ${fetched} photo(s) récupérée(s) → data/photos.json`);
  if (misses.length) {
    console.log(
      `\n${misses.length} espèce(s) sans photo (fallback plaque « spécimen ») :`,
    );
    console.log('  ' + misses.join(', '));
    console.log(
      '\nAstuce : ajoutez/ajustez une entrée dans OVERRIDES (espèce représentative) puis relancez.',
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
