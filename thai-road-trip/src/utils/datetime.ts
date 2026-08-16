import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import { differenceInCalendarDays, parseISO } from 'date-fns';

export const TRIP_TIMEZONE = 'Asia/Bangkok';
export const TRIP_START = '2026-08-30';
export const TRIP_END = '2026-09-05';

/** Date du jour (YYYY-MM-DD) en Asia/Bangkok. */
export function bangkokToday(now: Date = new Date()): string {
  return formatInTimeZone(now, TRIP_TIMEZONE, 'yyyy-MM-dd');
}

/** Heure courante HH:mm en Asia/Bangkok. */
export function bangkokTime(now: Date = new Date()): string {
  return formatInTimeZone(now, TRIP_TIMEZONE, 'HH:mm');
}

export type TripPhase = 'before' | 'during' | 'after';

export function tripPhase(now: Date = new Date()): TripPhase {
  const today = bangkokToday(now);
  if (today < TRIP_START) return 'before';
  if (today > TRIP_END) return 'after';
  return 'during';
}

/** Index (1-based) du jour de voyage courant, borné à [1, nbJours]. */
export function currentTripDayIndex(now: Date = new Date()): number {
  const today = bangkokToday(now);
  const diff = differenceInCalendarDays(parseISO(today), parseISO(TRIP_START));
  const total = differenceInCalendarDays(parseISO(TRIP_END), parseISO(TRIP_START)) + 1;
  return Math.min(Math.max(diff + 1, 1), total);
}

export function daysUntilTrip(now: Date = new Date()): number {
  const today = bangkokToday(now);
  return Math.max(differenceInCalendarDays(parseISO(TRIP_START), parseISO(today)), 0);
}

/** Convertit une date + heure locale Bangkok en Date UTC. */
export function bangkokDateTime(date: string, time: string): Date {
  return fromZonedTime(`${date}T${time}:00`, TRIP_TIMEZONE);
}

/** Millisecondes restantes jusqu'à un événement Bangkok (négatif si passé). */
export function msUntil(date: string, time: string, now: Date = new Date()): number {
  return bangkokDateTime(date, time).getTime() - now.getTime();
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return 'maintenant';
  const totalMin = Math.floor(ms / 60000);
  const days = Math.floor(totalMin / 1440);
  const hours = Math.floor((totalMin % 1440) / 60);
  const min = totalMin % 60;
  if (days > 0) return `${days} j ${hours} h`;
  if (hours > 0) return `${hours} h ${String(min).padStart(2, '0')}`;
  return `${min} min`;
}

export function formatDateFr(date: string): string {
  return formatInTimeZone(parseISO(`${date}T12:00:00Z`), 'UTC', 'EEEE d MMMM', {
    locale: undefined,
  });
}

const FR_DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const FR_MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

/** "dimanche 30 août" sans dépendre des locales date-fns (bundle plus léger). */
export function frenchDate(date: string): string {
  const d = parseISO(`${date}T12:00:00Z`);
  return `${FR_DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${FR_MONTHS[d.getUTCMonth()]}`;
}

export function frenchDateShort(date: string): string {
  const d = parseISO(`${date}T12:00:00Z`);
  return `${d.getUTCDate()} ${FR_MONTHS[d.getUTCMonth()]}`;
}

export function minutesToHuman(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, '0')}`;
}

/** Soustrait des minutes à une heure HH:mm (borné à 00:00). */
export function subtractMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  let total = h * 60 + m - minutes;
  if (total < 0) total += 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
