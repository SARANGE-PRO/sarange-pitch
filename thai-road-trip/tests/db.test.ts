import { afterEach, describe, expect, it } from 'vitest';
import { TripDatabase } from '@/db';
import { seedIfNeeded } from '@/db/seed';
import { setActivityStatus, postponeToJokerDay, addToJokerDay, JOKER_DAY_ID } from '@/services/itinerary';

let counter = 0;
const dbs: TripDatabase[] = [];

function freshDb(): TripDatabase {
  const database = new TripDatabase(`test-db-${Date.now()}-${counter++}`);
  dbs.push(database);
  return database;
}

afterEach(async () => {
  for (const database of dbs.splice(0)) await database.delete();
});

describe('stockage IndexedDB et seed', () => {
  it('seed les données du voyage une seule fois', async () => {
    const database = freshDb();
    const first = await seedIfNeeded(database);
    expect(first).toBe(true);
    expect(await database.days.count()).toBe(7);
    expect(await database.activities.count()).toBeGreaterThan(20);
    expect(await database.places.count()).toBeGreaterThan(20);
    expect(await database.transports.count()).toBe(6);
    expect(await database.accommodations.count()).toBe(6);

    const second = await seedIfNeeded(database);
    expect(second).toBe(false);
  });

  it('ne réécrase pas les modifications utilisateur au re-seed', async () => {
    const database = freshDb();
    await seedIfNeeded(database);
    await database.activities.update('a-d2-umong', { status: 'completed' });
    await seedIfNeeded(database);
    const activity = await database.activities.get('a-d2-umong');
    expect(activity?.status).toBe('completed');
  });

  it('les coordonnées GPS clés sont présentes et plausibles', async () => {
    const database = freshDb();
    await seedIfNeeded(database);
    const suthep = await database.places.get('doi-suthep');
    expect(suthep?.latitude).toBeCloseTo(18.8, 1);
    expect(suthep?.longitude).toBeCloseTo(98.9, 1);
    const summit = await database.places.get('doi-inthanon-summit');
    expect(summit?.latitude).toBeCloseTo(18.59, 1);
    const bkk = await database.places.get('suvarnabhumi-airport');
    expect(bkk?.latitude).toBeCloseTo(13.69, 1);
  });
});

describe('changements de statut', () => {
  it('enregistre les heures réelles de début et fin', async () => {
    const database = freshDb();
    await seedIfNeeded(database);
    const { db } = await import('@/db');
    // les helpers utilisent l'instance globale — on la seed aussi
    await seedIfNeeded(db);
    await setActivityStatus('a-d2-umong', 'in_progress');
    let activity = await db.activities.get('a-d2-umong');
    expect(activity?.status).toBe('in_progress');
    expect(activity?.actualStartTime).toBeTruthy();
    await setActivityStatus('a-d2-umong', 'completed');
    activity = await db.activities.get('a-d2-umong');
    expect(activity?.status).toBe('completed');
    expect(activity?.actualEndTime).toBeTruthy();
  });

  it('report automatique : postponed conserve le jour d’origine puis rejoint le 4 septembre', async () => {
    const { db } = await import('@/db');
    await seedIfNeeded(db);
    await db.activities.update('a-d2-monks-trail', { status: 'planned', dayId: 'd2', originalDayId: undefined });
    await postponeToJokerDay('a-d2-monks-trail');
    let activity = await db.activities.get('a-d2-monks-trail');
    expect(activity?.status).toBe('postponed');
    expect(activity?.originalDayId).toBe('d2');
    await addToJokerDay('a-d2-monks-trail');
    activity = await db.activities.get('a-d2-monks-trail');
    expect(activity?.dayId).toBe(JOKER_DAY_ID);
    expect(activity?.status).toBe('planned');
  });
});
