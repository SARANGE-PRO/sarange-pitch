import { cn } from '@/lib/cn';

/**
 * Marque « Poké Ball » — clin d'œil au thème (cataloguer / capturer la faune),
 * revisitée dans la palette Lanna Futur (or de temple, ivoire soie, teal récif).
 */
export function PokeBall({
  className,
  title = 'KoïKoSamui',
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={title}
    >
      <defs>
        <clipPath id="pb-clip">
          <circle cx="50" cy="50" r="44" />
        </clipPath>
        <linearGradient id="pb-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E1BC46" />
          <stop offset="1" stopColor="#C9A227" />
        </linearGradient>
        <linearGradient id="pb-bottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F7F1E1" />
          <stop offset="1" stopColor="#DBD3BC" />
        </linearGradient>
      </defs>

      <g clipPath="url(#pb-clip)">
        <rect x="0" y="0" width="100" height="50" fill="url(#pb-top)" />
        <rect x="0" y="50" width="100" height="50" fill="url(#pb-bottom)" />
        <rect x="0" y="45" width="100" height="10" fill="#0B1A15" />
      </g>

      {/* contour */}
      <circle cx="50" cy="50" r="44" fill="none" stroke="#0B1A15" strokeWidth="5" />
      {/* bouton central */}
      <circle cx="50" cy="50" r="15" fill="#0B1A15" />
      <circle cx="50" cy="50" r="10" fill="#F4EEDD" stroke="#0B1A15" strokeWidth="2" />
      <circle cx="50" cy="50" r="4.4" fill="#17A398" />
    </svg>
  );
}
