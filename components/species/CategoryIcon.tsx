import type { Category } from '@/lib/types';
import { cn } from '@/lib/cn';

/**
 * Icônes de terrain « gravées » (line-art) par catégorie — dessinées à la main
 * pour un rendu carnet de luxe, teintables via currentColor.
 */
export function CategoryIcon({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-4 w-4', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ICONS[category]}
    </svg>
  );
}

const ICONS: Record<Category, React.ReactNode> = {
  // Patte — coussinets pleins
  mammifere: (
    <g fill="currentColor" stroke="none">
      <path d="M12 13.4c-2.3 0-4.1 1.7-4.1 3.5 0 1.3 1 2.2 2.3 2.2.8 0 1.2-.35 1.8-.35s1 .35 1.8.35c1.3 0 2.3-.9 2.3-2.2 0-1.8-1.8-3.5-4.1-3.5Z" />
      <ellipse cx="7.2" cy="11.4" rx="1.35" ry="1.75" />
      <ellipse cx="10.3" cy="9.1" rx="1.35" ry="1.9" />
      <ellipse cx="13.7" cy="9.1" rx="1.35" ry="1.9" />
      <ellipse cx="16.8" cy="11.4" rx="1.35" ry="1.75" />
    </g>
  ),
  // Serpent — corps ondulé, tête relevée, langue fourchue
  reptile: (
    <>
      <path d="M4 15.4c1.5 0 1.5-3 3-3s1.5 3 3 3 1.5-3 3-3 1.5 3 3 3" />
      <path d="M16 15.4c1 0 1.7.8 1.7 1.8" />
      <path d="M17.7 16.5l1.9-.5M17.7 17.1l1.9.7" />
    </>
  ),
  // Plume
  oiseau: (
    <>
      <path d="M20 5c-1.2 6.4-5.4 10.6-11.8 11.8L6 18l-2 2" />
      <path d="M16.5 8.5 8 17" />
      <path d="M18 11.5H10" />
    </>
  ),
  // Araignée — corps + 8 pattes
  arthropode: (
    <>
      <ellipse cx="12" cy="13" rx="2.3" ry="2.7" />
      <circle cx="12" cy="9.4" r="1.4" />
      <path d="M9.8 11.6 5.8 9M9.5 13 5 13M9.8 14.6 6 17M10.6 15.7 8.4 18.8" />
      <path d="M14.2 11.6 18.2 9M14.5 13 19 13M14.2 14.6 18 17M13.4 15.7 15.6 18.8" />
      <path d="M11 8.1 10 6.4M13 8.1 14 6.4" />
    </>
  ),
  // Papillon
  insecte: (
    <>
      <path d="M12 6.5v11" />
      <path d="M12 8.2C10.6 5.7 6.9 5 5.1 6.9c-1.5 1.6-1 4.3 1 5.3-1.9.7-2.8 2.9-1.7 4.7 1 1.6 3.6 1.6 5-.1 1-1.2 1.6-2.9 1.6-4.5" />
      <path d="M12 8.2C13.4 5.7 17.1 5 18.9 6.9c1.5 1.6 1 4.3-1 5.3 1.9.7 2.8 2.9 1.7 4.7-1 1.6-3.6 1.6-5-.1-1-1.2-1.6-2.9-1.6-4.5" />
      <path d="M12 6.5c0-1.2.8-2 1.9-2.4M12 6.5c0-1.2-.8-2-1.9-2.4" />
    </>
  ),
  // Poisson
  marine: (
    <>
      <path d="M14.8 12c0 3.2-3.3 5.8-7.6 5.8-1.9 0-3.6-.5-5-1.3 1.2-1 1.9-2.6 1.9-4.5s-.7-3.5-1.9-4.5c1.4-.8 3.1-1.3 5-1.3 4.3 0 7.6 2.6 7.6 5.8Z" />
      <path d="M14.8 12c1.5-.3 3.9-.4 6-2v4c-2.1-1.6-4.5-1.7-6-2" />
      <circle cx="6.4" cy="11" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
};
