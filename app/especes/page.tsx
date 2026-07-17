import type { Metadata } from 'next';
import { getAllSpecies } from '@/lib/species';
import { filterFromSearchParams } from '@/lib/filters';
import { SpeciesExplorer } from '@/components/species/SpeciesExplorer';

export const metadata: Metadata = {
  title: 'Toutes les espèces',
  description:
    "Liste filtrable de la faune de Koh Samui et des îles : recherche par nom, filtres par catégorie, dangerosité et lieu d'observation.",
};

export default function EspecesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const species = getAllSpecies();
  const initialFilter = filterFromSearchParams(searchParams);

  return (
    <div className="container-editorial py-14">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow">Catalogue de terrain</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ivory sm:text-5xl">
          Toutes les espèces
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-sand">
          {species.length} spécimens de l’archipel, de la canopée au récif.
          Combinez les filtres et partagez l’URL : vos critères y sont conservés.
        </p>
      </header>

      <SpeciesExplorer species={species} initialFilter={initialFilter} />
    </div>
  );
}
