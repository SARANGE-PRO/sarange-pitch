import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Fuel, Rocket, Sunset } from 'lucide-react';
import { db } from '@/db';
import { classifyWeather } from '@/services/weather';
import { minutesToHuman } from '@/utils/datetime';
import { Badge, Button, Card } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { WeatherCard } from '@/components/WeatherCard';
import { useToast } from '@/hooks/useToast';

const CHECK_ITEMS = [
  'Météo vérifiée',
  'Plein / essence suffisante',
  'Casque',
  'Pneus',
  'Freins',
  'Batterie téléphone',
  'Powerbank',
  'Eau',
  'Protection pluie',
  'Itinéraire ouvert',
];

/**
 * MODE DÉPART — un seul écran avant chaque journée scooter / rando :
 * destination, distance, durée, météo, heure conseillée, checklist, DÉMARRER.
 */
export default function DepartureModePage() {
  const { dayId } = useParams<{ dayId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const data = useLiveQuery(async () => {
    if (!dayId) return null;
    const day = await db.days.get(dayId);
    if (!day) return null;
    const [legs, weather, activities] = await Promise.all([
      db.routeLegs.where('dayId').equals(dayId).sortBy('order'),
      db.weather.get(day.date),
      db.activities.where('dayId').equals(dayId).sortBy('order'),
    ]);
    return { day, legs, weather, activities };
  }, [dayId]);

  if (!data) return <div className="skeleton h-40" />;
  const { day, legs, weather, activities } = data;
  const leg = legs.find((l) => l.mode === 'scooter') ?? legs[0];
  const cls = classifyWeather(weather);
  const firstStop = activities.find((a) => a.status === 'planned');
  const allChecked = checked.size === CHECK_ITEMS.length;

  const toggle = (item: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });

  const start = async () => {
    if (leg) {
      await db.routeLegs.update(leg.id, {
        status: 'in_progress',
        actualStartTime: new Date().toISOString(),
      });
      toast('Départ enregistré — bonne route !');
      navigate(`/route/${leg.id}`);
    } else {
      toast('Départ enregistré');
      navigate('/');
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader back title="Mode départ" subtitle={`Jour ${day.index} · ${day.title}`} />

      <Card className="bg-gradient-to-br from-ink to-ink/90 !text-bg dark:from-surface-2 dark:to-surface dark:!text-ink">
        <p className="text-xs font-bold uppercase tracking-wide opacity-70">Destination</p>
        <p className="mt-0.5 flex items-center gap-2 text-xl font-extrabold">
          {leg?.from ?? day.from} <ArrowRight size={18} className="opacity-70" /> {leg?.to ?? day.to}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm font-semibold">
          {leg?.distanceKm !== undefined && <span>🛵 {Math.round(leg.distanceKm)} km</span>}
          {leg?.plannedDuration !== undefined && <span>⏱ {minutesToHuman(leg.plannedDuration)}</span>}
          {leg?.recommendedDeparture && <span>🕖 Départ conseillé {leg.recommendedDeparture}</span>}
          {weather?.sunset && (
            <span className="inline-flex items-center gap-1">
              <Sunset size={14} /> Coucher {weather.sunset}
            </span>
          )}
        </div>
        {firstStop && (
          <p className="mt-3 rounded-xl bg-white/10 p-2.5 text-sm dark:bg-black/20">
            Premier arrêt : <strong>{firstStop.title}</strong>
            {firstStop.plannedStartTime && ` · ${firstStop.plannedStartTime}`}
          </p>
        )}
      </Card>

      <WeatherCard date={day.date} latitude={18.7889} longitude={98.9853} compact />

      {cls.level !== 'good' && (
        <Card className={`border-l-4 ${cls.level === 'bad' ? 'border-danger' : 'border-warn'}`}>
          <p className="text-sm font-bold">
            {cls.emoji} {cls.label}
          </p>
          <p className="mt-1 text-xs text-ink-2">
            {cls.level === 'bad'
              ? 'Envisager de décaler le départ, raccourcir l’étape ou activer le plan pluie. Route mouillée = distance de freinage doublée.'
              : 'Prévoir l’équipement pluie et adapter la vitesse. Éviter de rouler de nuit.'}
          </p>
        </Card>
      )}

      {day.heavyRoadDay && (
        <Card className="border-l-4 border-warn">
          <p className="flex items-center gap-2 text-sm font-bold text-warn">
            <Fuel size={16} /> Grosse journée route
          </p>
          <p className="mt-1 text-xs text-ink-2">
            Faire le plein avant de quitter la vallée. Pas de conduite de nuit : viser une arrivée avant{' '}
            {weather?.sunset ?? '18:30'}.
          </p>
        </Card>
      )}

      <section>
        <h2 className="mb-2 text-lg font-extrabold">Checklist rapide</h2>
        <Card className="divide-y divide-line !p-0">
          {CHECK_ITEMS.map((item) => (
            <label key={item} className="flex min-h-[48px] cursor-pointer items-center gap-3 px-4 py-2">
              <input
                type="checkbox"
                checked={checked.has(item)}
                onChange={() => toggle(item)}
                className="h-5 w-5 accent-[rgb(var(--c-primary))]"
              />
              <span className={`text-sm font-medium ${checked.has(item) ? 'text-ink-3 line-through' : ''}`}>
                {item}
              </span>
            </label>
          ))}
        </Card>
      </section>

      {!allChecked && (
        <p className="text-center text-xs text-ink-3">
          <Badge tone="neutral">
            {checked.size} / {CHECK_ITEMS.length} vérifiés
          </Badge>
        </p>
      )}

      <Button full variant="accent" className="!min-h-[56px] text-lg" onClick={start}>
        <Rocket size={20} /> DÉMARRER
      </Button>
      <p className="pb-2 text-center text-xs text-ink-3">
        L'heure réelle de départ sera enregistrée.
      </p>
    </div>
  );
}
