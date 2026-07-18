import Link from 'next/link';
import type { Species } from '@/lib/types';
import { SpeciesGallery } from './SpeciesGallery';
import { SoundButton } from './SoundButton';
import { DangerGauge } from '@/components/ui/DangerGauge';
import { ZoneTag } from '@/components/ui/Badge';
import { CATEGORY_BY_KEY } from '@/data/taxonomy';
import { specimenNumber } from '@/lib/species';
import { getSound } from '@/lib/sounds';

export function SpeciesHero({ species }: { species: Species }) {
  const cat = CATEGORY_BY_KEY[species.category];
  const no = specimenNumber(species.slug);
  const sound = getSound(species.slug);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
      <SpeciesGallery species={species} />

      <div className="flex flex-col">
        <div className="flex items-center gap-3 font-mono text-xs text-sand">
          <Link
            href={`/especes?categorie=${species.category}`}
            className="eyebrow transition-colors hover:text-gold"
          >
            {cat.icon} {cat.label}
          </Link>
          <span className="text-line">/</span>
          <span>Spécimen N° {String(no).padStart(3, '0')}</span>
        </div>

        <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.02] text-ivory sm:text-5xl">
          {species.commonName}
        </h1>
        <p className="mt-2 font-display text-lg italic text-gold/90">
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

        <div className="mt-7 rounded-[var(--radius-lg)] border border-line bg-lacquer/60 p-5">
          <DangerGauge level={species.danger} />
        </div>

        <div className="mt-6">
          <span className="eyebrow !text-sand">Lieux d’observation</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {species.zones.map((z) => (
              <ZoneTag key={z} zone={z} className="!text-[11px]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
