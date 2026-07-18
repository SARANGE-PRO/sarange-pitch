/**
 * Bandeau d'ouverture de fiche — filet ornemental doré + libellé « Carnet de
 * terrain ». Pas de logo (la marque est déjà portée par l'en-tête juste au-dessus).
 */
export function SpeciesMasthead() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex w-full max-w-xs items-center gap-4">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/40" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold/70 shadow-[0_0_10px_rgba(201,162,39,0.6)]" />
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/40" />
      </div>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.42em] text-gold/80">
        Carnet de terrain
      </p>
    </div>
  );
}
