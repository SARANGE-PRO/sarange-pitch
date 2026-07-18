import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllSpecies } from '@/lib/species';
import { DANGERS } from '@/data/taxonomy';

export const metadata: Metadata = {
  title: 'À propos — méthodologie & crédits',
  description:
    'Méthodologie, sources naturalistes et crédits photo (Wikimedia Commons, licences CC) du bestiaire KoïKoSamui.',
};

export default function AProposPage() {
  const species = getAllSpecies();
  const withPhotos = species.filter((s) => s.photos.length > 0);

  return (
    <div className="container-editorial max-w-3xl py-14">
      <header className="mb-12">
        <p className="eyebrow">Coulisses du carnet</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ivory sm:text-5xl">
          Méthodologie &amp; sources
        </h1>
      </header>

      <section className="prose-editorial flex flex-col gap-4 text-[15px] leading-relaxed text-sand">
        <h2 className="font-display text-2xl font-semibold text-ivory">
          Le projet
        </h2>
        <p>
          KoïKoSamui recense la faune observable à Koh Samui et dans les îles
          environnantes — Koh Phangan, Koh Tao et le parc marin d’Ang Thong —
          dans le Golfe de Thaïlande. Chaque fiche indique la catégorie, le
          niveau de dangerosité, les lieux d’observation et une description de
          terrain. L’objectif est informatif : aider à reconnaître les espèces
          et à cohabiter avec elles en sécurité.
        </p>

        <h2 className="mt-6 font-display text-2xl font-semibold text-ivory">
          Dangerosité
        </h2>
        <p>
          Trois niveaux résument le risque pour un observateur respectueux :
        </p>
        <ul className="flex flex-col gap-2">
          {DANGERS.map((d) => (
            <li key={d.level} className="flex items-start gap-3">
              <span
                className={
                  'mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ' +
                  (d.cls === 'safe'
                    ? 'bg-jade'
                    : d.cls === 'caution'
                      ? 'bg-amber-warn'
                      : 'bg-laque')
                }
              />
              <span>
                <b className="text-ivory">{d.label}.</b> {d.description}
              </span>
            </li>
          ))}
        </ul>

        <h2 className="mt-6 font-display text-2xl font-semibold text-ivory">
          Sources des données
        </h2>
        <p>
          Le corpus d’espèces s’appuie sur des guides et observations
          naturalistes du Golfe de Thaïlande (parc marin de Mu Ko Ang Thong, Koh
          Tao, Koh Phangan). La taxonomie et les noms latins ont été vérifiés et
          harmonisés.
        </p>

        <h2 className="mt-6 font-display text-2xl font-semibold text-ivory">
          Sources des photos
        </h2>
        <p>
          Toutes les photographies proviennent de{' '}
          <a
            href="https://commons.wikimedia.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            Wikimedia Commons
          </a>{' '}
          (licences Creative Commons ou domaine public), complétées si besoin par{' '}
          <a
            href="https://www.inaturalist.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            iNaturalist
          </a>{' '}
          et{' '}
          <a
            href="https://www.gbif.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            GBIF
          </a>
          . L’auteur et la licence de chaque cliché sont affichés sur la photo et
          listés ci-dessous. Lorsqu’aucune photo libre de l’espèce exacte n’est
          disponible, une espèce proche est utilisée et signalée comme «
          illustration ».
        </p>
      </section>

      {/* ------------------------------------------------- CRÉDITS PHOTO */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-ivory">
          Crédits photo
        </h2>

        {withPhotos.length === 0 ? (
          <div className="mt-4 rounded-[var(--radius-lg)] border border-dashed border-line bg-lacquer/40 p-6 font-mono text-[13px] leading-relaxed text-sand">
            <p>
              Les photos ne sont pas encore importées dans cette instance. Le
              script d’import récupère automatiquement un cliché libre et crédité
              par espèce depuis Wikimedia Commons :
            </p>
            <pre className="mt-3 overflow-x-auto rounded bg-night/60 p-3 text-gold">
              npm run fetch-images
            </pre>
            <p className="mt-3">
              La liste complète des crédits (auteur · licence · source) s’affiche
              ici automatiquement une fois{' '}
              <code className="text-gold">data/photos.json</code> peuplé.
            </p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-line rounded-[var(--radius-lg)] border border-line">
            {withPhotos.map((s) =>
              s.photos.map((photo, i) => (
                <li
                  key={`${s.slug}-${i}`}
                  className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <Link
                      href={`/especes/${s.slug}`}
                      className="font-display text-sm font-semibold text-ivory hover:text-gold"
                    >
                      {s.commonName}
                    </Link>
                    <span className="ml-2 font-mono text-xs italic text-sand">
                      {s.latinName}
                    </span>
                  </div>
                  <a
                    href={photo.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] text-sand hover:text-gold"
                  >
                    © {photo.photographer} · {photo.license}
                    {photo.approximate ? ' · illustration' : ''}
                  </a>
                </li>
              )),
            )}
          </ul>
        )}
      </section>

      <p className="mt-12 rounded-[var(--radius-lg)] border border-line bg-lacquer/40 p-5 text-sm leading-relaxed text-sand">
        <b className="text-ivory">Avertissement.</b> Fiche à visée informative.
        Gardez toujours vos distances avec la faune sauvage, ne la nourrissez
        pas, et consultez un médecin en cas de morsure ou piqûre suspecte.
      </p>
    </div>
  );
}
