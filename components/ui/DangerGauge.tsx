import type { DangerLevel } from '@/lib/types';
import { DANGER_BY_LEVEL } from '@/data/taxonomy';
import { cn } from '@/lib/cn';

/**
 * Jauge de dangerosité graphique et segmentée (5 crans).
 * La couleur code la sévérité (émeraude vif → ambre → laque rouge), le
 * remplissage code l'ampleur. Un état « Inoffensif » allume les premiers crans
 * en vert émeraude vibrant, texte assorti.
 */
const SEG_COUNT = 5;
const FILL: Record<DangerLevel, number> = { 0: 2, 1: 3, 2: 5 };

const TONE: Record<DangerLevel, { fill: string; glow: string; text: string }> = {
  0: {
    fill: 'bg-emeraude',
    glow: 'shadow-[0_0_14px_rgba(53,200,138,0.5)]',
    text: 'text-emeraude',
  },
  1: {
    fill: 'bg-amber-warn',
    glow: 'shadow-[0_0_14px_rgba(208,145,43,0.45)]',
    text: 'text-amber-warn',
  },
  2: {
    fill: 'bg-laque',
    glow: 'shadow-[0_0_14px_rgba(184,48,42,0.5)]',
    text: 'text-laque',
  },
};

export function DangerGauge({
  level,
  className,
}: {
  level: DangerLevel;
  className?: string;
}) {
  const meta = DANGER_BY_LEVEL[level];
  const tone = TONE[level];
  const filled = FILL[level];

  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      <div className="flex items-center justify-between">
        <span className="eyebrow !text-sand">Dangerosité</span>
        <span
          className={cn(
            'flex items-baseline gap-2 font-mono text-xs uppercase tracking-wider',
            tone.text,
          )}
        >
          <span className="font-semibold">{meta.label}</span>
          <span className="text-sand/60">{level} / 2</span>
        </span>
      </div>

      <div
        className="flex gap-1.5"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={2}
        aria-valuenow={level}
        aria-label={`Dangerosité : ${meta.label} (${level} sur 2)`}
      >
        {Array.from({ length: SEG_COUNT }).map((_, i) => {
          const on = i < filled;
          return (
            <span
              key={i}
              className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]"
            >
              <span
                className={cn(
                  'absolute inset-0 rounded-full transition-all duration-500',
                  on ? cn(tone.fill, tone.glow) : 'opacity-0',
                )}
              />
              {on && (
                <span
                  className="absolute inset-x-0 top-0 h-1/2 rounded-full bg-white/25"
                  aria-hidden
                />
              )}
            </span>
          );
        })}
      </div>

      <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-sand/45">
        <span>Faible</span>
        <span>Élevé</span>
      </div>

      <p className="mt-0.5 text-sm leading-relaxed text-sand">{meta.description}</p>
    </div>
  );
}
