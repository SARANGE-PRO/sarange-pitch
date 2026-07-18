import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllSlugs,
  getSpeciesBySlug,
  getSimilarSpecies,
  getAdjacentSpecies,
  specimenNumber,
} from '@/lib/species';
import { getSpeciesSpots, getSitesForSpecies } from '@/lib/geo';
import { getObservations } from '@/lib/observations';
import { inaturalistSearchUrl } from '@/lib/inaturalist';
import { CATEGORY_BY_KEY, DANGER_BY_LEVEL, ZONE_BY_KEY } from '@/data/taxonomy';
import { SpeciesHero } from '@/components/species/SpeciesHero';
import { SpeciesMasthead } from '@/components/species/SpeciesMasthead';
import { FieldBackdrop } from '@/components/species/FieldBackdrop';
import { CategoryIcon } from '@/components/species/CategoryIcon';
import { SpeciesGrid } from '@/components/species/SpeciesGrid';
import { SpeciesCompass } from '@/components/species/SpeciesCompass';
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
      title: `${species.commonName} · KoïKoSamui`,
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
      title: `${species.commonName} · KoïKoSamui`,
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
  const { prev, next } = getAdjacentSpecies(species.slug);
  const observations = getObservations(species.slug);

  const fmtDate = (iso: string) => {
    const [y, m, d] = iso.split('-');
    return d && m && y ? `${d}/${m}/${y}` : iso;
  };

  return (
    <article className="container-editorial py-8 sm:py-12">
      <FieldBackdrop />

      <nav className="flex items-center gap-2 font-mono text-xs text-sand">
        <Link href="/especes" className="transition-colors hover:text-gold">
          ← Toutes les espèces
        </Link>
      </nav>

      <div className="mt-6 mb-9 sm:mt-8 sm:mb-12">
        <SpeciesMasthead />
      </div>

      <SpeciesHero species={species} />

      {/* -------------------------------------------------- DESCRIPTION */}
      <section className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">
        <div>
          <p className="eyebrow">Notes de terrain</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ivory">
            À propos de l’espèce
          </h2>
          <p className="dropcap mt-5 text-[17px] leading-[1.8] text-ivory/90">
            {species.longDescription}
          </p>
        </div>

        <aside className="h-fit overflow-hidden rounded-[var(--radius-lg)] border border-gold/20 bg-lacquer/50 shadow-card">
          <div className="flex items-center justify-between gap-3 border-b border-line bg-gold/[0.05] px-5 py-3">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-gold/80">
              Fiche technique
            </span>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-sand/55">
              KKS-{String(no).padStart(3, '0')}
            </span>
          </div>
          <dl className="divide-y divide-line/70 px-5 font-mono text-xs">
            <SheetRow label="Spécimen">N° {String(no).padStart(3, '0')}</SheetRow>
            <SheetRow label="Catégorie">
              <span className="inline-flex items-center gap-1.5">
                <CategoryIcon
                  category={species.category}
                  className="h-3.5 w-3.5 text-gold/80"
                />
                {cat.label}
              </span>
            </SheetRow>
            <SheetRow label="Nom latin">
              <span className="italic">{species.latinName}</span>
            </SheetRow>
            <SheetRow label="Dangerosité">
              {DANGER_BY_LEVEL[species.danger].label}
            </SheetRow>
            <SheetRow label="Activité">
              <span className="capitalize">{species.activity}</span>
            </SheetRow>
            <SheetRow label="Zones">
              {species.zones.map((z) => ZONE_BY_KEY[z].label).join(', ')}
            </SheetRow>
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

          <div className="mt-6">
            <SpeciesCompass spots={spots} name={species.commonName} />
          </div>
        </section>
      )}

      {/* -------------------------------------- OBSERVATIONS RÉELLES (iNat) */}
      {observations.length > 0 && (
        <section className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                Données réelles — iNaturalist
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ivory">
                Observations récentes près de l’archipel
              </h2>
            </div>
            <a
              href={inaturalistSearchUrl(species.latinName)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-wider text-gold hover:underline"
            >
              Tout voir sur iNaturalist →
            </a>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            <MapView
              points={observations.map((o) => ({
                id: `obs-${o.id}`,
                name: o.date ? `Observé le ${fmtDate(o.date)}` : 'Observation',
                lat: o.lat,
                lng: o.lng,
                tone: 'teal' as const,
                blurb: `${o.placeGuess ? `${o.placeGuess} · ` : ''}${o.observer} · ${o.license}`,
                href: o.url,
                external: true,
                hrefLabel: 'Voir sur iNaturalist →',
                photoUrl: o.photoUrl,
              }))}
              fit
              wrapperClassName="h-[340px] sm:h-[420px]"
            />
            <ul className="flex flex-col gap-2">
              {observations.slice(0, 6).map((o) => (
                <li key={o.id}>
                  <a
                    href={o.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 rounded-[var(--radius)] border border-line bg-lacquer/40 p-3 transition-colors hover:border-teal/40"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-ivory">
                        {o.placeGuess || 'Lieu non précisé'}
                      </span>
                      <span className="font-mono text-[11px] text-sand">
                        {o.date ? fmtDate(o.date) : '—'} · {o.observer}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-[10px] uppercase text-teal">
                      {o.license}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 font-mono text-[11px] leading-relaxed text-sand/70">
            Observations et coordonnées : contributeurs iNaturalist (licences
            Creative Commons). Les positions peuvent être floutées pour les
            espèces sensibles.
          </p>
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

      {/* ------------------------------------------- NAV SPÉCIMEN PRÉC/SUIV */}
      <nav
        className="mt-16 grid grid-cols-2 items-stretch gap-3 border-t border-line pt-8 sm:grid-cols-[1fr_auto_1fr]"
        aria-label="Navigation entre espèces"
      >
        {prev ? (
          <Link
            href={`/especes/${prev.slug}`}
            className="group flex flex-col rounded-[var(--radius-lg)] border border-line bg-lacquer/50 p-4 transition-colors hover:border-gold/40 active:scale-[0.99]"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-sand">
              ← Précédent
            </span>
            <span className="mt-1 truncate font-display text-sm font-semibold text-ivory group-hover:text-gold">
              {prev.commonName}
            </span>
          </Link>
        ) : (
          <span />
        )}

        <div className="col-span-2 flex items-center justify-center sm:col-span-1">
          <Button href="/especes" variant="outline" size="sm">
            Catalogue
          </Button>
        </div>

        {next ? (
          <Link
            href={`/especes/${next.slug}`}
            className="group flex flex-col items-end rounded-[var(--radius-lg)] border border-line bg-lacquer/50 p-4 text-right transition-colors hover:border-gold/40 active:scale-[0.99]"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-sand">
              Suivant →
            </span>
            <span className="mt-1 w-full truncate font-display text-sm font-semibold text-ivory group-hover:text-gold">
              {next.commonName}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}

/** Ligne de la fiche technique (étiquette spécimen). */
function SheetRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="shrink-0 text-sand">{label}</dt>
      <dd className="max-w-[62%] text-right text-ivory">{children}</dd>
    </div>
  );
}
