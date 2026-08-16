import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BedDouble, Bike, CalendarCheck, ClipboardList, Moon, Mountain, Plane, Rocket, Route as RouteIcon,
} from 'lucide-react';
import { db } from '@/db';
import { useNow } from '@/hooks/useNow';
import {
  TRIP_END, bangkokToday, currentTripDayIndex, daysUntilTrip, frenchDate, minutesToHuman, tripPhase,
} from '@/utils/datetime';
import { computeProgress } from '@/services/itinerary';
import { Badge, Button, Card, ProgressBar, SkeletonCard } from '@/components/ui';
import { Timeline } from '@/components/Timeline';
import { WeatherCard } from '@/components/WeatherCard';
import { RainPlanButton } from '@/components/RainPlan';
import { CatchUpSection } from '@/components/CatchUpSection';
import { FlightCountdown } from '@/components/FlightCountdown';
import { ProximityPrompt } from '@/components/ProximityPrompt';
import { PageHeader } from '@/components/layout/PageHeader';

/** Écran principal : jour courant calculé en Asia/Bangkok. */
export default function TodayPage() {
  const now = useNow();
  const phase = tripPhase(now);
  if (phase === 'before') return <BeforeTripScreen />;
  if (phase === 'after') return <AfterTripScreen />;
  return <DuringTripScreen />;
}

