import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllSlugs,
  getSpeciesBySlug,
  getSimilarSpecies,
  specimenNumber,
} from '@/lib/species';
import { getSpeciesSpots, getSitesForSpecies } from '@/lib/geo';
import { CATEGORY_BY_KEY, DANGER_BY_LEVEL, ZONE_BY_KEY } from '@/data/taxonomy';
import { SpeciesHero } from '@/components/species/SpeciesHero';
import { SpeciesGrid } from '@/components/species/SpeciesGrid';
import { MapView } from '@/components/map/MapView';
import { Button } from '@/components/ui/Button';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const species = getSpeciesBySlug(params.slug);
  if (!species) return { title: 'Espèce introuvable' };

  const cat = CATEGORY_BY_KEY[species.category];
  const description = `${species.commonName} (${species.latinName}) — ${cat.label.toLowerCase()} · ${DANGER_BY_LEVEL[species.danger].label}. ${species.shortNote}`;

  return {
    title: species.commonName,
    description,
    openGraph: {
      title: `${species.commonName} · KoikaSamui`,
      description,
      images: [
        {
          url: `/api/og?slug=${species.slug}`,
          width: 1200,
          height: 630,
          alt: `${species.commonName} (${species.latinName})`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${species.commonName} · KoikaSamui`,
      description,
      images: [`/api/og?slug=${species.slug}`],
    },
  };
}

export default function SpeciesDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const species = getSpeciesBySlug(params.slug);
  if (!species) notFound();

  const cat = CATEGORY_BY_KEY[species.category];
  const no = specimenNumber(species.slug);
  const similar = getSimilarSpecies(species);
  const spots = getSpeciesSpots(species);
  const sites = getSitesForSpecies(species);

  return (
    <article className="container-editorial py-10 sm:py-14">
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-sand">
        <Link href="/especes" className="transition-colors hover:text-gold">
          ← Toutes les espèces
        </Link>
      </nav>

      <SpeciesHero species={species} />

      {/* -------------------------------------------------- DESCRIPTION */}
      <section className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_260px]">
        <div>
          <p className="eyebrow">Notes de terrain</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ivory">
            À propos de l’espèce
          </h2>
          <p className="mt-5 text-[17px] leading-[1.75] text-ivory/90">
            {species.longDescription}
          </p>
        </div>

        <aside className="h-fit rounded-[var(--radius-lg)] border border-line bg-lacquer/50 p-5">
          <p className="eyebrow !text-sand">Fiche technique</p>
          <dl className="mt-4 flex flex-col gap-3 font-mono text-xs">
            <div className="flex justify-between gap-4">
              <dt className="text-sand">Spécimen</dt>
              <dd className="text-ivory">N° {String(no).padStart(3, '0')}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sand">Catégorie</dt>
              <dd className="text-ivory">{cat.label}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sand">Nom latin</dt>
              <dd className="text-right italic text-ivory">{species.latinName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sand">Dangerosité</dt>
              <dd className="text-ivory">{DANGER_BY_LEVEL[species.danger].label}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sand">Zones</dt>
              <dd className="text-right text-ivory">
                {species.zones.map((z) => ZONE_BY_KEY[z].label).join(', ')}
              </dd>
            </div>
          </dl>
        </aside>
      </section>

      {/* ------------------------------------------------------- CARTE */}
      {spots.length > 0 && (
        <section className="mt-16">
          <p className="eyebrow">Repérage</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ivory">
            Où l’observer
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            <MapView
              points={spots.map((s, i) => ({
                id: `${species.slug}-${i}`,
                name: s.name,
                lat: s.lat,
                lng: s.lng,
                tone: species.category === 'marine' ? 'teal' : 'gold',
              }))}
              fit
              wrapperClassName="h-[340px] sm:h-[420px]"
            />
            <ul className="flex flex-col gap-2">
              {sites.map((site) => (
                <li
                  key={site.id}
                  className="rounded-[var(--radius)] border border-line bg-lacquer/40 p-4"
                >
                  <p className="font-display text-sm font-semibold text-ivory">
                    {site.name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-sand">
                    {site.blurb}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------- SIMILAIRES */}
      {similar.length > 0 && (
        <section className="mt-16">
          <p className="eyebrow">À explorer aussi</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ivory">
            Espèces proches
          </h2>
          <div className="mt-6">
            <SpeciesGrid species={similar} />
          </div>
        </section>
      )}

      <div className="mt-16 flex justify-center">
        <Button href="/especes" variant="outline">
          ← Retour au catalogue
        </Button>
      </div>
    </article>
  );
}
