import { describe, expect, it } from 'vitest';
import { classifyWeather } from '@/services/weather';
import type { WeatherSnapshot } from '@/types';

const snap = (patch: Partial<WeatherSnapshot>): WeatherSnapshot => ({
  id: '2026-09-02',
  date: '2026-09-02',
  source: 'manual',
  ...patch,
});

describe('classification météo prudente', () => {
  it('sans données → inconnue (jamais "sûr" par défaut)', () => {
    expect(classifyWeather(undefined).level).toBe('unknown');
    expect(classifyWeather(snap({})).level).toBe('unknown');
  });

  it('pluie faible → favorable (pas "sûr")', () => {
    const c = classifyWeather(snap({ rainProbability: 10, condition: 'Ciel dégagé' }));
    expect(c.level).toBe('good');
    expect(c.label).toBe('Conditions favorables');
  });

  it('pluie modérée → prudence', () => {
    expect(classifyWeather(snap({ rainProbability: 50 })).level).toBe('caution');
  });

  it('pluie forte ou probabilité élevée → défavorable', () => {
    expect(classifyWeather(snap({ rainProbability: 80 })).level).toBe('bad');
    expect(classifyWeather(snap({ rainProbability: 20, heavyRain: true })).level).toBe('bad');
  });
});
