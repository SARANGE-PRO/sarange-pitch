import Link from 'next/link';
import type { Species } from '@/lib/types';
import { SpeciesGallery } from './SpeciesGallery';
import { SoundButton } from './SoundButton';
import { CategoryIcon } from './CategoryIcon';
import { ZoneField } from './ZoneIcon';
import { DangerGauge } from '@/components/ui/DangerGauge';
import { CATEGORY_BY_KEY } from '@/data/taxonomy';
import { specimenNumber } from '@/lib/species';
import { getSound } from '@/lib/sounds';

export function SpeciesHero({ species }: { species: Species }) {
  const cat = CATEGORY_BY_KEY[species.category];
  const no = specimenNumber(species.slug);
  const sound = getSound(species.slug);
  const activity = ACTIVITY_META[species.activity];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
      <SpeciesGallery species={species} />

      <div className="flex flex-col">
        {/* Cartouches métadonnées */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/especes?categorie=${species.category}`}
            className="group inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/[0.07] px-3 py-1.5 transition-colors hover:border-gold/60"
          >
            <CategoryIcon category={species.category} className="h-4 w-4 text-gold" />
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
              {cat.label}
            </span>
          </Link>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-lacquer/60 px-3 py-1.5">
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 text-sand"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M20.6 13.4 13 21a1.5 1.5 0 0 1-2.1 0l-7-7A1.5 1.5 0 0 1 3.4 13V4.6A1.6 1.6 0 0 1 5 3h8.4a1.5 1.5 0 0 1 1.1.4l6.1 6.1a1.5 1.5 0 0 1 0 2.1Z" />
              <circle cx="7.6" cy="7.6" r="1.1" fill="currentColor" stroke="none" />
            </svg>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-sand">
              Spécimen N° {String(no).padStart(3, '0')}
            </span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/25 bg-teal/[0.06] px-3 py-1.5 text-teal">
            {activity.icon}
            <span className="font-mono text-[11px] uppercase tracking-[0.14em]">
              {activity.label}
            </span>
          </span>
        </div>

        {/* Titre — serif fine, or chaud plaqué */}
        <h1 className="gilded mt-5 font-display text-[2.5rem] font-light leading-[1.05] tracking-tight sm:text-6xl">
          {species.commonName}
        </h1>
        <p className="mt-2 font-display text-lg italic text-gold/70">
          {species.latinName}
        </p>

        <p className="mt-5 text-[15px] leading-relaxed text-sand">
          {species.shortNote}
        </p>

        {sound && (
          <div className="mt-5">
            <SoundButton sound={sound} name={species.commonName} />
          </div>
        )}

        {/* Dangerosité */}
        <div className="mt-7 rounded-[var(--radius-lg)] border border-line bg-lacquer/55 p-5 shadow-card">
          <DangerGauge level={species.danger} />
        </div>

        {/* Lieux d'observation — icônes de terrain */}
        <div className="mt-7">
          <span className="eyebrow !text-sand">Lieux d’observation</span>
          <div className="mt-3.5 flex flex-wrap gap-x-5 gap-y-4">
            {species.zones.map((z) => (
              <ZoneField key={z} zone={z} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const ACTIVITY_META: Record<
  Species['activity'],
  { label: string; icon: React.ReactNode }
> = {
  diurne: { label: 'Diurne', icon: <SunIcon /> },
  nocturne: { label: 'Nocturne', icon: <MoonIcon /> },
  crepusculaire: { label: 'Crépusculaire', icon: <DawnIcon /> },
  variable: { label: 'Activité variable', icon: <ClockIcon /> },
};

function iconProps(size = 'h-3.5 w-3.5') {
  return {
    viewBox: '0 0 24 24',
    className: size,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
}

function SunIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="12" r="3.6" />
      <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M20 14.6A7.6 7.6 0 0 1 9.4 4 6.6 6.6 0 1 0 20 14.6Z" />
    </svg>
  );
}
function DawnIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M3 18.5h18" />
      <path d="M7 18.5a5 5 0 0 1 10 0" />
      <path d="M12 6.5V4M5.5 9 4 7.5M18.5 9 20 7.5" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 8.2V12l2.6 1.6" />
    </svg>
  );
}
