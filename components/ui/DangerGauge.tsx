import type { DangerLevel } from '@/lib/types';
import { DANGER_BY_LEVEL } from '@/data/taxonomy';
import { cn } from '@/lib/cn';

const SEGMENTS: { level: DangerLevel; color: string }[] = [
  { level: 0, color: 'bg-jade' },
  { level: 1, color: 'bg-amber-warn' },
  { level: 2, color: 'bg-laque' },
];

const labelColor: Record<DangerLevel, string> = {
  0: 'text-jade',
  1: 'text-amber-warn',
  2: 'text-laque',
};

/** Jauge visuelle de dangerosité (0 / 1 / 2) — remplissage cumulatif. */
export function DangerGauge({
  level,
  className,
}: {
  level: DangerLevel;
  className?: string;
}) {
  const meta = DANGER_BY_LEVEL[level];
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <span className="eyebrow !text-sand">Dangerosité</span>
        <span
          className={cn('font-mono text-xs uppercase tracking-wider', labelColor[level])}
        >
          {level} / 2 · {meta.label}
        </span>
      </div>
      <div
        className="flex gap-1.5"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={2}
        aria-valuenow={level}
        aria-label={`Dangerosité : ${meta.label}`}
      >
        {SEGMENTS.map((seg) => {
          const active = seg.level <= level;
          return (
            <span
              key={seg.level}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                active ? seg.color : 'bg-white/8',
                active && seg.level === level && 'animate-pulse-marker',
              )}
            />
          );
        })}
      </div>
      <p className="text-sm leading-relaxed text-sand">{meta.description}</p>
    </div>
  );
}
