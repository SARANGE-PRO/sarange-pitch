'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Species } from '@/lib/types';
import { SpeciesImage } from './SpeciesImage';
import { PhotoLightbox } from './PhotoLightbox';
import { BLUR_DATA_URL } from '@/lib/images';

/** Galerie photo d'une fiche espèce : clic pour agrandir, crédits visibles (CC). */
export function SpeciesGallery({ species }: { species: Species }) {
  const [index, setIndex] = useState<number | null>(null);
  const photos = species.photos;
  const hasPhotos = photos.length > 0;
  const alt = `${species.commonName} — ${species.latinName}`;
  const main = photos[0];

  return (
    <figure className="flex flex-col gap-3">
      {hasPhotos && main ? (
        <>
          <button
            type="button"
            onClick={() => setIndex(0)}
            aria-label={`Agrandir la photo de ${species.commonName}`}
            className="group relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-[var(--radius-lg)] border border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <Image
              src={main.url}
              alt={alt}
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 560px"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-line bg-night/70 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ivory backdrop-blur-sm">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Agrandir
            </span>
          </button>
          <figcaption className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] text-sand">
            <a
              href={main.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold"
            >
              © {main.photographer} · {main.license}
            </a>
            {main.approximate && (
              <span className="text-sand/70">· illustration ({main.depicts})</span>
            )}
          </figcaption>
        </>
      ) : (
        <>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-lg)] border border-line">
            <SpeciesImage species={species} priority scan />
          </div>
          <figcaption className="font-mono text-[11px] leading-relaxed text-sand/70">
            Photo libre en attente d’import (plaque « spécimen »).
          </figcaption>
        </>
      )}

      {photos.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {photos.slice(1, 5).map((photo, i) => (
            <button
              key={photo.url}
              type="button"
              onClick={() => setIndex(i + 1)}
              aria-label={`Photo ${i + 2} de ${species.commonName}`}
              className="relative aspect-square cursor-zoom-in overflow-hidden rounded-[var(--radius)] border border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <Image
                src={photo.url}
                alt={`${alt} — ${i + 2}`}
                fill
                sizes="120px"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <PhotoLightbox
        photos={photos}
        index={index}
        alt={alt}
        onClose={() => setIndex(null)}
        onIndex={setIndex}
      />
    </figure>
  );
}
