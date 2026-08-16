import { useLiveQuery } from 'dexie-react-hooks';
import { Plane } from 'lucide-react';
import { db } from '@/db';
import { useNow } from '@/hooks/useNow';
import { formatCountdown, msUntil } from '@/utils/datetime';
import { Card } from '@/components/ui';
import { Link } from 'react-router-dom';

/** Compte à rebours réservé aux transports critiques (vols) renseignés. */
export function FlightCountdown() {
  const now = useNow(30_000);
  const transports = useLiveQuery(
    () => db.transports.filter((t) => t.critical).toArray(),
    [],
  );
  if (!transports) return null;

  const upcoming = transports
    .filter((t) => t.departureTime)
    .map((t) => ({ t, ms: msUntil(t.date, t.departureTime as string, now) }))
    .filter(({ ms }) => ms > 0 && ms < 48 * 3600_000)
    .sort((a, b) => a.ms - b.ms)[0];

  if (!upcoming) return null;

  return (
    <Link to="/transports">
      <Card className="flex items-center gap-3 border-l-4 border-accent !bg-accent-soft/60">
        <Plane size={20} className="text-accent" />
        <div className="flex-1">
          <p className="text-sm font-bold">
            {upcoming.t.origin} → {upcoming.t.destination}
          </p>
          <p className="text-xs text-ink-2">
            {upcoming.t.company ?? 'Vol'} {upcoming.t.number ?? ''} · départ {upcoming.t.departureTime}
          </p>
        </div>
        <p className="text-base font-extrabold text-accent">dans {formatCountdown(upcoming.ms)}</p>
      </Card>
    </Link>
  );
}
