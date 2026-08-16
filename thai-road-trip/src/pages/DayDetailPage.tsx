import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BedDouble, Bike, Moon, Plus, Rocket } from 'lucide-react';
import { db } from '@/db';
import { frenchDate, minutesToHuman } from '@/utils/datetime';
import { computeProgress, createActivity } from '@/services/itinerary';
import { formatTHB } from '@/utils/format';
import {
  Badge, BottomSheet, Button, Card, Field, ProgressBar, Select, TextInput, useDisclosure,
} from '@/components/ui';
import { CATEGORY_META } from '@/components/ui/CategoryIcon';
import { PageHeader } from '@/components/layout/PageHeader';
import { Timeline } from '@/components/Timeline';
import { WeatherCard } from '@/components/WeatherCard';
import { RainPlanButton } from '@/components/RainPlan';
import { CatchUpSection } from '@/components/CatchUpSection';
import { useToast } from '@/hooks/useToast';
import type { Category } from '@/types';

/** Détail d'une journée : résumé, météo, route, timeline éditable, nuit, dépenses. */
export default function DayDetailPage() {
  const { dayId } = useParams<{ dayId: string }>();
  const addSheet = useDisclosure();

  const data = useLiveQuery(async () => {
    if (!dayId) return null;
    const day = await db.days.get(dayId);
    if (!day) return null;
    const [activities, legs, accommodation, expenses, notes] = await Promise.all([
      db.activities.where('dayId').equals(dayId).toArray(),
      db.routeLegs.where('dayId').equals(dayId).sortBy('order'),
      db.accommodations.where('dayId').equals(dayId).first(),
      db.expenses.where('date').equals(day.date).toArray(),
      db.notes.where('date').equals(day.date).toArray(),
    ]);
    return { day, activities, legs, accommodation, expenses, notes };
  }, [dayId]);

  if (!data) return <div className="skeleton h-40" />;
  const { day, activities, legs, accommodation, expenses, notes } = data;
  const progress = computeProgress(activities);
  const km = legs.reduce((s, l) => s + (l.distanceKm ?? 0), 0);
  const road = legs.reduce((s, l) => s + (l.plannedDuration ?? 0), 0);
  const spent = expenses.reduce((s, e) => s + e.amount, 0);
  const hasRoad = legs.some((l) => l.mode === 'scooter') || activities.some((a) => a.category === 'hike');
  const wx = weatherCenter(day.id);

  return (
    <div className="space-y-4">
      <PageHeader back title={`Jour ${day.index} · ${day.title}`} subtitle={frenchDate(day.date)} />

      <Card>
        <p className="text-sm text-ink-2">{day.summary}</p>
        {day.warning && <p className="mt-2 text-xs font-bold text-warn">⚠️ {day.warning}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-ink-2">
          {km > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Bike size={15} /> {Math.round(km)} km · {minutesToHuman(road)}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Moon size={15} /> {day.nightPlace}
          </span>
        </div>
        <ProgressBar value={progress.percent} className="mt-3" />
        <p className="mt-1.5 text-xs text-ink-3">
          {progress.done} / {progress.total} activités · {progress.percent} %
        </p>
      </Card>

      <WeatherCard date={day.date} latitude={wx.lat} longitude={wx.lon} compact />

      <div className="grid grid-cols-2 gap-2">
        {hasRoad && (
          <Link to={`/depart/${day.id}`}>
            <Button variant="accent" full>
              <Rocket size={16} /> Mode départ
            </Button>
          </Link>
        )}
        <RainPlanButton dayId={day.id} />
        {!hasRoad && (
          <Button variant="secondary" full onClick={addSheet.onOpen}>
            <Plus size={16} /> Ajouter
          </Button>
        )}
      </div>

      {day.jokerDay && <CatchUpSection />}

      {legs.length > 0 && (
        <section>
          <h2 className="mb-2 text-lg font-extrabold">Route</h2>
          <div className="space-y-2">
            {legs.map((leg) => (
              <Card key={leg.id} className="flex items-center gap-3 !p-3">
                <span className="text-xl">{leg.mode === 'plane' ? '✈️' : leg.mode === 'scooter' ? '🛵' : '🚕'}</span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-bold">
                    {leg.from} <ArrowRight size={13} className="text-ink-3" /> {leg.to}
                  </p>
                  <p className="text-xs text-ink-3">
                    {leg.distanceKm !== undefined && `${Math.round(leg.distanceKm)} km`}
                    {leg.plannedDuration !== undefined && ` · ${minutesToHuman(leg.plannedDuration)}`}
                    {leg.recommendedDeparture && ` · départ conseillé ${leg.recommendedDeparture}`}
                  </p>
                </div>
                {leg.status === 'completed' && <Badge tone="ok">Fait</Badge>}
                {leg.status === 'in_progress' && (
                  <Link to={`/route/${leg.id}`}>
                    <Badge tone="primary">En cours</Badge>
                  </Link>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-extrabold">Timeline</h2>
          <Button variant="ghost" onClick={addSheet.onOpen} className="!min-h-[40px] !px-3 text-xs">
            <Plus size={15} /> Ajouter une activité
          </Button>
        </div>
        <Timeline activities={activities} editable />
      </section>

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

      <div className="grid grid-cols-2 gap-2">
        <Link to="/budget">
          <Card className="text-center">
            <p className="text-lg font-extrabold text-primary">{formatTHB(spent)}</p>
            <p className="text-xs font-semibold text-ink-3">Dépenses du jour</p>
          </Card>
        </Link>
        <Link to="/notes">
          <Card className="text-center">
            <p className="text-lg font-extrabold text-primary">{notes.length}</p>
            <p className="text-xs font-semibold text-ink-3">Notes du jour</p>
          </Card>
        </Link>
      </div>

      <AddActivitySheet dayId={day.id} open={addSheet.open} onClose={addSheet.onClose} />
    </div>
  );
}

function weatherCenter(dayId: string): { lat: number; lon: number } {
  if (dayId === 'd3') return { lat: 18.8656, lon: 99.3517 };
  if (dayId === 'd4' || dayId === 'd5') return { lat: 18.5385, lon: 98.5244 };
  if (dayId === 'd7') return { lat: 13.7563, lon: 100.5018 };
  return { lat: 18.7889, lon: 98.9853 };
}

export function AddActivitySheet({
  dayId,
  open,
  onClose,
}: {
  dayId: string;
  open: boolean;
  onClose: () => void;
}) {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [start, setStart] = useState('');
  const [duration, setDuration] = useState('');

  return (
    <BottomSheet open={open} onClose={onClose} title="Ajouter une activité">
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!title.trim()) return;
          await createActivity({
            dayId,
            title: title.trim(),
            category,
            plannedStartTime: start || undefined,
            plannedDuration: duration ? Number(duration) : undefined,
            status: 'planned',
            priority: 'normal',
            weatherSensitive: false,
          });
          setTitle('');
          setStart('');
          setDuration('');
          onClose();
          toast('Activité ajoutée');
        }}
      >
        <Field label="Titre">
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex : café avec vue" required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Heure">
            <TextInput type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
          <Field label="Durée (min)">
            <TextInput type="number" inputMode="numeric" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </Field>
        </div>
        <Field label="Catégorie">
          <Select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </Select>
        </Field>
        <Button full type="submit">
          Ajouter
        </Button>
      </form>
    </BottomSheet>
  );
}
