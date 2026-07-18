import type { Metadata } from 'next';
import type { ObservationZone } from '@/lib/types';
import { getAllSpecies } from '@/lib/species';
import { BiomeExplorer } from '@/components/biomes/BiomeExplorer';

export const metadata: Metadata = {
  title: 'Biomes de l’archipel',
  description:
    "Explorer la faune de Koh Samui par habitat : jungle, village, canopée, récif corallien et grand large.",
};

const ZONES: ObservationZone[] = ['terre', 'urbain', 'air', 'recif', 'large'];

export default function BiomesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const species = getAllSpecies();
  const raw = typeof searchParams.zone === 'string' ? searchParams.zone : '';
  const initialZone: ObservationZone = ZONES.includes(raw as ObservationZone)
    ? (raw as ObservationZone)
    : 'terre';

  return (
    <div className="container-editorial py-14">
      <header className="mb-8 max-w-2xl">
        <p className="eyebrow">Exploration par habitat</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ivory sm:text-5xl">
          Biomes de l’archipel
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-sand">
          De la canopée au grand large : plonge dans chaque milieu et découvre la
          faune qui l’habite. Un voyage de la terre à la mer.
        </p>
      </header>

      <BiomeExplorer species={species} initialZone={initialZone} />
    </div>
  );
}
