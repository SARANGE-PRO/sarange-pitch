import { describe, expect, it } from 'vitest';
import { TripDatabase } from '@/db';
import { seedIfNeeded } from '@/db/seed';
import { exportBackup, importBackup, validateBackup } from '@/db/backup';

describe('export / import de sauvegarde', () => {
  it('exporte toutes les données et les réimporte fidèlement', async () => {
    const source = new TripDatabase(`backup-src-${Date.now()}`);
    await seedIfNeeded(source);
    await source.notes.put({
      id: 'n1',
      text: 'Super khao soi',
      category: 'resto',
      date: '2026-08-31',
      favorite: true,
      createdAt: new Date().toISOString(),
    });
    await source.expenses.put({
      id: 'e1',
      amount: 250,
      category: 'nourriture',
      date: '2026-08-31',
      createdAt: new Date().toISOString(),
    });
    await source.activities.update('a-d2-umong', { status: 'completed' });

    const payload = await exportBackup(source);
    expect(payload.format).toBe('thai-road-trip-backup');
    expect(validateBackup(payload)).toBe(true);
    expect(validateBackup(JSON.parse(JSON.stringify(payload)))).toBe(true);

    const target = new TripDatabase(`backup-dst-${Date.now()}`);
    await seedIfNeeded(target);
    await importBackup(target, payload);
    expect((await target.notes.get('n1'))?.text).toBe('Super khao soi');
    expect((await target.expenses.get('e1'))?.amount).toBe(250);
    expect((await target.activities.get('a-d2-umong'))?.status).toBe('completed');
    expect(await target.days.count()).toBe(7);

    await source.delete();
    await target.delete();
  });

  it('rejette les formats invalides', () => {
    expect(validateBackup(null)).toBe(false);
    expect(validateBackup({})).toBe(false);
    expect(validateBackup({ format: 'autre', version: 1, data: {} })).toBe(false);
    expect(validateBackup({ format: 'thai-road-trip-backup', version: 999, data: {} })).toBe(false);
    expect(validateBackup({ format: 'thai-road-trip-backup', version: 1, data: { days: 'nope' } })).toBe(false);
  });
});
