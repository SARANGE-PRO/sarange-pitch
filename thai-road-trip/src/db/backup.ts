import type { BackupPayload } from '@/types';
import type { TripDatabase } from './index';

export const BACKUP_VERSION = 1;

export async function exportBackup(database: TripDatabase): Promise<BackupPayload> {
  const [
    days, places, activities, routeLegs, accommodations, transports,
    reservations, expenses, notes, checklist, weather, scooter, hikes,
    emergency, settings,
  ] = await Promise.all([
    database.days.toArray(),
    database.places.toArray(),
    database.activities.toArray(),
    database.routeLegs.toArray(),
    database.accommodations.toArray(),
    database.transports.toArray(),
    database.reservations.toArray(),
    database.expenses.toArray(),
    database.notes.toArray(),
    database.checklist.toArray(),
    database.weather.toArray(),
    database.scooter.toArray(),
    database.hikes.toArray(),
    database.emergency.toArray(),
    database.settings.toArray(),
  ]);
  return {
    format: 'thai-road-trip-backup',
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      days, places, activities, routeLegs, accommodations, transports,
      reservations, expenses, notes, checklist, weather, scooter, hikes,
      emergency, settings,
    },
  };
}

export function validateBackup(raw: unknown): raw is BackupPayload {
  if (typeof raw !== 'object' || raw === null) return false;
  const p = raw as Partial<BackupPayload>;
  if (p.format !== 'thai-road-trip-backup') return false;
  if (typeof p.version !== 'number' || p.version < 1 || p.version > BACKUP_VERSION) return false;
  if (typeof p.data !== 'object' || p.data === null) return false;
  const d = p.data as Record<string, unknown>;
  const requiredArrays = [
    'days', 'places', 'activities', 'accommodations', 'transports',
    'expenses', 'notes', 'checklist',
  ];
  return requiredArrays.every((k) => Array.isArray(d[k]));
}

/** Import : remplace l'état courant par la sauvegarde (validée au préalable). */
export async function importBackup(database: TripDatabase, payload: BackupPayload): Promise<void> {
  const d = payload.data;
  await database.transaction('rw', database.tables, async () => {
    for (const table of database.tables) {
      if (table.name === 'photos') continue; // les photos ne font pas partie du JSON
      if (table.name !== 'meta') await table.clear();
    }
    await database.days.bulkPut(d.days ?? []);
    await database.places.bulkPut(d.places ?? []);
    await database.activities.bulkPut(d.activities ?? []);
    await database.routeLegs.bulkPut(d.routeLegs ?? []);
    await database.accommodations.bulkPut(d.accommodations ?? []);
    await database.transports.bulkPut(d.transports ?? []);
    await database.reservations.bulkPut(d.reservations ?? []);
    await database.expenses.bulkPut(d.expenses ?? []);
    await database.notes.bulkPut(d.notes ?? []);
    await database.checklist.bulkPut(d.checklist ?? []);
    await database.weather.bulkPut(d.weather ?? []);
    await database.scooter.bulkPut(d.scooter ?? []);
    await database.hikes.bulkPut(d.hikes ?? []);
    await database.emergency.bulkPut(d.emergency ?? []);
    await database.settings.bulkPut(d.settings ?? []);
  });
}
