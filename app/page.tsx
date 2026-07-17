import Link from 'next/link';
import { getAllSpecies, getSpeciesBySlug, countByCategory } from '@/lib/species';
import { CATEGORIES } from '@/data/taxonomy';
import { SpeciesCard } from '@/components/species/SpeciesCard';
import { CategoryCard } from '@/components/home/CategoryCard';
import { HeroConstellation } from '@/components/home/HeroConstellation';
import { Button } from '@/components/ui/Button';

const SIGNATURE = [
  'requin-baleine',
  'cobra-a-lunettes',
  'python-reticule',
  'tortue-verte',
];

export default function HomePage() {
  const all = getAllSpecies();
  const counts = countByCategory();
  const signature = SIGNATURE.map((s) => getSpeciesBySlug(s)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s),
  );

  return (
    <>
      {/* ------------------------------------------------------------- HERO */}
      <section className="kranok relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <HeroConstellation className="absolute inset-0 h-full w-full opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-night/40 via-night/70 to-night" />
          <div className="absolute inset-0 bg-gradient-to-r from-night via-transparent to-transparent" />
        </div>

        <div className="container-editorial relative flex min-h-[82vh] flex-col justify-center py-24">
          <div className="max-w-2xl">
            <p className="eyebrow flex items-center gap-3 animate-fade-up">
              <span className="h-px w-7 bg-teal" />
              Carnet de terrain — Golfe de Thaïlande
            </p>
            <h1
              className="mt-5 font-display text-[clamp(2.6rem,7vw,4.75rem)] font-semibold leading-[0.98] text-ivory text-balance animate-fade-up"
              style={{ animationDelay: '80ms' }}
            >
              Le bestiaire vivant de{' '}
              <em className="font-medium not-italic text-gold">Koh Samui</em> &amp;
              des îles
            </h1>
            <p
              className="mt-6 max-w-xl text-lg leading-relaxed text-sand animate-fade-up"
              style={{ animationDelay: '160ms' }}
            >
              De la canopée d’Ang Thong aux récifs de Koh Tao : {all.length}{' '}
              espèces observables, classées par catégorie, dangerosité et lieu.
              Un herbier numérique de la faune de l’archipel.
            </p>

            <div
              className="mt-9 flex flex-wrap gap-3 animate-fade-up"
              style={{ animationDelay: '240ms' }}
            >
              <Button href="/especes">Explorer les espèces</Button>
              <Button href="/carte" variant="outline">
                Voir la carte de l’archipel
              </Button>
            </div>

            <dl
              className="mt-12 flex flex-wrap gap-x-10 gap-y-4 font-mono text-xs text-sand animate-fade-up"
              style={{ animationDelay: '320ms' }}
            >
              <div className="flex items-baseline gap-2">
                <dt className="text-2xl font-medium text-ivory">{all.length}</dt>
                <dd>spécimens répertoriés</dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="text-2xl font-medium text-ivory">6</dt>
                <dd>catégories</dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="text-2xl font-medium text-ivory">5</dt>
                <dd>lieux d’observation</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- CATÉGORIES */}
      <section className="container-editorial py-20">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Par catégorie</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ivory">
              Explorer la faune
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-sand">
            Six règnes, de la forêt intérieure au grand large. Chaque fiche
            détaille dangerosité, lieux et anecdotes de terrain.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.key}
              category={cat}
              count={counts[cat.key] ?? 0}
            />
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- SIGNATURE */}
      <section className="border-t border-line bg-lacquer/30">
        <div className="container-editorial py-20">
          <div className="mb-10">
            <p className="eyebrow">Spécimens signatures</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ivory">
              Les incontournables de l’archipel
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {signature.map((s, i) => (
              <SpeciesCard key={s.slug} species={s} priority={i < 2} />
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- CTA */}
      <section className="container-editorial py-20">
        <div className="kranok relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-lacquer px-8 py-14 text-center">
          <p className="eyebrow justify-center">Prêt à explorer ?</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold text-ivory sm:text-4xl">
            Toute la faune de Koh Samui, à portée de filtre
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-sand">
            Cherchez par nom, filtrez par dangerosité ou par lieu, et localisez
            chaque espèce sur la carte de l’archipel.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button href="/especes">Parcourir les {all.length} espèces</Button>
            <Button href="/a-propos" variant="ghost">
              Méthodologie &amp; sources
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
