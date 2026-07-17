import Image from 'next/image';
import type { Species } from '@/lib/types';
import { CATEGORY_BY_KEY } from '@/data/taxonomy';
import { primaryPhoto } from '@/lib/species';
import { cn } from '@/lib/cn';

const glow: Record<Species['danger'], string> = {
  0: 'ring-jade/25',
  1: 'ring-amber-warn/25',
  2: 'ring-laque/30',
};

interface Props {
  species: Species;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** effet de scan « herbier numérique » (héros de fiche) */
  scan?: boolean;
  /** crédit photo discret superposé en bas de l'image */
  showCredit?: boolean;
}

/**
 * Rendu visuel d'une espèce : photo Wikimedia créditée si disponible,
 * sinon plaque « spécimen » gravée (glyphe + treillis kranok).
 */
export function SpeciesImage({
  species,
  sizes = '(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 360px',
  priority = false,
  className,
  scan = false,
  showCredit = false,
}: Props) {
  const photo = primaryPhoto(species);
  const cat = CATEGORY_BY_KEY[species.category];
  const alt = `${species.commonName} (${species.latinName}) — ${cat.label.toLowerCase()} observé dans l'archipel de Koh Samui`;

  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden bg-lacquer-2',
        className,
      )}
    >
      {photo ? (
        <>
          <Image
            src={photo.url}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent"
            aria-hidden
          />
          {showCredit && (
            <a
              href={photo.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-0 left-0 right-0 flex flex-wrap items-center gap-x-2 bg-night/55 px-3 py-1.5 font-mono text-[10px] text-ivory/80 backdrop-blur-sm hover:text-ivory"
            >
              <span>© {photo.photographer}</span>
              <span className="text-gold">· {photo.license}</span>
              {photo.approximate && (
                <span className="text-sand">· illustration ({photo.depicts})</span>
              )}
            </a>
          )}
        </>
      ) : (
        <SpecimenPlate species={species} scan={scan} />
      )}
    </div>
  );
}

/** Plaque « spécimen » — fallback graphique cohérent avec l'esthétique. */
function SpecimenPlate({
  species,
  scan,
}: {
  species: Species;
  scan: boolean;
}) {
  const cat = CATEGORY_BY_KEY[species.category];
  return (
    <div
      role="img"
      aria-label={`${species.commonName} — plaque spécimen (photo à venir)`}
      className={cn(
        'kranok relative flex h-full w-full flex-col items-center justify-center gap-3',
        'bg-[radial-gradient(circle_at_50%_38%,rgba(201,162,39,0.12),transparent_62%)]',
        'ring-1 ring-inset',
        glow[species.danger],
      )}
    >
      <span
        className="select-none text-6xl drop-shadow-[0_6px_18px_rgba(0,0,0,0.5)] sm:text-7xl"
        aria-hidden
      >
        {species.icon}
      </span>
      <span className="eyebrow !text-gold/80">{cat.label}</span>
      <span className="max-w-[80%] text-center font-display text-xs italic text-sand/70">
        {species.latinName}
      </span>
      {scan && <div className="scan-overlay" aria-hidden />}
    </div>
  );
}
