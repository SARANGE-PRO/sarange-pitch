import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { MapPin } from 'lucide-react';
import { db } from '@/db';
import { useGeoPosition } from '@/hooks/useGeoPosition';
import { haversineKm } from '@/utils/distance';
import { setActivityStatus } from '@/services/itinerary';
import { useToast } from '@/hooks/useToast';
import { Button, Card } from '@/components/ui';

const PROXIMITY_KM = 0.35;

/**
 * Détection de proximité discrète : propose de marquer l'étape terminée
 * quand on arrive à destination. Une seule proposition par activité.
 */
export function ProximityPrompt({ dayId }: { dayId: string }) {
  const { position } = useGeoPosition(true);
  const toast = useToast();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const data = useLiveQuery(async () => {
    const activities = await db.activities.where('dayId').equals(dayId).toArray();
    const withCoords = await Promise.all(
      activities
        .filter((a) => a.status === 'planned' || a.status === 'in_progress')
        .map(async (a) => {
          const place = a.placeId ? await db.places.get(a.placeId) : undefined;
          return {
            activity: a,
            lat: a.latitude ?? place?.latitude,
            lon: a.longitude ?? place?.longitude,
          };
        }),
    );
    return withCoords.filter((x) => x.lat !== undefined && x.lon !== undefined);
  }, [dayId]);

  const nearby = useMemo(() => {
    if (!position || !data) return null;
    return (
      data.find(
        (x) =>
          !dismissed.has(x.activity.id) &&
          haversineKm(position.latitude, position.longitude, x.lat as number, x.lon as number) < PROXIMITY_KM,
      ) ?? null
    );
  }, [position, data, dismissed]);

  if (!nearby) return null;

  return (
    <Card className="flex items-center gap-3 border-l-4 border-primary">
      <MapPin size={20} className="shrink-0 text-primary" />
      <p className="flex-1 text-sm font-semibold">Vous êtes arrivé à {nearby.activity.title} ?</p>
      <div className="flex shrink-0 gap-2">
        <Button
          className="!min-h-[40px] !px-3 text-xs"
          onClick={async () => {
            await setActivityStatus(nearby.activity.id, 'completed');
            toast('Activité terminée');
          }}
        >
          Oui, terminer
        </Button>
        <Button
          variant="secondary"
          className="!min-h-[40px] !px-3 text-xs"
          onClick={() => setDismissed((s) => new Set(s).add(nearby.activity.id))}
        >
          Pas encore
        </Button>
      </div>
    </Card>
  );
}
