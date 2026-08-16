import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import type { Activity } from '@/types';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { minutesToHuman } from '@/utils/datetime';
import { StatusBadge } from './StatusControls';
import { ActivitySheet } from './ActivitySheet';
import { reorderActivities } from '@/services/itinerary';

/** Timeline verticale d'une journée — interaction tactile immédiate. */
export function Timeline({ activities, editable = false }: { activities: Activity[]; editable?: boolean }) {
  const [selected, setSelected] = useState<Activity | null>(null);
  const sorted = [...activities].sort((a, b) => a.order - b.order);

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= sorted.length) return;
    const ids = sorted.map((a) => a.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    await reorderActivities(sorted[0].dayId, ids);
  };

  return (
    <div className="relative">
      <div className="absolute bottom-4 left-[21px] top-4 w-px bg-line" aria-hidden />
      <ol className="space-y-2">
        {sorted.map((activity, i) => {
          const dimmed = activity.status === 'skipped' || activity.status === 'postponed';
          return (
            <li key={activity.id} className="relative flex items-stretch gap-3">
              <div className="z-10 flex w-[44px] shrink-0 flex-col items-center pt-3.5">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 bg-surface ${
                    activity.status === 'completed'
                      ? 'border-ok'
                      : activity.status === 'in_progress'
                        ? 'border-primary'
                        : 'border-line'
                  }`}
                >
                  <CategoryIcon category={activity.category} size={16} />
                </span>
              </div>
              <button
                onClick={() => setSelected(activity)}
                className={`min-h-[64px] flex-1 rounded-xl2 bg-surface p-3.5 text-left shadow-card transition-transform active:scale-[0.99] ${dimmed ? 'opacity-55' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-xs font-semibold text-ink-3">
                    {activity.plannedStartTime && (
                      <>
                        <Clock size={12} /> {activity.plannedStartTime}
                      </>
                    )}
                    {activity.plannedDuration !== undefined && <span>· {minutesToHuman(activity.plannedDuration)}</span>}
                  </span>
                  <StatusBadge status={activity.status} />
                </div>
                <p className={`mt-1 text-[15px] font-bold ${activity.status === 'completed' ? 'line-through decoration-ink-3' : ''}`}>
                  {activity.title}
                </p>
                {activity.description && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-ink-3">{activity.description}</p>
                )}
                {activity.weatherSensitive && (
                  <p className="mt-1 text-xs font-semibold text-warn">🌧 Météo-sensible</p>
                )}
              </button>
              {editable && (
                <div className="flex flex-col justify-center gap-1">
                  <button
                    aria-label="Monter"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-3 active:bg-surface-2 disabled:opacity-25"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    aria-label="Descendre"
                    disabled={i === sorted.length - 1}
                    onClick={() => move(i, 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-3 active:bg-surface-2 disabled:opacity-25"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <ActivitySheet activity={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
