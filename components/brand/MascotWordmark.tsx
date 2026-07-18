'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { mascotForPath } from './mascots';
import { cn } from '@/lib/cn';

/**
 * Marque KoïKoSamui : la mascotte (pose selon la page) + le mot-logo, dans les
 * couleurs de l'app. Remplace l'ancien logo dans l'en-tête, le tiroir et le pied.
 */
export function MascotWordmark({
  imgClass = 'h-11',
  textClass = 'text-lg',
  className,
  priority = false,
}: {
  imgClass?: string;
  textClass?: string;
  className?: string;
  priority?: boolean;
}) {
  const pathname = usePathname();
  const m = mascotForPath(pathname);
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <Image
        src={m.src}
        alt=""
        aria-hidden
        width={m.w}
        height={m.h}
        unoptimized
        priority={priority}
        className={cn('w-auto object-contain', imgClass)}
      />
      <span
        className={cn(
          'font-display font-semibold tracking-tight text-ivory',
          textClass,
        )}
      >
        KoïKo<span className="text-gold">Samui</span>
      </span>
    </span>
  );
}
