import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'default' | 'safe' | 'caution' | 'danger';

const activeTone: Record<Tone, string> = {
  default: 'bg-gold text-night border-gold',
  safe: 'bg-jade text-night border-jade',
  caution: 'bg-amber-warn text-night border-amber-warn',
  danger: 'bg-laque text-ivory border-laque',
};

type Props = ComponentPropsWithoutRef<'button'> & {
  active?: boolean;
  tone?: Tone;
};

/** Puce de filtre cliquable (état actif / inactif). */
export function Chip({
  active = false,
  tone = 'default',
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'select-none rounded-full border px-3 py-1.5 font-ui text-[13px] font-medium transition-all duration-150',
        active
          ? activeTone[tone]
          : 'border-line text-sand hover:border-ivory/30 hover:text-ivory',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
