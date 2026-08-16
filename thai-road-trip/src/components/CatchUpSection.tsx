import { useLiveQuery } from 'dexie-react-hooks';
import { CalendarPlus, PartyPopper } from 'lucide-react';
import { db } from '@/db';
import { addToJokerDay, computeCatchUp } from '@/services/itinerary';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/useToast';
import { Button, Card } from '@/components/ui';
import { CategoryChip } from '@/components/ui/CategoryIcon';
import { STATUS_LABELS } from '@/services/itinerary';

/** Section "À rattraper" de la journée joker (4 septembre) — générée automatiquement. */
export function CatchUpSection() {
  const settings = useSettings();
  const toast = useToast();
  const data = useLiveQuery(async () => {
    const [activities, days] = await Promise.all([db.activities.toArray(), db.days.toArray()]);
    return computeCatchUp(activities, days, settings.includeSkippedInCatchUp);
  }, [settings.includeSkippedInCatchUp]);

  if (!data) return null;

  return (
    <section>
      <h2 className="mb-2 flex items-center gap-2 text-lg font-extrabold">À rattraper</h2>
      {data.length === 0 ? (
        <Card className="flex items-center gap-3">
          <PartyPopper size={20} className="text-ok" />
          <p className="text-sm text-ink-2">
            Rien à rattraper — profitez d'une journée tranquille à Chiang Mai : café, marché, massage, Old City,
            derniers achats.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {data.map((a) => (
            <Card key={a.id} className="flex items-center gap-3 !p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{a.title}</p>
                <p className="mt-0.5 flex items-center gap-2 text-xs text-ink-3">
                  <CategoryChip category={a.category} />
                  {STATUS_LABELS[a.status]}
                </p>
              </div>
              <Button
                variant="primary"
                className="shrink-0 !min-h-[40px] !px-3 text-xs"
                onClick={async () => {
                  await addToJokerDay(a.id);
                  toast('Ajouté au programme du 4 septembre');
                }}
              >
                <CalendarPlus size={14} /> Ajouter au jour
              </Button>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
