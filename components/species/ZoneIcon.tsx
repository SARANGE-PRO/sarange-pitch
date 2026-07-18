import type { ObservationZone } from '@/lib/types';
import { ZONE_BY_KEY } from '@/data/taxonomy';
import { cn } from '@/lib/cn';

/**
 * Icônes de terrain personnalisées par zone d'observation (line-art gravé).
 *   terre → arbre & racines · air → oiseau planant · recif → corail
 *   large → houle du large · urbain → hutte de village
 */
export function ZoneIcon({
  zone,
  className,
}: {
  zone: ObservationZone;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-5 w-5', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ICONS[zone]}
    </svg>
  );
}

const ICONS: Record<ObservationZone, React.ReactNode> = {
  // Arbre & racines
  terre: (
    <>
      <path d="M12 3.2c-2.6 0-4.6 2-4.6 4.5 0 .5.1 1 .2 1.4-1.3.5-2.1 1.8-2.1 3.3 0 2.3 2 4.2 4.5 4.2h4c2.5 0 4.5-1.9 4.5-4.2 0-1.5-.8-2.8-2.1-3.3.1-.4.2-.9.2-1.4 0-2.5-2-4.5-4.6-4.5Z" />
      <path d="M12 12.6v4" />
      <path d="M12 16.6c-.2 1.4-1.7 1.9-2.7 3M12 16.6c.2 1.4 1.7 1.9 2.7 3M12 16.6v4" />
    </>
  ),
  // Oiseau planant (hirondelle)
  air: (
    <>
      <path d="M3.5 13.5c2.6.2 4.8-1.1 6.2-3.4.7-1.1 1.3-1.7 2.3-1.7s1.6.6 2.3 1.7c1.4 2.3 3.6 3.6 6.2 3.4" />
      <path d="M11 11.4 12 13l1-1.6" />
    </>
  ),
  // Corail branchu
  recif: (
    <>
      <path d="M12 20.5V17" />
      <path d="M12 17c0-1.7-1.9-2.3-1.9-4.4 0-1.1.3-1.7.3-2.8" />
      <path d="M12 17c0-1.5 2-2 2-4.1 0-1.1-.3-1.8-.3-2.9" />
      <path d="M12 14.2c0-1.5.1-2.5.1-4.1" />
      <circle cx="10.4" cy="9.2" r="0.9" />
      <circle cx="13.7" cy="9.5" r="0.9" />
      <circle cx="12.1" cy="9.4" r="0.9" />
    </>
  ),
  // Houle du large
  large: (
    <>
      <path d="M3 8.5c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0 3-1.6 4.5 0 3 1.6 4.5 0" />
      <path d="M3 12.5c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0 3-1.6 4.5 0 3 1.6 4.5 0" />
      <path d="M3 16.5c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0 3-1.6 4.5 0 3 1.6 4.5 0" />
    </>
  ),
  // Hutte de village
  urbain: (
    <>
      <path d="M3.8 11 12 4.8 20.2 11" />
      <path d="M6 9.8V19h12V9.8" />
      <path d="M10 19v-4.2h4V19" />
    </>
  ),
};

/** Tuile « terrain » : icône personnalisée + label discret en or. */
export function ZoneField({ zone }: { zone: ObservationZone }) {
  const label = ZONE_BY_KEY[zone].label;
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-[14px_5px_14px_5px] border border-gold/25 bg-lacquer/70 text-gold shadow-[inset_0_1px_0_rgba(244,238,221,0.05)]">
        <ZoneIcon zone={zone} className="h-[22px] w-[22px]" />
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold/75">
        {label}
      </span>
    </div>
  );
}
