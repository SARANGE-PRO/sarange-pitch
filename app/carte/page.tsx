import type { Metadata } from 'next';
import { getAllSpecies } from '@/lib/species';
import { CarteExplorer } from '@/components/map/CarteExplorer';

export const metadata: Metadata = {
  title: 'Carte de l’archipel',
  description:
    "Carte interactive de Koh Samui, Koh Phangan, Koh Tao et du parc marin d'Ang Thong : sites d'observation et espèces, filtrables par catégorie.",
};

export default function CartePage() {
  const species = getAllSpecies();
  return (
    <div className="container-editorial py-14">
      <header className="mb-8 max-w-2xl">
        <p className="eyebrow">Repérage — Golfe de Thaïlande</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ivory sm:text-5xl">
          Carte de l’archipel
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-sand">
          Les quatre pôles de l’archipel et leurs sites d’observation. Filtrez
          par catégorie, puis cliquez un site pour découvrir les espèces qu’on y
          croise.
        </p>
      </header>

      <CarteExplorer species={species} />
    </div>
  );
}