function DuringTripScreen() {
  const now = useNow();
  const dayIndex = currentTripDayIndex(now);
  const today = bangkokToday(now);

  const data = useLiveQuery(async () => {
    const day = await db.days.where('index').equals(dayIndex).first();
    if (!day) return null;
    const [activities, legs, accommodation, totalDays] = await Promise.all([
      db.activities.where('dayId').equals(day.id).toArray(),
      db.routeLegs.where('dayId').equals(day.id).sortBy('order'),
      db.accommodations.where('dayId').equals(day.id).first(),
      db.days.count(),
    ]);
    return { day, activities, legs, accommodation, totalDays };
  }, [dayIndex]);

  if (!data) {
    return (
      <div className="space-y-3">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }
  const { day, activities, legs, accommodation, totalDays } = data;
  const progress = computeProgress(activities);
  const scooterLeg = legs.find((l) => l.mode === 'scooter');
  const totalKm = legs.reduce((s, l) => s + (l.distanceKm ?? 0), 0);
  const totalRoad = legs.reduce((s, l) => s + (l.plannedDuration ?? 0), 0);
  const nextActivity = [...activities]
    .sort((a, b) => a.order - b.order)
    .find((a) => a.status === 'planned' || a.status === 'in_progress');
  const remaining = activities.filter((a) => a.status === 'planned' || a.status === 'in_progress').length;
  const hasHike = activities.some((a) => a.category === 'hike' && a.status !== 'skipped' && a.status !== 'postponed');
  // Le 4 au soir / le 5 : priorité au transport vers Bangkok
  const bangkokFocus = day.flightDay && (day.id === 'd6' || day.id === 'd7');

  return (
    <div className="space-y-4">
      <PageHeader title={`Jour ${day.index} / ${totalDays}`} subtitle={frenchDate(day.date)} />

      {/* Héro : où on est → où on va */}
      <Card className="bg-gradient-to-br from-primary to-primary/85 !text-primary-ink">
        <div className="flex items-center gap-2 text-lg font-extrabold">
          {day.from}
          {day.from !== day.to && (
            <>
              <ArrowRight size={18} className="opacity-80" />
              {day.to}
            </>
          )}
        </div>
        <p className="mt-1 text-sm opacity-90">{day.summary}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm font-semibold">
          {totalKm > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Bike size={15} /> {Math.round(totalKm)} km
            </span>
          )}
          {totalRoad > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <RouteIcon size={15} /> {minutesToHuman(totalRoad)} de route
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Moon size={15} /> {day.nightPlace}
          </span>
        </div>
        {day.warning && (
          <p className="mt-3 rounded-xl bg-black/20 p-2.5 text-xs font-bold uppercase tracking-wide">
            ⚠️ {day.warning}
          </p>
        )}
      </Card>

      <FlightCountdown />

      {bangkokFocus && <BangkokFocusCard dayId={day.id} />}

      <WeatherCard date={today} latitude={centerFor(day.id).lat} longitude={centerFor(day.id).lon} />

      <ProximityPrompt dayId={day.id} />

      {/* Prochaine étape + progression */}
      <Card>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-ink-2">Prochaine étape</p>
          <Badge tone="primary">{remaining} restante{remaining > 1 ? 's' : ''}</Badge>
        </div>
        {nextActivity ? (
          <p className="mt-1 text-lg font-extrabold">
            {nextActivity.plannedStartTime && <span className="text-primary">{nextActivity.plannedStartTime} · </span>}
            {nextActivity.title}
          </p>
        ) : (
          <p className="mt-1 text-base font-semibold text-ok">Journée terminée 🎉</p>
        )}
        <ProgressBar value={progress.percent} className="mt-3" />
        <p className="mt-1.5 text-xs text-ink-3">
          {progress.done} / {progress.total} activités · {progress.percent} %
        </p>
      </Card>

      {/* Actions du jour */}
      <div className="grid grid-cols-2 gap-2">
        {(scooterLeg || hasHike) && (
          <Link to={`/depart/${day.id}`} className="col-span-2">
            <Button variant="accent" full>
              <Rocket size={17} /> Mode départ
            </Button>
          </Link>
        )}
        <RainPlanButton dayId={day.id} />
        <Link to={`/jour/${day.id}`}>
          <Button variant="secondary" full>
            <CalendarCheck size={17} /> Détail du jour
          </Button>
        </Link>
      </div>

      {day.jokerDay && <CatchUpSection />}

      {/* Nuit */}
      <Link to="/hebergements">
        <Card className="flex items-center gap-3">
          <BedDouble size={20} className="text-primary" />
          <div className="flex-1">
            <p className="text-sm font-bold">Nuit · {accommodation?.city ?? day.nightPlace}</p>
            <p className="text-xs text-ink-3">{accommodation?.name ?? 'Hébergement à renseigner'}</p>
          </div>
          <ArrowRight size={16} className="text-ink-3" />
        </Card>
      </Link>

      {/* Timeline du jour */}
      <section>
        <h2 className="mb-2 text-lg font-extrabold">Programme du jour</h2>
        <Timeline activities={activities} />
      </section>
    </div>
  );
}

/** Coordonnées de référence météo par jour (zone où l'on se trouve). */
function centerFor(dayId: string): { lat: number; lon: number } {
  switch (dayId) {
    case 'd3':
      return { lat: 18.8656, lon: 99.3517 }; // Mae Kampong
    case 'd4':
    case 'd5':
      return { lat: 18.5385, lon: 98.5244 }; // Doi Inthanon / Mae Klang Luang
    case 'd6':
      return { lat: 18.7889, lon: 98.9853 }; // Chiang Mai
    case 'd7':
      return { lat: 13.7563, lon: 100.5018 }; // Bangkok
    default:
      return { lat: 18.7889, lon: 98.9853 };
  }
}

function BangkokFocusCard({ dayId }: { dayId: string }) {
  const transport = useLiveQuery(
    () => db.transports.get(dayId === 'd6' ? 't-cnx-bkk' : 't-intl'),
    [dayId],
  );
  return (
    <Card className="border-l-4 border-danger">
      <p className="flex items-center gap-2 text-sm font-extrabold text-danger">
        <Plane size={16} /> Priorité : {dayId === 'd6' ? 'rejoindre Bangkok ce soir' : "rejoindre l'aéroport"}
      </p>
      <p className="mt-1 text-xs text-ink-2">
        {transport?.departureTime
          ? `Vol ${transport.company ?? ''} ${transport.number ?? ''} à ${transport.departureTime}${transport.terminal ? ` · terminal ${transport.terminal}` : ''}`
          : 'Détails du vol à renseigner dans Transports.'}
      </p>
      <Link to="/transports" className="mt-2 block">
        <Button variant="secondary" full className="!min-h-[40px] text-xs">
          Voir les transports
        </Button>
      </Link>
    </Card>
  );
}

/** Avant le voyage : écran de préparation. */
function BeforeTripScreen() {
  const now = useNow();
  const days = daysUntilTrip(now);
  const data = useLiveQuery(async () => {
    const [checklist, transports] = await Promise.all([db.checklist.toArray(), db.transports.toArray()]);
    return {
      checklistDone: checklist.filter((c) => c.checked).length,
      checklistTotal: checklist.length,
      toBook: transports.filter((t) => t.status === 'to_book'),
    };
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader title="Préparation" subtitle="Road-trip Thaïlande · 30 août → 5 septembre 2026" />
      <Card className="bg-gradient-to-br from-primary to-primary/85 text-center !text-primary-ink">
        <p className="text-5xl font-extrabold">{days}</p>
        <p className="mt-1 text-sm font-semibold opacity-90">jour{days > 1 ? 's' : ''} avant le départ</p>
      </Card>
      {data && data.toBook.length > 0 && (
        <Card>
          <p className="mb-2 flex items-center gap-2 text-sm font-bold">
            <Plane size={16} className="text-accent" /> Réservations à compléter
          </p>
          <ul className="space-y-1.5">
            {data.toBook.map((t) => (
              <li key={t.id} className="text-sm text-ink-2">
                • {t.origin} → {t.destination} <Badge tone="warn">À renseigner</Badge>
              </li>
            ))}
          </ul>
          <Link to="/transports" className="mt-3 block">
            <Button variant="secondary" full className="!min-h-[40px] text-xs">
              Compléter les transports
            </Button>
          </Link>
        </Card>
      )}
      <Link to="/checklist">
        <Card className="flex items-center gap-3">
          <ClipboardList size={20} className="text-primary" />
          <div className="flex-1">
            <p className="text-sm font-bold">Checklist</p>
            <p className="text-xs text-ink-3">
              {data ? `${data.checklistDone} / ${data.checklistTotal} éléments cochés` : '…'}
            </p>
          </div>
          <ArrowRight size={16} className="text-ink-3" />
        </Card>
      </Link>
      <Link to="/parcours">
        <Card className="flex items-center gap-3">
          <Mountain size={20} className="text-primary" />
          <div className="flex-1">
            <p className="text-sm font-bold">Voir le parcours complet</p>
            <p className="text-xs text-ink-3">7 jours · Chiang Mai, Mae Kampong, Doi Inthanon, Bangkok</p>
          </div>
          <ArrowRight size={16} className="text-ink-3" />
        </Card>
      </Link>
    </div>
  );
}

/** Après le voyage : résumé. */
function AfterTripScreen() {
  const data = useLiveQuery(async () => {
    const [activities, expenses, notes, places, legs, hikes] = await Promise.all([
      db.activities.toArray(),
      db.expenses.toArray(),
      db.notes.toArray(),
      db.places.toArray(),
      db.routeLegs.toArray(),
      db.hikes.toArray(),
    ]);
    return {
      completed: activities.filter((a) => a.status === 'completed').length,
      spent: expenses.reduce((s, e) => s + e.amount, 0),
      notes: notes.length,
      favorites: places.filter((p) => p.favorite).length,
      km: legs.filter((l) => l.mode === 'scooter' && l.status === 'completed').reduce((s, l) => s + (l.distanceKm ?? 0), 0),
      hikes: hikes.filter((h) => h.endedAt).length,
      placesVisited: new Set(
        activities.filter((a) => a.status === 'completed' && a.placeId).map((a) => a.placeId),
      ).size,
    };
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader title="Voyage terminé 🎉" subtitle={`Thaïlande · 30 août → ${frenchDate(TRIP_END).split(' ').slice(1).join(' ')} 2026`} />
      <div className="grid grid-cols-2 gap-2">
        <StatTile label="Lieux visités" value={data?.placesVisited ?? 0} />
        <StatTile label="Activités terminées" value={data?.completed ?? 0} />
        <StatTile label="Km scooter" value={data?.km ?? 0} />
        <StatTile label="Randonnées" value={data?.hikes ?? 0} />
        <StatTile label="Dépenses (฿)" value={data ? Math.round(data.spent).toLocaleString('fr-FR') : 0} />
        <StatTile label="Notes & favoris" value={`${data?.notes ?? 0} · ${data?.favorites ?? 0}`} />
      </div>
      <Link to="/reglages">
        <Button full>Exporter mes souvenirs</Button>
      </Link>
      <Link to="/parcours">
        <Button variant="secondary" full>
          Revoir le parcours
        </Button>
      </Link>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="text-center">
      <p className="text-2xl font-extrabold text-primary">{value}</p>
      <p className="mt-0.5 text-xs font-semibold text-ink-3">{label}</p>
    </Card>
  );
}
