import Link from 'next/link';
import Image from 'next/image';
import { NAV_LINKS } from './nav-links';
import { getAllSpecies } from '@/lib/species';

export function Footer() {
  const total = getAllSpecies().length;
  return (
    <footer className="pb-safe mt-24 border-t border-line">
      <div className="container-editorial grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-2">
          <Image
            src="/brand/logo.png"
            alt="KoïKoSamui"
            width={800}
            height={416}
            unoptimized
            className="h-10 w-auto"
          />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-sand">
            Bestiaire de terrain de la faune du Golfe de Thaïlande — Koh Samui,
            Koh Phangan, Koh Tao et le parc marin d’Ang Thong. {total} spécimens
            de la canopée au récif.
          </p>
        </div>

        <nav aria-label="Navigation pied de page">
          <h2 className="eyebrow !text-sand">Explorer</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-sand transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow !text-sand">Sécurité</h2>
          <p className="mt-3 text-sm leading-relaxed text-sand">
            Gardez vos distances avec la faune sauvage, ne la nourrissez jamais,
            et consultez un médecin en cas de morsure ou piqûre suspecte.
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-editorial flex flex-col gap-2 py-6 font-mono text-[11px] leading-relaxed text-sand/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Photos : Wikimedia Commons (licences CC / domaine public) —{' '}
            <Link href="/a-propos" className="text-gold hover:underline">
              crédits &amp; méthodologie
            </Link>
            .
          </p>
          <p>Fiche à visée informative — © {new Date().getFullYear()} KoïKoSamui.</p>
        </div>
      </div>
    </footer>
  );
}
