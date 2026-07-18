import { PokeBall } from '@/components/brand/PokeBall';

/**
 * Bandeau d'ouverture de fiche — crest doré centré (le logo agrandi, serti d'or)
 * flanqué de filets ornementaux. Donne le ton « carnet de terrain de luxe ».
 */
export function SpeciesMasthead() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex w-full max-w-sm items-center gap-4">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/45" />
        <span className="relative flex h-16 w-16 shrink-0 items-center justify-center">
          <span
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(230,195,78,0.4),transparent_70%)] blur-md"
            aria-hidden
          />
          <span className="absolute inset-0 rounded-full border border-gold/50" aria-hidden />
          <span className="absolute inset-[3px] rounded-full border border-gold/20" aria-hidden />
          <PokeBall className="h-11 w-11 drop-shadow-[0_0_12px_rgba(201,162,39,0.5)]" />
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/45" />
      </div>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.42em] text-gold/80">
        Carnet de terrain
      </p>
    </div>
  );
}
