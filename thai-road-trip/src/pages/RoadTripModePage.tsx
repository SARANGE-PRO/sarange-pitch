import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Compass, Pause, Play } from 'lucide-react';
import { db } from '@/db';
import { useNow } from '@/hooks/useNow';
import { bangkokTime, minutesToHuman } from '@/utils/datetime';
import { classifyWeather } from '@/services/weather';
import { googleMapsUrl, appleMapsUrl, wazeUrl } from '@/services/navigation';
import { haversineKm, formatProximity } from '@/utils/distance';
import { useGeoPosition } from '@/hooks/useGeoPosition';
import { Button, Card } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/hooks/useToast';

/**
 * MODE ROAD TRIP — interface volontairement minimale pendant un trajet scooter.
 * Pas de reproduction de Google Maps : navigation déléguée aux apps dédiées.
 */
export default function RoadTripModePage() {
  const { legId } = useParams<{ legId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const now = useNow(30_000);
  const { position } = useGeoPosition(true);

  const data = useLiveQuery(async () => {
    if (!legId) return null;
    const leg = await db.routeLegs.get(legId);
    if (!leg) return null;
    const [day, weather] = await Promise.all([
      db.days.get(leg.dayId),
      db.days.get(leg.dayId).then((d) => (d ? db.weather.get(d.date) : undefined)),
    ]);
    const activities = day ? await db.activities.where('dayId').equals(day.id).sortBy('order') : [];
    return { leg, day, weather, activities };
  }, [legId]);

  if (!data?.leg || !data.day) return <div className="skeleton h-40" />;
  const { leg, day, weather, activities } = data;
  const cls = classifyWeather(weather);
  const nextStop = activities.find((a) => a.status === 'planned');
  const nextPlaceCoords = nextStop?.latitude !== undefined ? { lat: nextStop.latitude, lon: nextStop.longitude as number } : null;
  const remaining =
    position && nextPlaceCoords
      ? haversineKm(position.latitude, position.longitude, nextPlaceCoords.lat, nextPlaceCoords.lon)
      : null;
  const destCoords = destinationCoords(day.id);
  const remainingDest = position && destCoords ? haversineKm(position.latitude, position.longitude, destCoords.lat, destCoords.lon) : null;

  const finish = async () => {
    await db.routeLegs.update(leg.id, { status: 'completed', actualEndTime: new Date().toISOString() });
    toast('Trajet terminé — bien arrivés !');
    navigate('/');
  };

  const togglePause = async () => {
    await db.routeLegs.update(leg.id, { status: leg.status === 'paused' ? 'in_progress' : 'paused' });
  };

  return (
    <div className="space-y-4">
      <PageHeader back title="En route" subtitle={`${bangkokTime(now)} · ${cls.emoji} ${cls.label}`} />

      <Card className="bg-gradient-to-br from-primary to-primary/85 text-center !text-primary-ink">
        <p className="text-xs font-bold uppercase tracking-wide opacity-80">Destination</p>
        <p className="mt-1 flex items-center justify-center gap-2 text-2xl font-extrabold">
          {leg.from} <ArrowRight size={20} className="opacity-80" /> {leg.to}
        </p>
        {remainingDest !== null && (
          <p className="mt-1 text-sm font-semibold opacity-90">~ {formatProximity(remainingDest)} à vol d'oiseau</p>
        )}
        {leg.plannedDuration !== undefined && (
          <p className="mt-0.5 text-xs opacity-80">{minutesToHuman(leg.plannedDuration)} de route prévue</p>
        )}
        {leg.status === 'paused' && <p className="mt-2 text-sm font-bold">⏸ En pause</p>}
      </Card>

      {nextStop && (
        <Card>
          <p className="text-xs font-bold uppercase tracking-wide text-ink-3">Prochain arrêt</p>
          <p className="mt-0.5 text-lg font-extrabold">{nextStop.title}</p>
          {remaining !== null && <p className="text-xs text-ink-3">~ {formatProximity(remaining)}</p>}
        </Card>
      )}

      <NavigationButtons lat={destCoords?.lat} lon={destCoords?.lon} />

      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" full className="!min-h-[56px]" onClick={togglePause}>
          {leg.status === 'paused' ? <Play size={18} /> : <Pause size={18} />}
          {leg.status === 'paused' ? 'Reprendre' : 'Pause'}
        </Button>
        <Button full className="!min-h-[56px]" onClick={finish}>
          <CheckCircle2 size={18} /> Arrivée
        </Button>
      </div>
    </div>
  );
}

/** Destination du jour : coordonnées du lieu de nuit. */
function destinationCoords(dayId: string): { lat: number; lon: number } | null {
  switch (dayId) {
    case 'd2':
      return { lat: 18.8048, lon: 98.9217 }; // Doi Suthep
    case 'd3':
      return { lat: 18.8656, lon: 99.3517 }; // Mae Kampong
    case 'd4':
      return { lat: 18.5381, lon: 98.5244 }; // Mae Klang Luang
    case 'd5':
      return { lat: 18.7889, lon: 98.9853 }; // Chiang Mai
    default:
      return null;
  }
}

export function NavigationButtons({ lat, lon }: { lat?: number; lon?: number }) {
  if (lat === undefined || lon === undefined) return null;
  return (
    <div className="grid grid-cols-3 gap-2">
      <a href={googleMapsUrl(lat, lon)} target="_blank" rel="noopener noreferrer">
        <Button variant="secondary" full className="text-xs">
          <Compass size={15} /> Google
        </Button>
      </a>
      <a href={appleMapsUrl(lat, lon)} target="_blank" rel="noopener noreferrer">
        <Button variant="secondary" full className="text-xs">
           Plans
        </Button>
      </a>
      <a href={wazeUrl(lat, lon)} target="_blank" rel="noopener noreferrer">
        <Button variant="secondary" full className="text-xs">
          Waze
        </Button>
      </a>
    </div>
  );
}
