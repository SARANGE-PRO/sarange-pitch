import { db } from '@/db';
import type { WeatherSnapshot } from '@/types';

export type WeatherClass = 'good' | 'caution' | 'bad' | 'unknown';

export interface WeatherClassification {
  level: WeatherClass;
  label: string;
  emoji: string;
}

/**
 * Classification prudente : une sortie scooter n'est jamais annoncée comme
 * "sûre" — au mieux "conditions favorables".
 */
export function classifyWeather(snapshot?: WeatherSnapshot | null): WeatherClassification {
  if (!snapshot || (snapshot.rainProbability === undefined && !snapshot.condition)) {
    return { level: 'unknown', label: 'Météo non renseignée', emoji: '🌤' };
  }
  const rain = snapshot.rainProbability ?? 0;
  if (snapshot.heavyRain || rain >= 70) {
    return { level: 'bad', label: 'Conditions défavorables', emoji: '🔴' };
  }
  if (rain >= 35) {
    return { level: 'caution', label: 'Prudence recommandée', emoji: '🟠' };
  }
  return { level: 'good', label: 'Conditions favorables', emoji: '🟢' };
}

const WMO_CONDITIONS: [number[], string][] = [
  [[0], 'Ciel dégagé'],
  [[1, 2], 'Partiellement nuageux'],
  [[3], 'Couvert'],
  [[45, 48], 'Brouillard'],
  [[51, 53, 55, 56, 57], 'Bruine'],
  [[61, 63, 66], 'Pluie'],
  [[65, 67], 'Pluie forte'],
  [[80, 81], 'Averses'],
  [[82], 'Averses fortes'],
  [[95, 96, 99], 'Orages'],
];

function wmoToCondition(code: number): string {
  for (const [codes, label] of WMO_CONDITIONS) if (codes.includes(code)) return label;
  return 'Variable';
}

/**
 * WeatherProvider automatique : Open-Meteo (gratuit, sans clé API).
 * En cas d'échec réseau, l'application continue avec les données en cache
 * ou la saisie manuelle.
 */
export async function fetchWeatherAuto(
  latitude: number,
  longitude: number,
  date: string,
): Promise<WeatherSnapshot | null> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&daily=weather_code,temperature_2m_max,precipitation_probability_max,sunset` +
      `&timezone=Asia%2FBangkok&start_date=${date}&end_date=${nextDay(date)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = (await res.json()) as {
      daily?: {
        weather_code?: number[];
        temperature_2m_max?: number[];
        precipitation_probability_max?: number[];
        sunset?: string[];
      };
    };
    const daily = json.daily;
    if (!daily?.weather_code?.length) return null;
    const heavyCodes = [65, 67, 82, 95, 96, 99];
    const snapshot: WeatherSnapshot = {
      id: date,
      date,
      source: 'auto',
      temperature: daily.temperature_2m_max?.[0],
      condition: wmoToCondition(daily.weather_code[0]),
      rainProbability: daily.precipitation_probability_max?.[0],
      heavyRain: heavyCodes.includes(daily.weather_code[0]),
      tomorrowRainProbability: daily.precipitation_probability_max?.[1],
      sunset: daily.sunset?.[0]?.slice(11, 16),
      fetchedAt: new Date().toISOString(),
    };
    await db.weather.put(snapshot);
    return snapshot;
  } catch {
    return null;
  }
}

function nextDay(date: string): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export async function saveManualWeather(
  snapshot: Omit<WeatherSnapshot, 'id' | 'source'>,
): Promise<void> {
  await db.weather.put({ ...snapshot, id: snapshot.date, source: 'manual' });
}
