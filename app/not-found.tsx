import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="container-editorial flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Erreur 404</p>
      <h1 className="mt-4 font-display text-5xl font-semibold text-ivory">
        Spécimen introuvable
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-sand">
        Cette page s’est évaporée dans la canopée. Revenez au catalogue pour
        retrouver la faune de l’archipel.
      </p>
      <div className="mt-8 flex gap-3">
        <Button href="/especes">Voir les espèces</Button>
        <Button href="/" variant="ghost">
          Accueil
        </Button>
      </div>
    </div>
  );
}
