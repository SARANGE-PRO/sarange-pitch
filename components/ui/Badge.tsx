import type { DangerLevel, ObservationZone } from '@/lib/types';
import { DANGER_BY_LEVEL, ZONE_BY_KEY } from '@/data/taxonomy';
import { cn } from '@/lib/cn';

const dangerStyles: Record<DangerLevel, string> = {
  0: 'text-jade border-jade/50 bg-jade/10',
  1: 'text-amber-warn border-amber-warn/50 bg-amber-warn/10',
  2: 'text-laque border-laque/55 bg-laque/12',
};

const dot: Record<DangerLevel, string> = {
  0: 'bg-jade',
  1: 'bg-amber-warn',
  2: 'bg-laque',
};

export function DangerBadge({
  level,
  className,
  withDot = true,
}: {
  level: DangerLevel;
  className?: string;
  withDot?: boolean;
}) {
  const meta = DANGER_BY_LEVEL[level];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider',
        dangerStyles[level],
        className,
      )}
    >
      {withDot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full', dot[level])}
          aria-hidden
        />
      )}
      {meta.label}
    </span>
  );
}

export function ZoneTag({
  zone,
  className,
}: {
  zone: ObservationZone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-sand',
        className,
      )}
    >
      {ZONE_BY_KEY[zone].label}
    </span>
  );
}
