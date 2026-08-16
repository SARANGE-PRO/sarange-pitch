import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { ArrowRight, Bike, Moon, Plane } from 'lucide-react';
import { db } from '@/db';
import { bangkokToday, frenchDateShort, minutesToHuman } from '@/utils/datetime';
import { computeProgress } from '@/services/itinerary';
import { Badge, Card, ProgressBar, SkeletonCard } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { WeatherInline } from '@/components/WeatherCard';
import { TripDashboard } from '@/components/TripDashboard';

/** Parcours global : les 7 jours du road-trip, très visuel. */
export default function ItineraryPage() {
  const today = bangkokToday();
  const data = useLiveQuery(async () => {
    const days = await db.days.orderBy('index').toArray();
    return Promise.all(
      days.map(async (day) => {
        const [activities, legs, accommodation] = await Promise.all([
          db.activities.where('dayId').equals(day.id).toArray(),
          db.routeLegs.where('dayId').equals(day.id).toArray(),
          db.accommodations.where('dayId').equals(day.id).first(),
        ]);
        return { day, activities, legs, accommodation };
      }),
    );
  }, []);

  if (!data) {
    return (
      <div className="space-y-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Parcours" subtitle="30 août → 5 septembre 2026 · Nord de la Thaïlande" />
      <TripDashboard />
      <div className="space-y-3">
        {data.map(({ day, activities, legs, accommodation }) => {
          const progress = computeProgress(activities);
          const km = legs.reduce((s, l) => s + (l.distanceKm ?? 0), 0);
          const road = legs.reduce((s, l) => s + (l.plannedDuration ?? 0), 0);
          const isToday = day.date === today;
          const isPast = day.date < today;
          const main = [...activities]
            .sort((a, b) => a.order - b.order)
            .filter((a) => a.priority === 'must' || a.priority === 'high')
            .slice(0, 3);
          return (
            <Link key={day.id} to={`/jour/${day.id}`} className="block">
              <Card className={`${isToday ? 'ring-2 ring-primary' : ''} ${isPast ? 'opacity-75' : ''}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-3">
                    Jour {day.index} · {frenchDateShort(day.date)}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {isToday && <Badge tone="primary">Aujourd'hui</Badge>}
                    {progress.percent === 100 && progress.total > 0 && <Badge tone="ok">Terminé</Badge>}
                    <WeatherInline date={day.date} />
                  </div>
                </div>
                <p className="mt-1 flex items-center gap-2 text-base font-extrabold">
                  {day.from}
                  {day.from !== day.to && (
                    <>
                      <ArrowRight size={16} className="text-ink-3" />
                      {day.to}
                    </>
                  )}
                </p>
                {main.length > 0 && (
                  <p className="mt-1 truncate text-xs text-ink-2">{main.map((a) => a.title).join(' · ')}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-ink-2">
                  {km > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Bike size={13} /> {Math.round(km)} km · {minutesToHuman(road)}
                    </span>
                  )}
                  {day.flightDay && (
                    <span className="inline-flex items-center gap-1">
                      <Plane size={13} /> Vol
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Moon size={13} /> {accommodation?.city ?? day.nightPlace}
                  </span>
                </div>
                {day.warning && <p className="mt-2 text-xs font-bold text-warn">⚠️ {day.warning}</p>}
                <ProgressBar value={progress.percent} className="mt-3" />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
