import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { bangkokToday, currentTripDayIndex, tripPhase } from '@/utils/datetime';
import { formatTHB } from '@/utils/format';
import { Card } from '@/components/ui';

/** Dashboard voyage compact : progression globale, dépenses, prochaine étape. */
export function TripDashboard() {
  const data = useLiveQuery(async () => {
    const [days, activities, expenses, legs] = await Promise.all([
      db.days.orderBy('index').toArray(),
      db.activities.toArray(),
      db.expenses.toArray(),
      db.routeLegs.toArray(),
    ]);
    return { days, activities, expenses, legs };
  }, []);

  if (!data) return null;
  const phase = tripPhase();
  const dayIndex = currentTripDayIndex();
  const relevant = data.activities.filter((a) => a.status !== 'skipped' && a.status !== 'postponed');
  const done = relevant.filter((a) => a.status === 'completed').length;
  const percent = relevant.length ? Math.round((done / relevant.length) * 100) : 0;
  const spent = data.expenses.reduce((s, e) => s + e.amount, 0);
  const kmDone = data.legs
    .filter((l) => l.mode === 'scooter' && l.status === 'completed')
    .reduce((s, l) => s + (l.distanceKm ?? 0), 0);
  const today = bangkokToday();
  const nextNight = data.days.find((d) => d.date >= today)?.nightPlace;

  return (
    <Card className="grid grid-cols-4 gap-2 text-center">
      <div>
        <p className="text-lg font-extrabold text-primary">
          {phase === 'during' ? `${dayIndex}/${data.days.length}` : phase === 'before' ? '—' : '✓'}
        </p>
        <p className="text-[10px] font-semibold uppercase text-ink-3">Jour</p>
      </div>
      <div>
        <p className="text-lg font-extrabold text-primary">{percent} %</p>
        <p className="text-[10px] font-semibold uppercase text-ink-3">
          {done}/{relevant.length} activités
        </p>
      </div>
      <div>
        <p className="text-lg font-extrabold text-primary">{Math.round(kmDone)}</p>
        <p className="text-[10px] font-semibold uppercase text-ink-3">Km scooter</p>
      </div>
      <div>
        <p className="text-lg font-extrabold text-primary">{formatTHB(spent)}</p>
        <p className="text-[10px] font-semibold uppercase text-ink-3">Dépensé</p>
      </div>
      {phase === 'during' && nextNight && (
        <p className="col-span-4 border-t border-line pt-2 text-xs font-semibold text-ink-2">
          🌙 Prochaine nuit : {nextNight}
        </p>
      )}
    </Card>
  );
}
