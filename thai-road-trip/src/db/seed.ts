import { DEFAULT_SETTINGS, type TripDatabase } from './index';
import {
  seedAccommodations,
  seedActivities,
  seedChecklist,
  seedDays,
  seedEmergency,
  seedPlaces,
  seedRouteLegs,
  seedTransports,
} from '@/data/thailandTrip2026';

export const SEED_VERSION = 1;

/**
 * Seed unique : les données initiales du voyage ne sont insérées qu'une fois.
 * Les mises à jour futures de l'application n'écrasent jamais les données
 * modifiées par l'utilisateur (contrôle via meta.seedVersion).
 */
export async function seedIfNeeded(database: TripDatabase): Promise<boolean> {
  const already = await database.meta.get('seedVersion');
  if (already && Number(already.value) >= SEED_VERSION) return false;

  await database.transaction(
    'rw',
    [
      database.days,
      database.places,
      database.activities,
      database.routeLegs,
      database.accommodations,
      database.transports,
      database.checklist,
      database.emergency,
      database.settings,
      database.meta,
    ],
    async () => {
      await database.days.bulkPut(seedDays);
      await database.places.bulkPut(seedPlaces);
      await database.activities.bulkPut(seedActivities);
      await database.routeLegs.bulkPut(seedRouteLegs);
      await database.accommodations.bulkPut(seedAccommodations);
      await database.transports.bulkPut(seedTransports);
      await database.checklist.bulkPut(seedChecklist);
      await database.emergency.bulkPut(seedEmergency);
      const existingSettings = await database.settings.get('app');
      if (!existingSettings) await database.settings.put(DEFAULT_SETTINGS);
      await database.meta.put({ key: 'seedVersion', value: String(SEED_VERSION) });
    },
  );
  return true;
}

/** Réinitialisation complète du voyage (double confirmation côté UI). */
export async function resetTrip(database: TripDatabase): Promise<void> {
  await database.transaction('rw', database.tables, async () => {
    for (const table of database.tables) await table.clear();
  });
  await seedIfNeeded(database);
}
