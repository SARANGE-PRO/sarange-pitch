import type { Species } from '@/lib/types';
import { SpeciesCard } from './SpeciesCard';
import { specimenNumber } from '@/lib/species';
import { cn } from '@/lib/cn';

interface Props {
  species: Species[];
  numbered?: boolean;
  priorityCount?: number;
  className?: string;
}

export function SpeciesGrid({
  species,
  numbered = true,
  priorityCount = 0,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {species.map((s, i) => (
        <SpeciesCard
          key={s.slug}
          species={s}
          specimenNo={numbered ? specimenNumber(s.slug) : undefined}
          priority={i < priorityCount}
        />
      ))}
    </div>
  );
}
