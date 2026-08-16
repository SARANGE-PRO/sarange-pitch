import { useLiveQuery } from 'dexie-react-hooks';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Flag, Mountain } from 'lucide-react';
import { db } from '@/db';
import { uid } from '@/utils/id';
import { minutesToHuman } from '@/utils/datetime';
import { setActivityStatus } from '@/services/itinerary';
import { Badge, Button, Card } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { WeatherCard } from '@/components/WeatherCard';
import { NavigationButtons } from './RoadTripModePage';
import { useToast } from '@/hooks/useToast';

/** Fiches spécifiques par randonnée (difficulté, checkpoints, équipement). */
const HIKE_SHEETS: Record<
  string,
  { difficulty: string; lengthKm: string; altitude?: string; guide?: string; checkpoints: string[]; equipment: string[] }
> = {
  'monks-trail-trailhead': {
    difficulty: 'Facile à modérée',
    lengthKm: '~2 km (montée)',
    altitude: '~300 m de dénivelé',
    checkpoints: ['Départ du sentier (drapeaux orange)', 'Traversées de ruisseau', 'Wat Pha Lat'],
    equipment: ['Chaussures avec grip', 'Eau', 'Protection pluie', 'Anti-moustique'],
  },
  'pha-dok-siew-trail': {
    difficulty: 'Modérée',
    lengthKm: '~3,5 km (descente principalement)',
    altitude: 'Départ ~1 300 m',
    guide: 'Guide local Karen obligatoire — se présenter au village de Mae Klang Luang.',
    checkpoints: [
      'Départ avec le guide',
      'Cascade Pha Dok Siew',
      'Sentiers en jungle',
      'Plantations de café',
      'Rizières en terrasses',
      'Village Karen (Mae Klang Luang)',
    ],
    equipment: ['Chaussures avec grip', 'Eau', 'Protection pluie', 'Crème solaire', 'Anti-moustique', 'Espèces pour le guide'],
  },
};

export default function HikePage() {
  const { activityId } = useParams<{ activityId: string }>();
  const toast = useToast();

  const data = useLiveQuery(async () => {
    if (!activityId) return null;
    const activity = await db.activities.get(activityId);
    if (!activity) return null;
    const [place, day, session] = await Promise.all([
      activity.placeId ? db.places.get(activity.placeId) : undefined,
      db.days.get(activity.dayId),
      db.hikes.where('activityId').equals(activityId).first(),
    ]);
    return { activity, place, day, session };
  }, [activityId]);

  if (!data) return <div className="skeleton h-40" />;
  const { activity, place, day, session } = data;
  const sheet = (place && HIKE_SHEETS[place.id]) ?? {
    difficulty: 'À évaluer sur place',
    lengthKm: '—',
    checkpoints: [],
    equipment: ['Chaussures avec grip', 'Eau', 'Protection pluie'],
  };
  const done = Boolean(session?.endedAt);
  const inProgress = Boolean(session && !session.endedAt);
  const realDuration =
    session?.endedAt && session.startedAt
      ? Math.max(1, Math.round((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 60000))
      : null;

  const startHike = async () => {
    await db.hikes.put({ id: uid('hike'), activityId: activity.id, startedAt: new Date().toISOString() });
    await setActivityStatus(activity.id, 'in_progress');
    toast('Randonnée commencée — bonne marche !');
  };

  const endHike = async () => {
    if (!session) return;
    await db.hikes.update(session.id, { endedAt: new Date().toISOString() });
    await setActivityStatus(activity.id, 'completed');
    toast('Randonnée terminée 🎉');
  };

  return (
    <div className="space-y-4">
      <PageHeader back title={activity.title} subtitle={day ? `Jour ${day.index} · ${day.title}` : undefined} />

      {done && (
        <Card className="border-l-4 border-ok">
          <p className="flex items-center gap-2 text-sm font-bold text-ok">
            <CheckCircle2 size={17} /> Randonnée terminée
          </p>
          {realDuration !== null && (
            <p className="mt-1 text-xs text-ink-2">
              Durée réelle : {minutesToHuman(realDuration)}
              {activity.plannedDuration !== undefined && ` (prévu ${minutesToHuman(activity.plannedDuration)})`}
            </p>
          )}
        </Card>
      )}

      <Card>
        <div className="flex flex-wrap gap-2">
          <Badge tone="primary">
            <Mountain size={12} /> {sheet.difficulty}
          </Badge>
          <Badge>{sheet.lengthKm}</Badge>
          {sheet.altitude && <Badge>{sheet.altitude}</Badge>}
          {activity.plannedDuration !== undefined && <Badge>~ {minutesToHuman(activity.plannedDuration)}</Badge>}
        </div>
        {(activity.description || place?.description) && (
          <p className="mt-3 text-sm leading-relaxed text-ink-2">{activity.description ?? place?.description}</p>
        )}
        {sheet.guide && <p className="mt-2 rounded-xl bg-accent-soft p-3 text-sm font-semibold text-accent">🧭 {sheet.guide}</p>}
      </Card>

      {day && <WeatherCard date={day.date} latitude={place?.latitude ?? 18.78} longitude={place?.longitude ?? 98.98} compact />}

      {sheet.equipment.length > 0 && (
        <Card>
          <p className="mb-2 text-sm font-bold">Équipement</p>
          <div className="flex flex-wrap gap-1.5">
            {sheet.equipment.map((e) => (
              <Badge key={e}>{e}</Badge>
            ))}
          </div>
        </Card>
      )}

      {sheet.checkpoints.length > 0 && (
        <Card>
          <p className="mb-2 flex items-center gap-2 text-sm font-bold">
            <Flag size={15} /> Checkpoints
          </p>
          <ol className="space-y-1.5">
            {sheet.checkpoints.map((c, i) => (
              <li key={c} className="flex items-center gap-2 text-sm text-ink-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[11px] font-bold text-primary">
                  {i + 1}
                </span>
                {c}
              </li>
            ))}
          </ol>
        </Card>
      )}

      <NavigationButtons lat={place?.latitude} lon={place?.longitude} />

      {!done &&
        (inProgress ? (
          <Button full variant="accent" className="!min-h-[56px] text-lg" onClick={endHike}>
            <CheckCircle2 size={20} /> Terminer la randonnée
          </Button>
        ) : (
          <Button full className="!min-h-[56px] text-lg" onClick={startHike}>
            <Mountain size={20} /> Commencer la randonnée
          </Button>
        ))}
    </div>
  );
}
