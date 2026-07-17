import { ISLANDS } from '@/data/locations';

// Projection des îles réelles dans un viewBox 100×100 (nord = haut).
const LNG0 = 99.6;
const LNG1 = 100.1;
const LAT0 = 10.25; // nord
const LAT1 = 9.45; // sud

function project(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - LNG0) / (LNG1 - LNG0)) * 100;
  const y = ((LAT0 - lat) / (LAT0 - LAT1)) * 100;
  return { x, y };
}

const NODES = ISLANDS.map((i) => ({ ...i, ...project(i.lat, i.lng) }));
const byId = (id: string) => NODES.find((n) => n.id === id)!;

// Liaisons entre pôles de l'archipel.
const LINKS: [string, string][] = [
  ['tao', 'phangan'],
  ['phangan', 'samui'],
  ['samui', 'angthong'],
  ['angthong', 'phangan'],
];

/** Carte-constellation animée de l'archipel (décor de hero, sans tuiles externes). */
export function HeroConstellation({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <radialGradient id="hc-glow" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#17A398" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#0B1A15" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#hc-glow)" />

      {/* Liaisons */}
      <g stroke="#C9A227" strokeWidth="0.18" strokeOpacity="0.35">
        {LINKS.map(([a, b]) => {
          const na = byId(a);
          const nb = byId(b);
          return (
            <line
              key={`${a}-${b}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              strokeDasharray="1.2 1.4"
            />
          );
        })}
      </g>

      {/* Nœuds pulsants */}
      {NODES.map((n, i) => (
        <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
          <circle r="2.6" fill="none" stroke="#C9A227" strokeWidth="0.2" opacity="0.5">
            <animate
              attributeName="r"
              values="2.2;4.2;2.2"
              dur="3.4s"
              begin={`${i * 0.5}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0;0.6"
              dur="3.4s"
              begin={`${i * 0.5}s`}
              repeatCount="indefinite"
            />
          </circle>
          <circle r="1.1" fill="#C9A227" />
          <text
            x="0"
            y="-3.4"
            textAnchor="middle"
            fill="#F4EEDD"
            fillOpacity="0.55"
            style={{ font: '2.3px var(--font-plex-mono, monospace)' }}
          >
            {n.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
