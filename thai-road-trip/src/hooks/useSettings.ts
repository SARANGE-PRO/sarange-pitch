import { useLiveQuery } from 'dexie-react-hooks';
import { db, DEFAULT_SETTINGS } from '@/db';
import type { AppSettings } from '@/types';

export function useSettings(): AppSettings {
  return useLiveQuery(() => db.settings.get('app'), [], DEFAULT_SETTINGS) ?? DEFAULT_SETTINGS;
}

export async function updateSettings(patch: Partial<AppSettings>): Promise<void> {
  const current = (await db.settings.get('app')) ?? DEFAULT_SETTINGS;
  await db.settings.put({ ...current, ...patch, id: 'app' });
}
