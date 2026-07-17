import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Hors ligne',
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="container-editorial flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Connexion perdue</p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-ivory sm:text-5xl">
        Vous êtes hors ligne
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-sand">
        Impossible de charger cette page sans connexion. Les pages déjà visitées
        restent consultables — reconnectez-vous pour explorer tout le bestiaire.
      </p>
      <div className="mt-8">
        <Button href="/">Retour à l’accueil</Button>
      </div>
    </div>
  );
}
