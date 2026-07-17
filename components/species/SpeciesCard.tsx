import Link from 'next/link';
import type { Species } from '@/lib/types';
import { SpeciesImage } from './SpeciesImage';
import { DangerBadge, ZoneTag } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';

interface Props {
  species: Species;
  /** numéro de spécimen (1-based) pour l'esthétique catalogue naturaliste */
  specimenNo?: number;
  priority?: boolean;
  className?: string;
}

export function SpeciesCard({
  species,
  specimenNo,
  priority,
  className,
}: Props) {
  return (
    <Link
      href={`/especes/${species.slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-lacquer',
        'transition-all duration-200 hover:-translate-y-1 hover:border-gold/40 hover:shadow-gold-halo',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <SpeciesImage
          species={species}
          priority={priority}
          className="transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {specimenNo !== undefined && (
          <span className="absolute left-2.5 top-2.5 rounded border border-line bg-night/70 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-ivory/80 backdrop-blur-sm">
            N° {String(specimenNo).padStart(3, '0')}
          </span>
        )}
        <span className="absolute right-2.5 top-2.5">
          <DangerBadge level={species.danger} withDot={false} />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-display text-lg font-semibold leading-tight text-ivory">
          {species.commonName}
        </h3>
        <p className="font-mono text-xs italic text-sand">{species.latinName}</p>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-sand/90">
          {species.shortNote}
        </p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
          {species.zones.map((z) => (
            <ZoneTag key={z} zone={z} />
          ))}
        </div>
      </div>
    </Link>
  );
}
