import { describe, expect, it } from 'vitest';
import { TripDatabase } from '@/db';
import { seedIfNeeded } from '@/db/seed';

describe('checklist persistante', () => {
  it('seed les 4 catégories et persiste les coches', async () => {
    const database = new TripDatabase(`checklist-${Date.now()}`);
    await seedIfNeeded(database);
    const items = await database.checklist.toArray();
    const categories = new Set(items.map((i) => i.category));
    expect(categories).toEqual(new Set(['Documents', 'Scooter', 'Randonnée', 'Électronique']));
    expect(items.some((i) => i.label === 'Permis international moto')).toBe(true);

    await database.checklist.update('c-doc-1', { checked: true });
    expect((await database.checklist.get('c-doc-1'))?.checked).toBe(true);

    // ajout / édition / suppression
    await database.checklist.put({
      id: 'custom-1',
      label: 'Lampe frontale',
      category: 'Randonnée',
      checked: false,
      order: 99,
      userAdded: true,
    });
    expect(await database.checklist.count()).toBe(items.length + 1);
    await database.checklist.delete('custom-1');
    expect(await database.checklist.count()).toBe(items.length);
    await database.delete();
  });
});
