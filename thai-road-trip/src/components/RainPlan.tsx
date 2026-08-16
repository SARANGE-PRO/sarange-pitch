import { useLiveQuery } from 'dexie-react-hooks';
import { CalendarClock, CloudRain, Plus } from 'lucide-react';
import { db } from '@/db';
import type { Activity } from '@/types';
import { BottomSheet, Button, Card, useDisclosure } from '@/components/ui';
import { CategoryChip } from '@/components/ui/CategoryIcon';
import { RAIN_FRIENDLY_SUGGESTIONS, createActivity, postponeToJokerDay } from '@/services/itinerary';
import { useToast } from '@/hooks/useToast';

/**
 * Plan pluie : analyse les activités météo-sensibles du jour et propose
 * des alternatives abritées + report en un clic vers le 4 septembre.
 */
export function RainPlanButton({ dayId }: { dayId: string }) {
  const sheet = useDisclosure();
  return (
    <>
      <Button variant="secondary" full onClick={sheet.onOpen}>
        <CloudRain size={17} /> Plan pluie
      </Button>
      <BottomSheet open={sheet.open} onClose={sheet.onClose} title="🌧 Plan pluie">
        <RainPlanContent dayId={dayId} />
      </BottomSheet>
    </>
  );
}

function RainPlanContent({ dayId }: { dayId: string }) {
  const toast = useToast();
  const activities = useLiveQuery(() => db.activities.where('dayId').equals(dayId).toArray(), [dayId]);
  const sensitive = (activities ?? []).filter(
    (a) => a.weatherSensitive && (a.status === 'planned' || a.status === 'in_progress'),
  );

  const postpone = async (a: Activity) => {
    await postponeToJokerDay(a.id);
    toast('Reporté au 4 septembre');
  };

  const addSuggestion = async (s: (typeof RAIN_FRIENDLY_SUGGESTIONS)[number]) => {
    const place = s.placeId ? await db.places.get(s.placeId) : undefined;
    await createActivity({
      dayId,
      title: s.title,
      category: s.category,
      placeId: s.placeId,
      description: s.description,
      status: 'planned',
      priority: 'normal',
      weatherSensitive: false,
      latitude: place?.latitude,
      longitude: place?.longitude,
    });
    toast('Ajouté au programme du jour');
  };

  return (
    <div className="space-y-5">
      <section>
        <h3 className="mb-2 text-sm font-bold text-ink-2">Activités météo-sensibles aujourd'hui</h3>
        {sensitive.length === 0 ? (
          <p className="text-sm text-ink-3">
            Aucune activité météo-sensible restante aujourd'hui. Le programme peut se dérouler même sous la pluie.
          </p>
        ) : (
          <div className="space-y-2">
            {sensitive.map((a) => (
              <Card key={a.id} className="flex items-center gap-3 !p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{a.title}</p>
                  <CategoryChip category={a.category} />
                </div>
                <Button variant="secondary" onClick={() => postpone(a)} className="shrink-0 !min-h-[40px] !px-3 text-xs">
                  <CalendarClock size={14} /> Reporter au 4
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>
      <section>
        <h3 className="mb-2 text-sm font-bold text-ink-2">Alternatives à l'abri</h3>
        <div className="space-y-2">
          {RAIN_FRIENDLY_SUGGESTIONS.map((s) => (
            <Card key={s.title} className="flex items-center gap-3 !p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{s.title}</p>
                <p className="truncate text-xs text-ink-3">{s.description}</p>
              </div>
              <Button variant="ghost" onClick={() => addSuggestion(s)} className="shrink-0 !min-h-[40px] !px-3 text-xs">
                <Plus size={14} /> Ajouter
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
