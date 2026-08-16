import { useEffect } from 'react';
import { useSettings, updateSettings } from './useSettings';
import type { AppSettings } from '@/types';

const STORAGE_KEY = 'thai-trip-theme';

function applyTheme(theme: AppSettings['theme']): void {
  const dark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // stockage indisponible : le thème reste appliqué pour la session
  }
}

export function useTheme(): { theme: AppSettings['theme']; setTheme: (t: AppSettings['theme']) => void } {
  const settings = useSettings();

  useEffect(() => {
    applyTheme(settings.theme);
    if (settings.theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => applyTheme('system');
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, [settings.theme]);

  return {
    theme: settings.theme,
    setTheme: (t) => {
      applyTheme(t);
      void updateSettings({ theme: t });
    },
  };
}
