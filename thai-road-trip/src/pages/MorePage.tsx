import { Link } from 'react-router-dom';
import {
  BedDouble, Bike, ChevronRight, ClipboardList, Heart, Phone, Plane, Search, Settings, Ticket, Wallet,
} from 'lucide-react';
import { Card } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { TripDashboard } from '@/components/TripDashboard';

const LINKS = [
  { to: '/recherche', icon: Search, label: 'Recherche', sub: 'Lieux, notes, activités, vols…' },
  { to: '/budget', icon: Wallet, label: 'Budget', sub: 'Dépenses en THB, essence, graphiques' },
  { to: '/checklist', icon: ClipboardList, label: 'Checklist', sub: 'Documents, scooter, rando, électronique' },
  { to: '/transports', icon: Plane, label: 'Transports', sub: 'Vols et trajets, compte à rebours' },
  { to: '/hebergements', icon: BedDouble, label: 'Hébergements', sub: 'Une nuit par ligne' },
  { to: '/reservations', icon: Ticket, label: 'Réservations', sub: 'Vols, hôtels, scooter, guides' },
  { to: '/scooter', icon: Bike, label: 'Location scooter', sub: 'Fiche loueur + photos d’état' },
  { to: '/favoris', icon: Heart, label: 'Favoris', sub: 'Lieux et notes aimés' },
  { to: '/urgence', icon: Phone, label: 'Urgence', sub: 'Numéros importants (à renseigner)' },
  { to: '/reglages', icon: Settings, label: 'Réglages', sub: 'Thème, météo, sauvegarde, reset' },
];

export default function MorePage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Plus" />
      <TripDashboard />
      <div className="space-y-2">
        {LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.to} to={link.to} className="block">
              <Card className="flex items-center gap-3.5 !p-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{link.label}</span>
                  <span className="block truncate text-xs text-ink-3">{link.sub}</span>
                </span>
                <ChevronRight size={17} className="text-ink-3" />
              </Card>
            </Link>
          );
        })}
      </div>
      <p className="pb-4 text-center text-xs text-ink-3">
        Thai Road Trip · local-first · vos données restent sur cet appareil
      </p>
    </div>
  );
}
