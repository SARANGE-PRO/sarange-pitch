import Image from 'next/image';
import type { Species } from '@/lib/types';
import { SpeciesImage } from './SpeciesImage';

/** Galerie photo d'une fiche espèce, crédits visibles (obligatoire CC). */
export function SpeciesGallery({ species }: { species: Species }) {
  const [, ...rest] = species.photos;

  return (
    <figure className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-lg)] border border-line">
        <SpeciesImage
          species={species}
          priority
          scan
          showCredit
          sizes="(max-width: 1024px) 92vw, 560px"
        />
      </div>

      {rest.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {rest.map((photo, i) => (
            <figure
              key={photo.url}
              className="relative aspect-square overflow-hidden rounded-[var(--radius)] border border-line"
            >
              <Image
                src={photo.url}
                alt={`${species.commonName} — photo ${i + 2}`}
                fill
                sizes="(max-width: 640px) 45vw, 180px"
                className="object-cover"
              />
              <a
                href={photo.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-0 left-0 right-0 bg-night/55 px-2 py-1 font-mono text-[9px] text-ivory/80 backdrop-blur-sm"
              >
                © {photo.photographer} · {photo.license}
              </a>
            </figure>
          ))}
        </div>
      )}

      {species.photos.length === 0 && (
        <figcaption className="font-mono text-[11px] leading-relaxed text-sand/70">
          Photo libre en attente d’import. Lancez{' '}
          <code className="text-gold">npm run fetch-images</code> pour récupérer
          un cliché Wikimedia Commons crédité.
        </figcaption>
      )}
    </figure>
  );
}
