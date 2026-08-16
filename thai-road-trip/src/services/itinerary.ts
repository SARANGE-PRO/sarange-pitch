import { db } from '@/db';
import type { Activity, ActivityStatus, TripDay } from '@/types';
import { uid } from '@/utils/id';

export const JOKER_DAY_ID = 'd6';

export const STATUS_LABELS: Record<ActivityStatus, string> = {
  planned: 'À faire',
  in_progress: 'En cours',
  completed: 'Terminée',
  skipped: 'Ignorée',
  postponed: 'Reportée',
};

export async function setActivityStatus(activityId: string, status: ActivityStatus): Promise<void> {
  const patch: Partial<Activity> = { status };
  const now = new Date().toISOString();
  if (status === 'in_progress') patch.actualStartTime = now;
  if (status === 'completed') patch.actualEndTime = now;
  await db.activities.update(activityId, patch);
}

/** Reporte une activité vers la journée joker (4 septembre) — statut postponed. */
export async function postponeToJokerDay(activityId: string): Promise<void> {
  const activity = await db.activities.get(activityId);
  if (!activity) return;
  await db.activities.update(activityId, {
    status: 'postponed',
    originalDayId: activity.originalDayId ?? activity.dayId,
  });
}

/**
 * "À rattraper" : activités des jours précédents au statut postponed
 * (+ skipped si le réglage l'autorise), non déjà replanifiées.
 */
export function computeCatchUp(
  activities: Activity[],
  days: TripDay[],
  includeSkipped: boolean,
): Activity[] {
  const jokerDay = days.find((d) => d.jokerDay);
  if (!jokerDay) return [];
  const dayDates = new Map(days.map((d) => [d.id, d.date]));
  return activities
    .filter((a) => {
      if (a.dayId === jokerDay.id) return false;
      const date = dayDates.get(a.dayId);
      if (!date || date >= jokerDay.date) return false;
      if (a.status === 'postponed') return true;
      if (includeSkipped && a.status === 'skipped') return true;
      return false;
    })
    .sort((a, b) => (dayDates.get(a.dayId) ?? '').localeCompare(dayDates.get(b.dayId) ?? ''));
}

/** Ajoute une activité rattrapée au programme du 4 septembre. */
export async function addToJokerDay(activityId: string): Promise<void> {
  const activity = await db.activities.get(activityId);
  if (!activity) return;
  const jokerActivities = await db.activities.where('dayId').equals(JOKER_DAY_ID).toArray();
  const maxOrder = Math.max(0, ...jokerActivities.map((a) => a.order));
  await db.activities.update(activityId, {
    originalDayId: activity.originalDayId ?? activity.dayId,
    dayId: JOKER_DAY_ID,
    status: 'planned',
    order: maxOrder + 1,
    plannedStartTime: undefined,
  });
}

export interface DayProgress {
  total: number;
  done: number;
  percent: number;
}

export function computeProgress(activities: Activity[]): DayProgress {
  const relevant = activities.filter((a) => a.status !== 'skipped' && a.status !== 'postponed');
  const done = relevant.filter((a) => a.status === 'completed').length;
  const total = relevant.length;
  return { total, done, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}

export async function reorderActivities(dayId: string, orderedIds: string[]): Promise<void> {
  await db.transaction('rw', db.activities, async () => {
    for (let i = 0; i < orderedIds.length; i++) {
      await db.activities.update(orderedIds[i], { order: i + 1, dayId });
    }
  });
}

export async function createActivity(input: Omit<Activity, 'id' | 'order'> & { order?: number }): Promise<string> {
  const siblings = await db.activities.where('dayId').equals(input.dayId).toArray();
  const id = uid('act');
  await db.activities.put({
    ...input,
    id,
    order: input.order ?? Math.max(0, ...siblings.map((a) => a.order)) + 1,
  });
  return id;
}

/**
 * Alternatives "plan pluie" : activités non météo-sensibles pertinentes
 * (temples couverts, cafés, massages, marchés, activités urbaines).
 */
export const RAIN_FRIENDLY_SUGGESTIONS: { title: string; category: Activity['category']; placeId?: string; description: string }[] = [
  { title: 'Wat Umong', category: 'temple', placeId: 'wat-umong', description: 'Temple forestier, tunnels abrités.' },
  { title: 'Wat Phra Singh', category: 'temple', placeId: 'wat-phra-singh', description: 'Grands viharns couverts.' },
  { title: 'Wat Chedi Luang', category: 'temple', placeId: 'wat-chedi-luang', description: 'Visite courte, partiellement abritée.' },
  { title: 'Pause café', category: 'cafe', placeId: 'nimman', description: 'Cafés de Nimman ou de la Old City.' },
  { title: 'Massage thaï', category: 'massage', description: '1 h à l’abri, parfait sous la pluie.' },
  { title: 'Marché couvert', category: 'market', placeId: 'chiang-mai-night-market', description: 'Warorot ou Night Bazaar.' },
];
